<template>
  <q-page class="flex flex-center q-pa-lg">
    <q-card class="card-base shadow-elevated" style="max-width: 420px; width: 100%">
      <!-- FASE 1: Solicitar Código de Recuperação -->
      <q-card-section v-if="fase === 'solicitar_email'" class="q-px-xl q-py-xl">
        <div class="text-center q-mb-lg">
          <q-icon name="lock_reset" color="primary" size="4rem" />
          <h1 class="text-h5 text-weight-bold text-primary q-mt-md q-mb-xs">Recuperar Senha</h1>
          <p class="text-body2 text-grey-6">
            Insira seu e-mail cadastrado para enviarmos um código de recuperação.
          </p>
        </div>

        <q-form @submit="solicitarToken" class="q-gutter-y-md">
          <q-input
            v-model="email"
            type="email"
            label="E-mail"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="input-rounded"
            lazy-rules
            :rules="[
              (val) => !!val || 'Por favor, digite seu e-mail',
              (val) => /.+@.+\..+/.test(val) || 'Por favor, insira um e-mail válido',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <div class="q-pt-sm">
            <q-btn
              label="Enviar Código"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
              class="full-width btn-primary"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- FASE 2: Inserir e Validar Token -->
      <q-card-section v-if="fase === 'validar_token'" class="q-px-xl q-py-xl">
        <div class="text-center q-mb-lg">
          <q-icon name="security" color="primary" size="4rem" />
          <h1 class="text-h5 text-weight-bold text-primary q-mt-md q-mb-xs">Código de Segurança</h1>
          <p class="text-body2 text-grey-6">
            Digite o código de 6 caracteres enviado para o seu e-mail.
          </p>
        </div>

        <q-form @submit="validarToken" class="q-gutter-y-md">
          <q-input
            v-model="token"
            label="Código de Verificação"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="input-rounded"
            mask="NNNNNN"
            unmasked-value
            lazy-rules
            :rules="[
              (val) => !!val || 'Por favor, digite o código',
              (val) => val.length === 6 || 'O código deve conter 6 caracteres',
            ]"
            style="text-transform: uppercase"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" color="primary" />
            </template>
          </q-input>

          <div class="q-pt-sm">
            <q-btn
              label="Validar Código"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
              class="full-width btn-primary"
            />
          </div>

          <div class="q-pt-xs">
            <q-btn
              :label="countdown > 0 ? `Reenviar Código (${countdown}s)` : 'Reenviar Código'"
              color="secondary"
              outline
              :disable="countdown > 0 || loading"
              @click="reenviarToken"
              class="full-width"
              style="height: 48px; border-radius: 14px; text-transform: none"
            />
          </div>

          <div class="text-center q-mt-md">
            <q-btn
              label="Voltar"
              flat
              dense
              color="secondary"
              class="text-caption text-weight-medium"
              style="text-transform: none"
              @click="fase = 'solicitar_email'"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- FASE 3: Definir Nova Senha -->
      <q-card-section v-if="fase === 'nova_senha'" class="q-px-xl q-py-xl">
        <div class="text-center q-mb-lg">
          <q-icon name="lock" color="primary" size="4rem" />
          <h1 class="text-h5 text-weight-bold text-primary q-mt-md q-mb-xs">Nova Senha</h1>
          <p class="text-body2 text-grey-6">Escolha uma nova senha forte para acessar sua conta.</p>
        </div>

        <q-form @submit="recoverPassword" class="q-gutter-y-md">
          <q-input
            v-model="email"
            label="E-mail"
            stack-label
            outlined
            readonly
            disable
            color="primary"
            bg-color="grey-2"
            style="text-transform: lowercase"
            class="input-rounded text-grey-7"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="grey-6" />
            </template>
          </q-input>

          <q-input
            v-model="newPassword"
            type="password"
            label="Nova senha"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="input-rounded"
            lazy-rules
            :rules="[
              (val) => !!val || 'Por favor, digite a nova senha',
              (val) => val.length >= 6 || 'A senha deve conter no mínimo 6 caracteres',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            type="password"
            label="Confirmar nova senha"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="input-rounded"
            lazy-rules
            :rules="[
              (val) => !!val || 'Por favor, confirme a nova senha',
              (val) => val === newPassword || 'As senhas não coincidem',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" color="primary" />
            </template>
          </q-input>

          <div class="q-pt-sm">
            <q-btn
              label="Alterar Senha"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
              class="full-width btn-primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const router = useRouter();

const email = ref('');
const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const fase = ref('solicitar_email'); // 'solicitar_email' | 'validar_token' | 'nova_senha'

const countdown = ref(0);
let timer: any = null;

const startCountdown = () => {
  countdown.value = 60;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }, 1000);
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const solicitarToken = async () => {
  if (!email.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, insira o seu e-mail.',
    });
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/auth/solicitar-token', {
      email: email.value,
    });

    $q.notify({
      type: 'positive',
      message: response.data?.message || 'Código de recuperação enviado para o seu e-mail.',
    });

    fase.value = 'validar_token';
    startCountdown();
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao solicitar código de recuperação.',
    });
  } finally {
    loading.value = false;
  }
};

const reenviarToken = async () => {
  if (countdown.value > 0) return;

  loading.value = true;
  try {
    const response = await api.post('/auth/solicitar-token', {
      email: email.value,
    });

    $q.notify({
      type: 'positive',
      message: response.data?.message || 'Novo código de recuperação enviado para o seu e-mail.',
    });

    startCountdown();
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao reenviar código de recuperação.',
    });
  } finally {
    loading.value = false;
  }
};

const validarToken = async () => {
  if (!token.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, insira o código de segurança.',
    });
    return;
  }

  loading.value = true;
  try {
    const formattedToken = token.value.toUpperCase();
    const response = await api.post('/auth/validar-token', {
      token: formattedToken,
    });

    if (response.data?.email) {
      email.value = response.data.email;
    }

    $q.notify({
      type: 'positive',
      message: 'Código validado com sucesso!',
    });

    fase.value = 'nova_senha';
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Código inválido ou expirado.',
    });
  } finally {
    loading.value = false;
  }
};

const recoverPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'Preencha todos os campos.',
    });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'As senhas não coincidem.',
    });
    return;
  }

  loading.value = true;
  try {
    const formattedToken = token.value.toUpperCase();
    await api.post('/auth/forgot-password', {
      token: formattedToken,
      novaSenha: newPassword.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Senha alterada com sucesso!',
    });

    router.push('/');
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao alterar senha.',
    });
  } finally {
    loading.value = false;
  }
};
</script>
