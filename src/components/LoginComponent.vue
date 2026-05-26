<template>
  <q-page class="flex flex-center login-background q-pa-lg">
    <q-card class="login-card shadow-24">
      <q-card-section class="text-center q-pt-xl q-pb-md">
        <div class="logo-container q-mb-md">
          <q-img :src="varandaoLogo" class="logo-img" spinner-color="primary" />
        </div>
        <div class="text-h5 text-weight-bold text-primary">Bem-vindo</div>
        <div class="text-subtitle2 text-grey-7">Faça login para continuar</div>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <q-form @submit="onSubmit" class="q-gutter-y-lg">
          <q-input
            v-model="email"
            label="E-mail"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="custom-input"
            lazy-rules
            :rules="[(val) => !!val || 'Por favor, digite seu e-mail']"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            type="password"
            label="Senha"
            stack-label
            outlined
            color="primary"
            bg-color="white"
            class="custom-input"
            lazy-rules
            :rules="[(val) => !!val || 'Por favor, digite sua senha']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <div class="q-pt-sm">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              unelevated
              class="full-width login-btn"
            />
          </div>

          <div class="text-center">
            <q-btn
              label="Esqueceu a senha?"
              flat
              dense
              color="secondary"
              class="text-caption text-lowercase"
            />
          </div>

          <div class="q-pt-md">
            <div class="text-center text-grey-7 q-mb-sm text-caption">Não tem uma conta?</div>
            <q-btn
              label="Criar conta"
              outline
              color="secondary"
              class="full-width register-btn"
              @click="onReset"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { api } from '../boot/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import varandaoLogo from 'src/assets/varandao-logo.png';

export default {
  name: 'LoginComponent',
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const usuario = ref({
      email: '',
      senha: '',
    });

    const onSubmit = async () => {
      try {
        usuario.value = {
          email: email.value,
          senha: password.value,
        };

        if (email.value && password.value) {
          $q.loading.show({
            message: 'Autenticando...',
          });

          console.log(usuario.value);

          const logado = await api.post('/auth/login', usuario.value);

          console.log(logado);

          if (logado.status === 201) {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                color: 'positive',
                textColor: 'white',
                icon: 'check',
                message: 'Usuário logado com sucesso!',
              });

              localStorage.setItem('token', logado.data.access_token);
              localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));

              void router.push('/home');
            }, 1500);
          }
        }
      } catch (error) {
        console.log(error);

        $q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: 'Não foi possível logar',
        });
      }
    };

    const onReset = () => {
      email.value = '';
      password.value = '';
    };

    return {
      email,
      password,
      onSubmit,
      onReset,
      varandaoLogo,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-background {
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  background-color: #faf9f6; // Accent color as background for the card
  overflow: hidden;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.login-btn {
  height: 54px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: none;
  letter-spacing: 0.5px;
}

.register-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
}
</style>
