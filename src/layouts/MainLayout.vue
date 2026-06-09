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

        <q-toolbar-title class="row items-center no-wrap">
          <q-avatar size="38px" class="q-mr-sm">
            <img :src="varandaoLogo" style="object-fit: contain" />
          </q-avatar>
          <div
            class="text-weight-bold ellipsis"
            style="font-size: 0.9rem; letter-spacing: 0.3px; white-space: nowrap"
          >
            {{ pageName }}
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-footer v-if="paginaAtual !== '/cadastrar'" class="bg-transparent q-px-md q-pb-md" borderless>
      <div class="glass-nav row items-center justify-around q-py-xs shadow-soft">
        <router-link
          to="/home"
          class="nav-item column items-center justify-center col text-decoration-none"
          :class="{ 'nav-active': paginaAtual === '/home' }"
        >
          <q-icon name="home" size="24px" />
          <span class="text-caption text-weight-bold">Início</span>
        </router-link>

        <router-link
          to="/perfil"
          class="nav-item column items-center justify-center col text-decoration-none"
          :class="{ 'nav-active': paginaAtual === '/perfil' }"
        >
          <q-icon name="person" size="24px" />
          <span class="text-caption text-weight-bold">Perfil</span>
        </router-link>

        <div
          @click="sair"
          class="nav-item column items-center justify-center col cursor-pointer text-decoration-none text-negative-light"
        >
          <q-icon name="logout" size="24px" />
          <span class="text-caption text-weight-bold">Sair</span>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import varandaoLogo from 'src/assets/varandao-logo.png';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const paginaAtual = computed(() => route.path?.toString() || '');
const pageName = computed(() => route.name?.toString() || 'Home');

// Altera a rota de acordo com a página atual
const alterarRota = (pageName: string): string => {
  if (pageName === 'Freelas' || pageName === 'Eventos') {
    return '/home';
  } else if (pageName === 'Adicionar Freela' || pageName === 'Editar Freela') {
    return '/freelas';
  } else if (
    pageName === 'Adicionar Evento' ||
    pageName === 'Visualizar Evento' ||
    pageName === 'Editar Evento'
  ) {
    return '/eventos';
  } else if (pageName === 'Adicionar Produto' || pageName === 'Editar Produto') {
    return '/produtos';
  } else if (pageName === 'Arquivos e Mensagens') {
    return '/home';
  } else if (pageName === 'Arquivos Salvos' || pageName === 'Mensagens WhatsApp') {
    return '/arquivos';
  } else if (pageName === 'Alterar Senha') {
    return '/perfil';
  }
  return '/home';
};

const sair = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');

  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: 'Você foi desconectado.',
  });

  void router.push('/');
};
</script>

<style lang="scss" scoped>
.glass-nav {
  background: rgba(26, 34, 35, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.nav-item {
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  padding: 4px 0;
  gap: 2px;
  text-decoration: none;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
}

.nav-active {
  color: #fff !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);

  .q-icon {
    transform: scale(1.15);
  }
}

.text-negative-light {
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: rgba(239, 83, 80, 1) !important;
  }
}
</style>
