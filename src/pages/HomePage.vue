<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 600px; margin: 0 auto">
      <div class="text-center q-mb-lg q-pt-md">
        <div class="text-h4 text-weight-bold" style="color: rgba(255, 255, 255, 0.9)">
          Painel Gestor
        </div>
        <div class="text-body2" style="color: rgba(255, 255, 255, 0.45)">
          Selecione uma categoria para gerenciar
        </div>
      </div>

      <!-- Upcoming Events of the Month Section -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm text-white" style="opacity: 0.9">
        Próximos Eventos de {{ nomeMesAtual }}
      </div>

      <!-- Horizontal Scroll of Skeletons -->
      <div v-if="loading" class="row no-wrap scroll q-gutter-x-md q-pb-md hide-scrollbar q-mb-lg">
        <q-card
          v-for="i in 2"
          :key="i"
          class="card-base shadow-soft"
          style="min-width: 170px; width: 100%"
        >
          <q-card-section class="q-pa-md column justify-between" style="min-height: 110px">
            <div class="row justify-between">
              <q-skeleton type="text" width="40%" />
              <q-skeleton type="text" width="30%" />
            </div>
            <q-skeleton type="text" width="85%" class="q-my-xs" />
            <q-skeleton type="text" width="50%" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Horizontal Scroll Empty State -->
      <div
        v-else-if="proximosEventos.length === 0"
        class="text-center q-pa-md glass-card text-white-section q-mb-lg"
      >
        <q-icon name="event_busy" size="32px" class="q-mb-xs text-grey-4" />
        <div class="text-caption text-grey-4">Nenhum evento agendado para este mês.</div>
      </div>

      <!-- Horizontal Scroll of Event Mini-Cards -->
      <div v-else class="row no-wrap scroll q-gutter-x-md q-pb-md hide-scrollbar q-mb-lg">
        <router-link
          v-for="evento in proximosEventos"
          :key="evento._id"
          :to="`/eventos/visualizar/${evento._id}`"
          class="text-decoration-none"
          style="min-width: 170px; width: 100%"
        >
          <q-card class="feature-card card-base shadow-soft full-height">
            <q-card-section
              class="q-pa-md column justify-between full-height"
              style="min-height: 110px"
            >
              <!-- Data & Hora -->
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <q-badge
                  color="accent-light"
                  text-color="primary"
                  class="text-weight-bold text-caption q-py-xs"
                >
                  {{ obterDia(evento.data) }} {{ obterDiaSemana(evento.data) }}
                </q-badge>
                <div class="text-caption text-grey-6 text-weight-medium">
                  <q-icon name="access_time" size="14px" style="vertical-align: sub" />
                  {{ evento.hora_evento }}
                </div>
              </div>

              <!-- Contratante -->
              <div class="text-subtitle2 text-weight-bold text-primary q-my-xs">
                {{ evento.nome_contratante }}
              </div>

              <!-- Chef -->
              <div class="row items-center text-caption text-grey-6">
                <q-icon name="person" size="14px" class="q-mr-xs text-secondary" />
                <span class="ellipsis col">{{ evento.responsavel || 'Não definido' }}</span>
              </div>
            </q-card-section>
          </q-card>
        </router-link>
      </div>

      <!-- Categories Section Title -->
      <div class="text-subtitle1 text-weight-bold q-mb-sm text-white" style="opacity: 0.9">
        Categorias
      </div>

      <div class="row q-gutter-x-md q-pb-md q-mb-lg categories-grid">
        <div class="col-6">
          <HomeCard route="/freelas" icon="groups" icon-color="primary" title="Freelas" />
        </div>

        <div class="col-6">
          <HomeCard route="/eventos" icon="event" icon-color="secondary" title="Eventos" />
        </div>

        <div class="col-6">
          <HomeCard
            route="/produtos"
            icon="shopping_basket"
            icon-color="accent"
            text-color="primary"
            title="Produtos"
          />
        </div>

        <div class="col-6">
          <HomeCard
            route="/arquivos"
            icon="archive"
            icon-color="green-11"
            text-color="primary"
            title="Arquivos e mensagens"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';
import HomeCard from 'src/components/HomeCard.vue';

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

interface Evento {
  _id: string;
  nome_contratante: string;
  telefone: string;
  endereco: Endereco;
  data: string;
  hora_evento: string;
  hora_saida: string;
  responsavel: string;
  quantidade_pessoas: {
    quantidade_adultos: number | null;
    quantidade_criancas: number | null;
    quantidade_staffs: number | null;
  };
  menu: string;
  bebidas: boolean;
}

const eventos = ref<Evento[]>([]);
const loading = ref(true);

const loadEventos = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/eventos');
    eventos.value = data;
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  } finally {
    loading.value = false;
  }
};

const nomeMesAtual = computed(() => {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  return meses[new Date().getMonth()];
});

const obterDia = (dataStr: string) => {
  if (!dataStr) return '';
  const parts = dataStr.split('-');
  return parts[2] || '';
};

const obterDiaSemana = (dataStr: string) => {
  if (!dataStr) return '';
  const parts = dataStr.split('-').map(Number);
  if (parts.length < 3) return '';
  const [ano, mes, dia] = parts as [number, number, number];
  const data = new Date(ano, mes - 1, dia);
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return diasSemana[data.getDay()] || '';
};

const proximosEventos = computed(() => {
  if (!eventos.value) return [];

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaAtual = String(hoje.getDate()).padStart(2, '0');
  const hojeStr = `${anoAtual}-${mesAtual}-${diaAtual}`;

  return eventos.value
    .filter((evt) => {
      if (!evt.data) return false;
      const parts = evt.data.split('-');
      if (parts.length < 3) return false;

      const [ano, mes] = parts;
      const mesmoMes = ano === String(anoAtual) && mes === mesAtual;
      const noFuturo = evt.data >= hojeStr;

      return mesmoMes && noFuturo;
    })
    .sort((a, b) => a.data.localeCompare(b.data));
});

onMounted(loadEventos);
</script>

<style scoped>
.categories-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  gap: 16px;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.categories-grid :deep(.col-6) {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
}
.categories-grid :deep(.col-6 > a) {
  flex-grow: 1;
}
</style>
