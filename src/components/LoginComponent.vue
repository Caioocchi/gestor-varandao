/* eslint-disable no-use-before-define */
<template>
  <div class="q-pa-md" style="max-width: 768px">
    <div class="text-center q-my-xl">
      <q-img src="/src/assets/varandao-logo.png" style="max-width: 250px; border-radius: 50%" />
    </div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pt-xl">
      <q-input outlined v-model="email" bg-color="white" label="E-mail" />

      <q-input filled type="password" bg-color="white" v-model="password" label="Senha" />

      <div>
        <q-btn label="Entrar" type="submit" color="black" style="width: 100%; height: 56px" />
      </div>
      <div>
        <q-btn label="Cadastrar" flat type="reset" color="secondary" style="width: 100%" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref(null);
    const password = ref(null);

    return {
      email,
      password,

      async onSubmit() {
        console.log(email.value);
        if (email.value === null) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Digite seu e-mail',
          });
        } else if (password.value === null) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Digite sua senha',
          });
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted',
          });
          await router.push('/home');
        }
      },

      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>
