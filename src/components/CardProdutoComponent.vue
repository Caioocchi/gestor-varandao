<template>
  <q-card class="card-base shadow-soft cursor-pointer">
    <q-card-section class="row items-center no-wrap">
      <q-avatar
        size="56px"
        color="primary"
        text-color="white"
        icon="shopping_basket"
        class="q-mr-lg"
      >
      </q-avatar>

      <div class="col">
        <div class="text-h6 text-weight-bold text-primary">{{ nome }}</div>
        <div class="text-body2 text-grey-7">
          {{ categorias.find((c) => c.slug === props.categoria)?.label }}
        </div>
      </div>

      <!-- <q-btn
        flat
        round
        dense
        color="primary"
        icon="edit"
        size="14px"
        :to="`/eventos/editar/${props.id}`"
      /> -->

      <q-btn flat round dense color="negative" icon="delete" size="14px" @click="confirm = true" />
    </q-card-section>
  </q-card>

  <q-dialog v-model="confirm" backdrop-filter="blur(4px)">
    <q-card class="confirm-card card-base">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Confirmar exclusão</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        Você tem certeza que deseja excluir o produto
        <strong>{{ props.nome }}</strong
        >? Esta ação não pode ser desfeita.
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar" color="primary" no-caps v-close-popup />
        <q-btn
          unelevated
          label="Excluir"
          color="negative"
          class="btn-rounded"
          style="padding: 4px 20px"
          @click="deleteProduto(props.id)"
          v-close-popup
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();
const confirm = ref(false);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['deleted']);

const categorias = [
  { slug: 'proteina', label: 'Proteínas' },
  { slug: 'acompanhamento', label: 'Acompanhamentos' },
  {
    slug: 'limpeza_identidade',
    label: 'Limpeza e Identidade',
  },
  {
    slug: 'servico_mesa',
    label: 'Serviço de Mesa',
  },
  {
    slug: 'molho_finalizacao',
    label: 'Molhos e Finalização',
  },
  { slug: 'equipamento', label: 'Equipamentos' },
];

const deleteProduto = async (id: string) => {
  try {
    $q.loading.show({ message: 'Excluindo produto...' });
    await api.post(`/produto/delete/${id}`);

    $q.notify({
      color: 'positive',
      textColor: 'white',
      message: 'Produto excluído com sucesso.',
      icon: 'delete',
    });
    emit('deleted', id);
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'Erro ao excluir evento.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};
</script>
