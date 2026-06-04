<template>
  <q-page class="q-pa-lg">
    <div class="row items-center no-wrap">
      <div class="column q-pr-lg">
        <div class="text-h4 text-weight-bold text-primary">Eventos</div>
        <div class="text-subtitle1 text-grey-7">Organize e acompanhe seus eventos</div>
      </div>
      <q-btn
        round
        color="primary"
        icon="add"
        size="lg"
        class="shadow-robust"
        to="/eventos/adicionar"
      />
    </div>

    <div v-if="eventos.length > 0" class="column q-gutter-y-md">
      <CardEventoComponent
        v-for="evento in eventos"
        :key="evento._id"
        :evento="evento"
        @deleted="loadEventos"
      />
    </div>

    <div v-else class="text-center q-pa-xl">
      <div class="column items-center">
        <q-icon name="event_busy" size="80px" color="grey-4" />
        <div class="text-h6 text-grey-5 q-mt-md">Nenhum evento encontrado</div>
        <div class="text-body2 text-grey-4 q-mb-lg">Comece criando seu primeiro evento!</div>
        <q-btn
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import CardEventoComponent from 'src/components/CardEventoComponent.vue';

const $q = useQuasar();

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

const loadEventos = async () => {
  $q.loading.show({
    message: 'Carregando eventos...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get('/eventos');
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

onMounted(loadEventos);
</script>

<style lang="scss" scoped>
.btn-rounded {
  border-radius: 8px;
}
</style>
