<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-blue-grey-10 text-white shadow-10">
      <q-toolbar>
        <q-btn :style="alterarVisibilidade(paginaAtual)" flat :to="alterarRota(pageName)">
          <img src="/src/icons/arrow_back.png" />
        </q-btn>
        <q-toolbar-title :class="paginaAtual === 'Home' ? 'text-center' : 'text-left'">
          <q-avatar>
            <img src="/src/assets/varandao-logo.png" />
          </q-avatar>
          {{ pageName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-btn to="/" no-caps>
      <q-footer bordered class="bg-red text-white shadow-10">
        <q-toolbar class="justify-center"> Sair </q-toolbar>
      </q-footer>
    </q-btn>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const paginaAtual = computed(() => route.path?.toString() || '');
const pageName = computed(() => route.name?.toString() || '');
const visible = ref(false);

// Altera a visibilidade do botão voltar de acordo com a página atual,
// ou seja, se a página atual for 'Home', não tem necessidade de existir um botão voltar
const alterarVisibilidade = (paginaAtual: string): string => {
  if (paginaAtual === '/home') {
    visible.value = false;
    return 'display: none;';
  } else {
    visible.value = true;
    return '';
  }
};

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
