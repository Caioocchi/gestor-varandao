<template>
  <div class="q-pa-lg" style="max-width: 600px">
    <q-form ref="formRef" @submit="onSubmit" class="q-gutter-y-md">
      <q-card class="form-card shadow-light" bordered>
        <q-card-section class="q-gutter-y-md q-pa-lg">
          <q-input
            outlined
            v-model="nome"
            label="Nome completo"
            stack-label
            color="primary"
            bg-color="white"
            class="custom-input"
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
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input
            outlined
            :type="showPassword ? 'text' : 'password'"
            v-model="senha"
            label="Senha"
            stack-label
            color="primary"
            bg-color="white"
            class="custom-input"
          >
            <template v-slot:prepend>
              <q-icon name="key" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
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
const showPassword = ref(false);

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
        message: 'Criando conta...',
      });

      const usuarioCriado = await api.post('/usuario/create', usuario.value);

      if (usuarioCriado.status === 201 || usuarioCriado.status === 200) {
        const loginResponse = await api.post('/auth/login', {
          email: email.value,
          senha: senha.value,
        });

        if (loginResponse.status === 201 || loginResponse.status === 200) {
          localStorage.setItem('token', loginResponse.data.access_token);
          localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));

          $q.loading.hide();
          $q.notify({
            color: 'positive',
            textColor: 'white',
            icon: 'check',
            message: 'Usuário criado e logado com sucesso!',
          });

          await router.push('/home');
        } else {
          $q.loading.hide();
        }
      } else {
        $q.loading.hide();
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
