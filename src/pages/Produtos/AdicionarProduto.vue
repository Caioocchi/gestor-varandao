<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Header Section -->
      <div class="q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">
          {{ isEdit ? 'Editar Produto' : 'Novo Produto' }}
        </div>
        <div class="text-subtitle1 text-grey-6">
          {{ isEdit ? 'Atualize os dados do produto' : 'Preencha os dados do produto' }}
        </div>
      </div>

      <FormProduto
        :initialData="produto"
        :submitLabel="isEdit ? 'Salvar Alterações' : 'Adicionar produto'"
        @submit="onSubmit"
        v-if="!loading"
      />

      <div v-else class="row justify-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FormProduto from 'src/components/FormProduto.vue';

const $q = useQuasar();
const $router = useRouter();
const $route = useRoute();

interface Produto {
  nome: string;
  categoria: string;
  unidade: string;
  ativo: boolean;
}

const id = computed(() => $route.params.id as string);
const isEdit = computed(() => !!id.value);
const loading = ref(isEdit.value);

const produto = ref<Produto>({
  nome: '',
  categoria: '',
  unidade: '',
  ativo: true,
});

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await api.get(`/produto/${id.value}`);
      produto.value = data.produto || data.data || data;
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      $q.notify({
        color: 'negative',
        message: 'Erro ao carregar dados do produto.',
        icon: 'error',
      });
      void $router.push('/produtos');
    } finally {
      loading.value = false;
    }
  }
});

const onSubmit = async (formData: Produto) => {
  try {
    $q.loading.show({ message: isEdit.value ? 'Salvando alterações...' : 'Adicionando produto...' });

    if (isEdit.value) {
      await api.put(`/produto/${id.value}`, formData);
    } else {
      await api.post('/produto', formData);
    }

    $q.notify({
      color: 'positive',
      textColor: 'white',
      message: isEdit.value ? 'Produto atualizado com sucesso.' : 'Produto adicionado com sucesso.',
      icon: 'check',
    });
    void $router.push('/produtos');
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'Erro ao salvar produto.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};
</script>
