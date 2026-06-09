<template>
  <q-page class="q-pa-lg flex flex-center">
    <q-card class="card-base shadow-soft q-pa-xl" style="max-width: 400px; width: 100%">
      <q-card-section class="text-center q-pb-md">
        <q-avatar size="64px" color="primary" class="q-mb-md">
          <q-icon name="lock" size="36px" color="white" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-primary">Alterar Senha</div>
        <div class="text-subtitle2 text-grey-6">Digite suas senhas abaixo</div>
      </q-card-section>

      <q-card-section class="q-py-md">
        <q-form @submit="onSubmit" class="column q-gutter-y-md">
          <q-input
            v-model="senhaAtual"
            type="password"
            label="Senha Atual"
            outlined
            dense
            bg-color="white"
            class="input-rounded"
            :rules="[(val) => !!val || 'Senha atual é obrigatória']"
          />

          <q-input
            v-model="novaSenha"
            type="password"
            label="Nova Senha"
            outlined
            dense
            bg-color="white"
            class="input-rounded"
            :rules="[
              (val) => !!val || 'Nova senha é obrigatória',
              (val) => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres',
            ]"
          />

          <q-input
            v-model="confirmarSenha"
            type="password"
            label="Confirmar Nova Senha"
            outlined
            dense
            bg-color="white"
            class="input-rounded"
            :rules="[
              (val) => !!val || 'Confirmação é obrigatória',
              (val) => val === novaSenha || 'As senhas não coincidem',
            ]"
          />

          <div class="row q-gutter-x-sm q-pt-md">
            <q-btn
              flat
              label="Voltar"
              color="primary"
              class="col"
              no-caps
              to="/perfil"
              style="border-radius: 12px; height: 48px"
            />
            <q-btn
              unelevated
              label="Salvar"
              type="submit"
              color="primary"
              class="col btn-primary"
              style="height: 48px; border-radius: 12px"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const router = useRouter();

const senhaAtual = ref('');
const novaSenha = ref('');
const confirmarSenha = ref('');

const onSubmit = async () => {
  $q.loading.show({ message: 'Alterando senha...' });
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    const response = await api.post(
      '/auth/change-password',
      {
        senhaAtual: senhaAtual.value,
        novaSenha: novaSenha.value,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.status === 200 || response.status === 201) {
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: 'Senha alterada com sucesso!',
      });
      void router.push('/perfil');
    }
  } catch (error) {
    console.error(error);
    const axiosError = error as { response?: { data?: { message?: string } } };
    const msg = axiosError.response?.data?.message || 'Erro ao alterar senha.';
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: msg,
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.btn-primary {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
</style>
