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

        <q-toolbar-title class="row items-center">
          <q-avatar size="42px" class="q-mr-md shadow-2">
            <img src="/src/assets/varandao-logo.png" />
          </q-avatar>
          <div class="text-weight-bold letter-spacing-1">
            {{ pageName }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-white text-primary">
      <q-toolbar class="justify-center">
        <q-btn
          flat
          no-caps
          color="negative"
          icon="logout"
          label="Sair do Sistema"
          to="/"
          class="full-width text-weight-bold"
          style="height: 50px"
        />
      </q-toolbar>
    </q-footer>

    <q-page-container class="bg-dark-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
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
