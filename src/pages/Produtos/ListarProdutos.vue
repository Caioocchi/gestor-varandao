<template>
  <q-page class="q-pa-lg">
    <div
      style="width: 100%; max-width: 600px"
      class="row items-center justify-between q-mb-lg no-wrap"
    >
      <div class="column q-pr-lg">
        <div class="text-h4 text-weight-bold text-primary">Produtos</div>
        <div class="text-subtitle1 text-grey-7">Gerencie seus produtos</div>
      </div>
      <q-btn
        round
        color="primary"
        icon="add"
        size="lg"
        class="shadow-robust"
        to="/produtos/adicionar"
      />
    </div>

    <q-infinite-scroll @load="onLoad" :offset="0" style="width: 100%; max-width: 600px">
      <div class="column q-gutter-y-md">
        <CardProdutoComponent
          v-for="produto in produtos"
          :key="produto._id"
          :id="produto._id"
          :nome="produto.nome"
          :categoria="produto.categoria"
          @deleted="recarregar"
        />
      </div>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="blue" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <div v-if="produtos.length === 0" class="text-center q-pa-xl">
      <q-icon name="group_off" size="80px" color="grey-4" />
      <div class="text-h6 text-grey-5 q-mt-md">Nenhum produto cadastrado</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import CardProdutoComponent from 'src/components/CardProdutoComponent.vue';
import { onBeforeMount, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

interface Produto {
  _id: string;
  nome: string;
  categoria: string;
}

const produtos = ref<Produto[]>([]);
const pagina = ref(1);

const recarregar = async () => {
  pagina.value = 1;
  produtos.value = [];
  await buscarDados();
};

const buscarDados = async () => {
  $q.loading.show({
    message: 'Carregando produtos...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get('/produto', {
      params: { pagina: pagina.value },
    });
    produtos.value = data;
    pagina.value++;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  } finally {
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

onBeforeMount(buscarDados);

const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { data } = await api.get('/produto', {
      params: { pagina: pagina.value },
    });

    if (data.length < 10) {
      done(true);
    }

    if (data.length > 0) {
      produtos.value.push(...data);
      pagina.value++;
      done();
    } else {
      done(true); // Stop infinite scroll
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar produtos',
      icon: 'warning',
    });
    done(true);
  }
};
</script>
