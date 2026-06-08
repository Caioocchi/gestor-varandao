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

    <!-- Search Input Section -->
    <div style="width: 100%; max-width: 600px" class="q-mb-md">
      <q-input
        v-model="pesquisa"
        label="Pesquisar produtos..."
        outlined
        rounded
        dense
        bg-color="white"
        class="input-rounded"
        clearable
        @update:model-value="onSearchInput"
        @clear="limparPesquisa"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="primary" />
        </template>
      </q-input>
    </div>

    <q-infinite-scroll
      ref="infiniteScrollRef"
      @load="onLoad"
      :offset="0"
      style="width: 100%; max-width: 600px"
    >
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
      <q-icon
        :name="ultimaPesquisaEnviada ? 'search_off' : 'group_off'"
        size="80px"
        color="grey-4"
      />
      <div class="text-h6 text-grey-5 q-mt-md">
        {{ ultimaPesquisaEnviada ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado' }}
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import CardProdutoComponent from 'src/components/CardProdutoComponent.vue';
import { onBeforeMount, ref } from 'vue';
import { useQuasar, QInfiniteScroll } from 'quasar';

const $q = useQuasar();

interface Produto {
  _id: string;
  nome: string;
  categoria: string;
}

const produtos = ref<Produto[]>([]);
const pagina = ref(1);
const pesquisa = ref('');
const infiniteScrollRef = ref<QInfiniteScroll | null>(null);

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const ultimaPesquisaEnviada = ref('');

const recarregar = async () => {
  pagina.value = 1;
  produtos.value = [];
  infiniteScrollRef.value?.resume(); // Enable infinite scroll to load again
  await buscarDados();
};

const onSearchInput = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    const valor = pesquisa.value.trim();
    // Only search if the effective query changes (i.e. >= 3 chars, or resetting to '')
    const proximaPesquisa = valor.length >= 3 ? valor : '';
    if (proximaPesquisa !== ultimaPesquisaEnviada.value) {
      void recarregar();
    }
  }, 400);
};

const limparPesquisa = () => {
  pesquisa.value = '';
  void recarregar();
};

const buscarDados = async () => {
  $q.loading.show({
    message: 'Carregando produtos...',
    customClass: 'loading-varandao',
  });
  try {
    const valorPesquisa = pesquisa.value.trim().length >= 3 ? pesquisa.value.trim() : '';
    ultimaPesquisaEnviada.value = valorPesquisa;

    const { data } = await api.get('/produto', {
      params: {
        pagina: pagina.value,
        pesquisa: valorPesquisa || undefined,
      },
    });
    produtos.value = data.produtos || data.data || data;
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

    const valorPesquisa = pesquisa.value.trim().length >= 3 ? pesquisa.value.trim() : '';
    const { data: response } = await api.get('/produto', {
      params: {
        pagina: pagina.value,
        pesquisa: valorPesquisa || undefined,
      },
    });

    const data = response.produtos || response.data || response;

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
