<template>
  <q-page class="flex flex-center q-pa-lg" style="min-height: 100vh">
    <q-card class="card-base shadow-elevated" style="max-width: 420px; width: 100%">
      <q-card-section class="text-center q-pt-xl q-pb-md">
        <div class="flex flex-center q-mb-lg">
          <q-avatar
            size="110px"
            style="
              border: 3px solid rgba(45, 62, 64, 0.15);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            "
          >
            <q-img :src="varandaoLogo" spinner-color="primary" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bold text-primary">Bem-vindo</div>
        <div class="text-body2 text-grey-6 q-mt-xs">Faça login para continuar</div>
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
            class="input-rounded"
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
            class="input-rounded"
            lazy-rules
            :rules="[(val) => !!val || 'Por favor, digite sua senha']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <div class="q-pt-xs">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              unelevated
              class="full-width btn-primary"
            />
          </div>

          <div class="text-center">
            <q-btn
              label="Esqueceu a senha?"
              flat
              dense
              color="secondary"
              class="text-caption"
              style="text-transform: none"
              to="/forgot-password"
            />
          </div>

          <div class="q-pt-sm">
            <div class="text-center text-grey-6 q-mb-sm text-caption">Não tem uma conta?</div>
            <q-btn
              label="Criar conta"
              outline
              color="secondary"
              class="full-width btn-primary"
              style="height: 48px"
              to="/cadastrar"
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

          const logado = await api.post('/auth/login', usuario.value);

          if (logado.status === 201) {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                color: 'positive',
                icon: 'check',
                message: 'Usuário logado com sucesso!',
                textColor: 'white',
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
          color: 'negative',
          textColor: 'white',
          icon: 'error',
          message: 'Não foi possível logar',
        });

        setTimeout(() => {
          $q.loading.hide();
        }, 1500);
      }
    };

    return {
      email,
      password,
      onSubmit,
      varandaoLogo,
    };
  },
};
</script>
