<template>
  <div class="q-pa-lg" style="max-width: 600px">
    <q-form ref="formRef" class="q-gutter-y-md">
      <q-card class="form-card shadow-light" bordered>
        <q-card-section class="q-gutter-y-md q-pa-lg">
          <q-input
            outlined
            v-model="nome"
            label="Nome completo"
            placeholder="Ex: João Silva"
            stack-label
            color="primary"
            bg-color="white"
            class="custom-input"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Digite seu nome completo']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="email"
            label="E-mail"
            stack-label
            color="primary"
            bg-color="white"
            class="custom-input"
            lazy-rules
            :rules="[(val) => (val !== null && val !== '') || 'Digite seu e-mail']"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="primary" />
            </template>
          </q-input>

          <q-input
            outlined
            type="password"
            v-model="senha"
            label="Senha"
            stack-label
            color="primary"
            bg-color="white"
            class="custom-input"
            lazy-rules
            :rules="[
              (val) => val.length > 8 || 'Digite uma senha com mais de 8 dígitos',
              (val) => val.length > 8 || 'Digite uma senha com mais de 8 dígitos',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="event" color="primary" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <div class="q-pt-md">
        <q-btn
          class="custom-submit-btn shadow-robust"
          color="primary"
          label="Cadastrar"
          unelevated
          type="submit"
          @click="onSubmit"
          no-caps
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const nome = ref('');
const email = ref('');
const senha = ref('');

const usuario = ref({
  nome: '',
  email: '',
  senha: '',
});

const onSubmit = async () => {
  try {
    usuario.value = {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
    };

    if (email.value && senha.value) {
      $q.loading.show({
        message: 'Autenticando...',
      });

      const usuarioCriado = await api.post('/usuario/create', usuario.value);

      if (usuarioCriado.status === 201) {
        const loginResponse = await api.post('/auth/login', {
          email: email.value,
          senha: senha.value,
        });

        if (loginResponse.status === 201) {
          setTimeout(() => {
            $q.loading.hide();
            $q.notify({
              color: 'positive',
              textColor: 'white',
              icon: 'check',
              message: 'Usuário criado e logado com sucesso!',
            });

            localStorage.setItem('token', loginResponse.data.access_token);
            localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));

            void router.push('/home');
          }, 1500);
        }
      }
    }
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: 'Erro ao criar usuário. Tente novamente.',
    });
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.custom-submit-btn {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
</style>
