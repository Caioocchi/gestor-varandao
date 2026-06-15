<template>
  <q-page class="q-pa-lg">
    <!-- Cabeçalho da Página -->
    <div class="row items-center no-wrap justify-between q-mb-md">
      <div class="column q-pr-lg">
        <div class="text-h4 text-weight-bold text-primary">Eventos</div>
        <div class="text-subtitle1 text-grey-7">Organize e acompanhe seus eventos</div>
      </div>
      <q-btn
        v-if="isAdmin"
        round
        color="primary"
        icon="add"
        size="lg"
        class="shadow-robust"
        to="/eventos/adicionar"
      />
    </div>

    <!-- Filtros de Evento -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Input de Pesquisa de Data -->
      <div class="col-12 col-sm-6">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Pesquisar data (Ex: 11/06/2026, 11, 06, 2026)"
          color="primary"
          clearable
          bg-color="white"
          class="search-input shadow-soft"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Seletor de Status do Evento -->
      <div class="col-12 col-sm-6">
        <q-select
          v-model="selectedFilter"
          :options="filterOptions"
          emit-value
          map-options
          outlined
          dense
          color="primary"
          bg-color="white"
          class="filter-select shadow-soft"
        />
      </div>
    </div>

    <!-- Listagem de Eventos Filtrados -->
    <div v-if="filteredEventos.length > 0" class="column q-gutter-y-md">
      <CardEventoComponent
        v-for="evento in filteredEventos"
        :key="evento._id"
        :evento="evento"
        @deleted="loadEventos"
      />
    </div>

    <!-- Estado Vazio (Nenhum Evento Encontrado) -->
    <div v-else class="text-center q-pa-xl">
      <div class="column items-center">
        <q-icon name="event_busy" size="80px" color="grey-4" />
        <div class="text-h6 text-grey-5 q-mt-md">Nenhum evento encontrado</div>
        <div v-if="isAdmin && eventos.length === 0" class="text-body2 text-grey-4 q-mb-lg">
          Comece criando seu primeiro evento!
        </div>
        <div v-else-if="eventos.length === 0" class="text-body2 text-grey-4 q-mb-lg">
          Você não possui eventos sob sua responsabilidade no momento.
        </div>
        <div v-else class="text-body2 text-grey-4 q-mb-lg">
          Experimente limpar a barra de pesquisa ou mudar a opção de filtro.
        </div>
        <q-btn
          v-if="isAdmin && eventos.length === 0"
          color="primary"
          outline
          label="Criar Evento"
          icon="add"
          to="/eventos/adicionar"
          class="btn-rounded"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import CardEventoComponent from 'src/components/CardEventoComponent.vue';

const $q = useQuasar();

const isAdmin = computed(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]!));
        return payload.role !== 'padrao';
      }
    } catch (e) {
      console.error(e);
    }
  }
  return true;
});

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
const searchQuery = ref('');
const selectedFilter = ref('todos');

const filterOptions = [
  { label: 'Próximos eventos', value: 'proximos' },
  { label: 'Eventos passados', value: 'realizados' },
  { label: 'Todos os eventos', value: 'todos' },
];

const filteredEventos = computed(() => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const formatToYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const hojeStr = formatToYYYYMMDD(hoje);

  return eventos.value.filter((evento) => {
    // 1. Filtragem por Status (Futuro / Passado / Todos)
    if (selectedFilter.value === 'proximos') {
      if (evento.data < hojeStr) return false;
    } else if (selectedFilter.value === 'realizados') {
      if (evento.data >= hojeStr) return false;
    }

    // 2. Filtragem por Pesquisa de Data (DD/MM/YYYY, dia, mês ou ano)
    const query = searchQuery.value ? searchQuery.value.trim() : '';
    if (!query) return true;

    if (!evento.data) return false;
    const [eAno, eMes, eDia] = evento.data.split('-');

    // Divide a busca por barras, traços ou pontos
    const queryParts = query
      .replace(/-/g, '/')
      .replace(/\./g, '/')
      .split('/')
      .map((p) => p.trim())
      .filter(Boolean);

    if (queryParts.length === 3) {
      const qDia = queryParts[0]!.padStart(2, '0');
      const qMes = queryParts[1]!.padStart(2, '0');
      const qAno = queryParts[2];
      return eDia === qDia && eMes === qMes && eAno === qAno;
    }

    if (queryParts.length === 2) {
      const qPart1 = queryParts[0]!.padStart(2, '0');
      const qPart2 = queryParts[1]!.padStart(2, '0');
      // Aceita dia/mês ou mês/ano
      return (eDia === qPart1 && eMes === qPart2) || (eMes === qPart1 && eAno!.endsWith(qPart2));
    }

    if (queryParts.length === 1) {
      const qPart = queryParts[0];
      // Se for ano completo com 4 dígitos (ex: 2026)
      if (qPart!.length === 4) {
        return eAno === qPart;
      }
      const qPadded = qPart!.padStart(2, '0');
      // Compara apenas o dia, apenas o mês, ou o final do ano
      return eDia === qPadded || eMes === qPadded || eAno!.endsWith(qPart!);
    }

    return false;
  });
});

const loadEventos = async () => {
  $q.loading.show({
    message: 'Carregando eventos...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get(`/eventos?periodo=${selectedFilter.value}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    eventos.value = data;
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar eventos',
      icon: 'warning',
    });
  } finally {
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

watch(selectedFilter, () => {
  void loadEventos();
});

onMounted(loadEventos);
</script>

<style lang="scss" scoped>
.btn-rounded {
  border-radius: 8px;
}
.shadow-soft {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
