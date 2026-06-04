<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Header Section -->
      <div class="q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">Novo Produto</div>
        <div class="text-subtitle1 text-grey-6">Preencha os dados do produto</div>
      </div>

      <q-form @submit.once="onSubmit" class="q-gutter-y-lg">
        <q-card class="card-base" style="width: 100%; max-width: 600px">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary q-mb-md">Dados Gerais</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="produto.nome"
                  label="Nome"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="produto.categoria"
                  label="Categoria"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  :options="categorias"
                  option-label="nome"
                  option-value="value"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="produto.unidade"
                  label="Unidade"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  :options="['kg', 'unidade', 'pacote']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-toggle v-model="produto.ativo" label="Ativo" color="primary" class="q-mb-md" />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <div class="q-pt-md">
          <q-btn
            label="Adicionar produto"
            type="submit"
            color="primary"
            unelevated
            class="full-width btn-primary shadow-elevated"
            size="lg"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();

interface Produto {
  nome: string;
  categoria: string;
  unidade: string;
  ativo: boolean;
}

const produto = ref<Produto>({
  nome: '',
  categoria: '',
  unidade: '',
  ativo: true,
});

const categorias = [
  { nome: 'Proteínas', value: 'proteina' },
  { nome: 'Acompanhamentos', value: 'acompanhamento' },
  { nome: 'Limpeza e Identidade', value: 'limpeza_identidade' },
  { nome: 'Serviço de Mesa', value: 'servico_mesa' },
  { nome: 'Molhos e Finalização', value: 'molho_finalizacao' },
  { nome: 'Equipamentos', value: 'equipamento' },
];

const onSubmit = async () => {
  try {
    $q.loading.show({ message: 'Adicionando produto...' });

    const payload = {
      nome: produto.value.nome,
      categoria: produto.value.categoria,
      unidade: produto.value.unidade,
      ativo: produto.value.ativo,
    };
    console.log(payload);
    await api.post('/produto', payload);
    $q.notify({
      color: 'positive',
      textColor: 'white',
      message: 'Produto adicionado com sucesso.',
      icon: 'check',
    });
    void $router.push('/produtos');
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'Erro ao adicionar produto.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};
</script>
