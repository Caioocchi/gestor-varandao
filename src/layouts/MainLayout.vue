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
        <q-btn
          v-else
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
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

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      class="bg-dark text-white"
      :width="280"
    >
      <div class="column full-height bg-primary text-white">
        <!-- Drawer Header -->
        <div class="row items-center q-pa-md bg-dark text-white q-mb-sm border-bottom-nav">
          <q-avatar size="36px" class="q-mr-sm">
            <img :src="varandaoLogo" style="object-fit: contain" />
          </q-avatar>
          <div>
            <div class="text-subtitle2 text-weight-bold text-white">Varandão</div>
            <div class="text-caption text-grey-5" style="font-size: 0.7rem">Painel de Gestão</div>
          </div>
        </div>

        <!-- Drawer Navigation Items -->
        <q-list class="q-px-sm">
          <q-item
            clickable
            v-close-popup
            to="/home"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Início</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            to="/eventos"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="event" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Eventos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-close-popup
            to="/freelas"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Freelas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-close-popup
            to="/produtos"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="shopping_basket" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Produtos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            to="/arquivos"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="archive" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Arquivos e Mensagens</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            to="/notepad"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="edit_note" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Lista de Compras</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            to="/perfil"
            active-class="drawer-item-active"
            class="drawer-item q-my-xs"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Perfil</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <!-- Logout Drawer Section -->
        <q-list class="q-px-sm q-mb-md">
          <q-item
            clickable
            class="drawer-item text-negative-drawer q-my-xs"
            @click="confirmSair = true"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Sair</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

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
          @click="confirmSair = true"
          class="nav-item column items-center justify-center col cursor-pointer text-decoration-none text-negative-light"
        >
          <q-icon name="logout" size="24px" />
          <span class="text-caption text-weight-bold">Sair</span>
        </div>
      </div>
    </q-footer>

    <q-dialog v-model="confirmSair" backdrop-filter="blur(4px)">
      <q-card class="confirm-card card-base">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">Confirmar saída</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md text-grey-8">
          Você tem certeza que deseja sair de sua conta?
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat label="Cancelar" color="primary" no-caps v-close-popup />
          <q-btn
            unelevated
            label="Sair"
            color="negative"
            class="btn-rounded"
            style="padding: 4px 20px; border-radius: 8px"
            @click="sair"
            v-close-popup
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import varandaoLogo from 'src/assets/varandao-logo.png';
import { registrarPush, inicializarMensagensForeground } from 'src/services/push-notification';
import { api } from 'src/boot/axios';

const confirmSair = ref(false);
const leftDrawerOpen = ref(false);

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const paginaAtual = computed(() => route.path?.toString() || '');
const pageName = computed(() => route.name?.toString() || 'Home');

const isAdmin = computed(() => {
  const tokenVal = localStorage.getItem('token');
  if (tokenVal) {
    try {
      const payload = JSON.parse(atob(tokenVal.split('.')[1]!));
      return payload.role !== 'padrao';
    } catch (e) {
      console.error('Error checking admin role in layout', e);
    }
  }
  return true;
});

const obterTipoDispositivo = (): string => {
  const p = $q.platform.is;
  if (p.android) return 'Android';
  if (p.ios) return 'iOS';
  if (p.ipad) return 'iPad';
  if (p.mobile) return 'Mobile';
  if (p.win) return 'Windows';
  if (p.mac) return 'Mac';
  if (p.linux) return 'Linux';
  return 'Web';
};

onMounted(async () => {
  inicializarMensagensForeground();
  try {
    const pushToken = await registrarPush();

    if (pushToken) {
      console.log('FCM Token obtido:', pushToken);
      localStorage.setItem('fcm_token', pushToken);

      // Enviar token de push para o backend
      await api.post(
        '/auth/push-token',
        {
          token: pushToken,
          deviceType: obterTipoDispositivo(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      console.log('FCM Token registrado no backend com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar notificações push:', error);
  }
});

// Altera a rota de acordo com a página atual
const alterarRota = (pageName: string): string => {
  if (pageName === 'Freelas' || pageName === 'Eventos') {
    return '/home';
  } else if (pageName === 'Adicionar Freela' || pageName === 'Editar Freela') {
    return '/freelas';
  } else if (pageName === 'Editar Evento') {
    const backPath = window.history.state?.back;
    if (typeof backPath === 'string' && backPath.includes('/eventos/visualizar/')) {
      return backPath;
    }
    return '/eventos';
  } else if (pageName === 'Adicionar Evento' || pageName === 'Visualizar Evento') {
    return '/eventos';
  } else if (pageName === 'Adicionar Produto' || pageName === 'Editar Produto') {
    return '/produtos';
  } else if (pageName === 'Arquivos e Mensagens' || pageName === 'Lista de Compras') {
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

.confirm-card {
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
}

.drawer-item {
  color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  transition: all 0.25s ease;
  margin-left: 8px;
  margin-right: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
}

.drawer-item-active {
  background-color: #8b7355 !important;
  color: #ffffff !important;
}

.text-negative-drawer {
  color: rgba(255, 255, 255, 0.7);
  &:hover {
    color: #ff5252 !important;
    background-color: rgba(255, 82, 82, 0.1) !important;
  }
}

.border-bottom-nav {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
