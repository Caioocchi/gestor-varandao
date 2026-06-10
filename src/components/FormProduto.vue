<template>
  <q-form @submit="handleSubmit" class="q-gutter-y-lg">
    <q-card class="card-base" style="width: 100%; max-width: 600px">
      <q-card-section>
        <div class="text-h6 text-weight-bold text-primary q-mb-md">Dados Gerais</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.nome"
              label="Nome"
              outlined
              stack-label
              color="primary"
              bg-color="white"
              class="input-rounded"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.categoria"
              label="Categoria"
              outlined
              stack-label
              color="primary"
              bg-color="white"
              class="input-rounded"
              :options="categorias"
              option-label="label"
              option-value="slug"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Categoria é obrigatória']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.unidade"
              label="Unidade"
              outlined
              stack-label
              color="primary"
              bg-color="white"
              class="input-rounded"
              :options="['kg', 'unidade', 'pacote']"
              :rules="[(val) => !!val || 'Unidade é obrigatória']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle v-model="form.ativo" label="Ativo" color="primary" class="q-mb-md" />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-pt-md">
      <q-btn
        :label="submitLabel"
        type="submit"
        color="primary"
        unelevated
        class="full-width btn-primary shadow-elevated"
        size="lg"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Produto {
  nome: string;
  categoria: string;
  unidade: string;
  ativo: boolean;
}

const props = defineProps<{
  initialData?: Produto;
  submitLabel: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Produto): void;
}>();

const form = ref<Produto>({
  nome: '',
  categoria: '',
  unidade: '',
  ativo: true,
});

const categorias = [
  { label: 'Proteínas', slug: 'proteina' },
  { label: 'Acompanhamentos', slug: 'acompanhamento' },
  { label: 'Limpeza e Identidade', slug: 'limpeza_identidade' },
  { label: 'Serviço de Mesa', slug: 'servico_mesa' },
  { label: 'Molhos e Finalização', slug: 'molho_finalizacao' },
  { label: 'Equipamentos', slug: 'equipamento' },
];

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = { ...newData };
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  emit('submit', { ...form.value });
};
</script>
