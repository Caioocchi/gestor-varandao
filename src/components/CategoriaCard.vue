<template>
  <q-card class="card-base shadow-soft" bordered>
    <q-expansion-item
      expand-separator
      icon="category"
      header-class="text-primary"
      :default-opened="route.path === '/eventos/adicionar' ? false : true"
    >
      <template v-slot:header>
        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold text-primary">{{ categoria }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge :color="checkboxColor" :label="`${selectedCount} item(s)`" />
        </q-item-section>
      </template>

      <q-card-section class="q-pa-lg q-pt-none">
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
                    v-model="produto.quantidade"
                    type="number"
                    min="0"
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
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface Produto {
  produtoId: string;

  nome: string;
  selected: boolean;
  categoria: string;
  quantidade: number | null;
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
