<template>
  <q-page class="q-pa-lg flex flex-center">
    <q-card class="card-base shadow-soft text-center q-pa-xl" style="max-width: 400px; width: 100%">
      <q-card-section>
        <q-avatar size="100px" color="primary" class="q-mb-md shadow-robust">
          <q-icon name="person" size="64px" color="white" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-primary">
          {{ loading ? 'Carregando...' : user.nome }}
        </div>
        <div class="text-subtitle1 text-grey-6">Varandão Gestão</div>
      </q-card-section>

      <q-card-section>
        <div class="column text-left">
          <!-- E-mail Row -->
          <div class="row q-gutter-x-sm bg-grey-1 rounded-borders">
            <q-icon name="email" color="primary" size="20px" />
            <div class="column">
              <span class="text-caption text-grey-6">E-mail</span>
              <span class="text-body2 text-weight-medium text-grey-9">
                {{ loading ? 'Carregando...' : user.email }}
              </span>
            </div>
          </div>
          <!-- Access Level Row
          <div class="row items-center q-gutter-x-sm bg-grey-1 q-pa-md rounded-borders">
            <q-icon name="shield" color="primary" size="20px" />
            <div class="column">
              <span class="text-caption text-grey-6">Nível de Acesso</span>
              <span class="text-body2 text-weight-medium text-grey-9">Administrador Geral</span>
            </div>
          </div> -->
        </div>
      </q-card-section>

      <!-- Seção de Notificações Push -->
      <q-card-section class="q-pt-none">
        <q-separator class="q-mb-md" />
        <div class="text-subtitle2 text-grey-7 q-mb-xs text-left">Notificações Push</div>
        <div
          class="row items-center q-gutter-x-sm bg-grey-1 q-pa-sm rounded-borders q-mb-sm justify-between"
        >
          <div class="column text-left">
            <span class="text-caption text-grey-6">Token do Dispositivo</span>
            <span
              class="text-caption text-weight-medium text-grey-9 ellipsis block"
              style="max-width: 220px"
            >
              {{ pushToken ? `${pushToken.substring(0, 25)}...` : 'Não registrado' }}
            </span>
          </div>
          <q-btn
            v-if="pushToken"
            flat
            round
            dense
            color="primary"
            icon="content_copy"
            size="sm"
            @click="copiarToken"
          >
            <q-tooltip>Copiar Token</q-tooltip>
          </q-btn>
        </div>

        <q-btn
          unelevated
          class="full-width bg-accent-light text-primary btn-outline-custom"
          label="Testar Notificação Real"
          icon="notifications_active"
          no-caps
          style="height: 48px; border-radius: 12px; margin-left: 0"
          :loading="testandoPush"
          @click="testarPush"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-pt-md column q-gutter-y-sm">
        <!-- Alterar Senha Button -->
        <q-btn
          outline
          color="primary"
          label="Alterar Senha"
          icon="lock"
          no-caps
          class="full-width btn-outline-custom"
          style="height: 48px; border-radius: 12px; margin-left: 0"
          to="/perfil/senha"
        />
        <!-- Logout Button -->
        <q-btn
          unelevated
          color="negative"
          label="Sair da Conta"
          icon="logout"
          no-caps
          class="full-width btn-primary"
          style="height: 48px; border-radius: 12px; margin-left: 0"
          @click="sair"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { registrarPush } from 'src/services/push-notification';

const $q = useQuasar();
const router = useRouter();

interface UserProfile {
  nome: string;
  email: string;
}

const user = ref<UserProfile>({
  nome: '',
  email: '',
});
const loading = ref(true);
const pushToken = ref('');
const testandoPush = ref(false);

const copiarToken = () => {
  if (pushToken.value) {
    navigator.clipboard
      .writeText(pushToken.value)
      .then(() => {
        $q.notify({
          color: 'positive',
          message: 'Token copiado com sucesso!',
          icon: 'check',
        });
      })
      .catch((err) => {
        console.error('Erro ao copiar token:', err);
      });
  }
};

const testarPush = async () => {
  testandoPush.value = true;
  try {
    const token = await registrarPush();
    if (!token) {
      $q.notify({
        color: 'warning',
        textColor: 'grey-9',
        icon: 'warning',
        message: 'Permissão de notificação negada ou não suportada.',
      });
      return;
    }

    pushToken.value = token;

    const userToken = localStorage.getItem('token');
    await api.post(
      '/eventos/teste-notificacao',
      { token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    $q.notify({
      color: 'positive',
      icon: 'check',
      message: 'Notificação de teste solicitada! Verifique seu dispositivo.',
    });
  } catch (error) {
    console.error('Erro ao testar notificação push:', error);
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Falha ao enviar notificação de teste.',
    });
  } finally {
    testandoPush.value = false;
  }
};

const loadProfile = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    const { data } = await api.get<UserProfile>('/auth/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = {
      nome: data.nome,
      email: data.email ? data.email.toLowerCase() : '',
    };
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: 'Não foi possível carregar os dados do perfil.',
    });
  } finally {
    loading.value = false;
  }
};

const sair = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: 'Você foi desconectado.',
  });
  void router.push('/');
};

onMounted(loadProfile);
</script>

<style scoped>
.shadow-robust {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.btn-primary {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.btn-outline-custom {
  font-weight: 600;
  text-transform: none;
  transition: transform 0.2s ease;
}
</style>
