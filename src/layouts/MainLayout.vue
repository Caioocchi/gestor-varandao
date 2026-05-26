<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-py-sm">
        <q-btn
          v-if="paginaAtual !== '/home'"
          flat
          dense
          round
          icon="arrow_back"
          :to="alterarRota(pageName)"
          class="q-mr-sm"
        />

        <q-toolbar-title class="row justify-between">
          <q-avatar size="42px" class="q-mr-md shadow-2">
            <img :src="varandaoLogo" />
          </q-avatar>
          <div class="text-weight-bold letter-spacing-1">
            {{ pageName }}
          </div>
          <div>
            <q-btn-dropdown flat dropdown-icon="more_vert" no-icon-animation :ripple="false">
              <q-list style="justify-items: flex-end">
                <q-item v-close-popup>
                  <q-btn
                    flat
                    no-caps
                    color="negative"
                    icon-right="logout"
                    label="Sair"
                    @click="sair"
                    to="/"
                    class="text-weight-bold justify-between"
                  />
                </q-item>
                <q-separator dark />
                <q-item v-close-popup>
                  <q-btn
                    flat
                    no-caps
                    icon-right="account_circle"
                    label="Perfil"
                    to="/perfil"
                    class="text-weight-bold"
                  />
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-dark-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import varandaoLogo from 'src/assets/varandao-logo.png';

const route = useRoute();
const $q = useQuasar();
const paginaAtual = computed(() => route.path?.toString() || '');
const pageName = computed(() => route.name?.toString() || 'Home');

// Altera a rota de acordo com a página atual
const alterarRota = (pageName: string): string => {
  if (pageName === 'Freelas') {
    return '/home';
  } else if (pageName === 'Adicionar Freela' || pageName === 'Editar Freela') {
    return '/freelas';
  }
  return '/home';
};

const sair = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    message: 'Você foi desconectado.',
  });
};
</script>

<style lang="scss">
.letter-spacing-1 {
  letter-spacing: 0.5px;
}

.q-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.q-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
