<template>
  <q-card class="card-base shadow-soft" bordered>
    <q-expansion-item
      expand-separator
      icon="groups"
      header-class="text-primary"
      default-opened
    >
      <template v-slot:header>
        <q-item-section>
          <q-item-label class="text-h6 text-weight-bold text-primary">{{ titulo }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge color="primary" :label="`${selectedCount} selecionado(s)`" />
        </q-item-section>
      </template>

      <q-card-section class="q-pa-lg q-pt-none">
        <div class="row q-col-gutter-md">
          <div v-for="freela in freelas" :key="freela._id" class="col-12 col-sm-6">
            <div
              class="selection-item q-pa-sm rounded-borders row items-center no-wrap"
              :class="[freela.selected ? 'bg-accent-light' : 'bg-grey-1', freela.disabled ? 'text-grey-5' : '']"
              :style="freela.disabled ? 'opacity: 0.6;' : ''"
            >
              <q-checkbox
                v-model="freela.selected"
                :label="freela.nome"
                color="primary"
                class="checkbox-ellipsis col"
                dense
                :disable="freela.disabled"
              />

              <span v-if="freela.disabled" class="text-caption text-negative text-weight-bold q-mr-sm">
                Ocupado
              </span>

              <transition name="fade">
                <div v-if="freela.selected && !freela.disabled" class="q-ml-sm" style="min-width: 120px">
                  <q-select
                    v-model="freela.funcao"
                    :options="funcoes"
                    outlined
                    dense
                    class="small-role-select"
                    bg-color="white"
                    placeholder="Função"
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

interface Freela {
  _id: string;
  nome: string;
  selected: boolean;
  funcao: string;
  disabled?: boolean;
}

const props = defineProps<{
  titulo: string;
  freelas: Freela[];
  funcoes: string[];
}>();

const selectedCount = computed(() => props.freelas.filter((f) => f.selected).length);
</script>

<style lang="scss" scoped>
.selection-item {
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    border-color: rgba(var(--q-primary), 0.1);
  }

  &.bg-accent-light {
    background: rgba(var(--q-primary), 0.05);
    border-color: rgba(var(--q-primary), 0.1);
  }
}

.small-role-select {
  :deep(.q-field__control) {
    height: 32px;
    min-height: 32px;
    font-size: 12px;
  }
  :deep(.q-field__marginal) {
    height: 32px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.checkbox-ellipsis {
  :deep(.q-checkbox__label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
