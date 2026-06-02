<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="column">
        <div class="text-h4 text-weight-bold text-primary">Freelas</div>
        <div class="text-subtitle1 text-grey-7">Gerencie seus prestadores de serviço</div>
      </div>
      <q-btn
        round
        color="primary"
        icon="add"
        size="lg"
        class="shadow-robust"
        to="/freelas/adicionar"
      >
        <q-tooltip>Adicionar Novo Freela</q-tooltip>
      </q-btn>
    </div>

    <div class="column q-gutter-y-md">
      <CardFreelaComponent
        v-for="freela in freelas"
        :key="freela._id"
        :id="freela._id"
        :nome="freela.nome"
        :aniversario="freela.dt_nascimento"
        :pix="freela.pix"
        :telefone="freela.telefone"
        :url-foto="freela.urlFoto"
        @deleted="loadFreelas"
      />
    </div>

    <div v-if="freelas.length === 0" class="text-center q-pa-xl">
      <q-icon name="group_off" size="80px" color="grey-4" />
      <div class="text-h6 text-grey-5 q-mt-md">Nenhum freela cadastrado</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import CardFreelaComponent from 'src/components/CardFreelaComponent.vue';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

interface Freela {
  _id: string;
  nome: string;
  dt_nascimento: string;
  pix: string;
  telefone: string;
  cpf: string;
  urlFoto: string;
}

const freelas = ref<Freela[]>([]);

const loadFreelas = async () => {
  $q.loading.show({
    message: 'Carregando freelas...',
  });
  try {
    const { data } = await api.get('/freelas');
    freelas.value = data;
  } catch (error) {
    console.error('Erro ao carregar freelas:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar freelas',
      icon: 'warning',
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(loadFreelas);
</script>
