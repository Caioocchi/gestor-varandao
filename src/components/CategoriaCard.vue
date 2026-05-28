<template>
  <q-card class="card-base shadow-soft" bordered>
    <q-card-section class="q-pa-lg">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-weight-bold text-primary">{{ categoria }}</div>
        <q-badge :color="checkboxColor" :label="`${selectedCount} item(s)`" />
      </div>

      <div class="row q-col-gutter-md">
        <div v-for="produto in produtos" :key="produto.produtoId" class="col-12 col-sm-6">
          <div
            class="selection-item q-pa-sm rounded-borders row items-center no-wrap"
            :class="produto.selected ? 'bg-accent-light' : 'bg-grey-1'"
          >
            <q-checkbox
              v-model="produto.selected"
              :label="produto.nome"
              :color="checkboxColor"
              class="checkbox-ellipsis col"
              dense
            />

            <transition name="fade">
              <div v-if="produto.selected" class="q-ml-sm">
                <q-input
                  v-model.number="produto.quantidade"
                  type="number"
                  outlined
                  dense
                  :suffix="produto.unidade || 'un'"
                  class="small-quantity-input"
                  bg-color="white"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Produto {
  produtoId: number;
  nome: string;
  selected: boolean;
  categoria: string;
  quantidade: number;
  unidade: string;
}

const props = defineProps<{
  categoria: string;
  produtos: Produto[];
  color?: string;
}>();

const selectedCount = computed(() => props.produtos.filter((produto) => produto.selected).length);
const checkboxColor = computed(() => props.color ?? 'primary');
</script>
