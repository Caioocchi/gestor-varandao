<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Header Section -->
      <div class="q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary">Novo Evento</div>
        <div class="text-subtitle1 text-grey-6">Preencha os detalhes e selecione os itens do cardápio</div>
      </div>

      <q-form @submit="onSubmit" class="q-gutter-y-lg">
        <!-- Event Details Card -->
        <q-card class="card-base shadow-soft" bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-weight-bold text-primary q-mb-md">Dados Gerais</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.contratante"
                  label="Nome do Contratante"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[val => !!val || 'Contratante é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.local"
                  label="Local do Evento"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[val => !!val || 'Local é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.data"
                  label="Data"
                  type="date"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[val => !!val || 'Data é obrigatória']"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.horario"
                  label="Horário"
                  type="time"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[val => !!val || 'Horário é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="schedule" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  v-model="evento.observacoes"
                  label="Observações"
                  type="textarea"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  rows="3"
                >
                  <template v-slot:prepend>
                    <q-icon name="notes" color="primary" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Meats Selection Card -->
        <q-card class="card-base shadow-soft" bordered>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-weight-bold text-primary">Carnes</div>
              <q-badge color="primary" :label="`${carnesSelecionadas.length} item(s)`" />
            </div>
            
            <div class="row q-col-gutter-md">
              <div v-for="carne in listaCarnes" :key="carne.id" class="col-12 col-sm-6">
                <div 
                  class="selection-item q-pa-sm rounded-borders row items-center"
                  :class="carne.selected ? 'bg-accent-light' : 'bg-grey-1'"
                >
                  <q-checkbox v-model="carne.selected" :label="carne.nome" color="primary" dense />
                  <q-space />
                  <transition name="fade">
                    <div v-if="carne.selected" class="row items-center no-wrap">
                      <q-input
                        v-model.number="carne.quantidade"
                        type="number"
                        outlined
                        dense
                        suffix="kg"
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

        <!-- Supplies Selection Card -->
        <q-card class="card-base shadow-soft" bordered>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-weight-bold text-primary">Insumos</div>
              <q-badge color="secondary" :label="`${insumosSelecionados.length} item(s)`" />
            </div>
            
            <div class="row q-col-gutter-md">
              <div v-for="insumo in listaInsumos" :key="insumo.id" class="col-12 col-sm-6">
                <div 
                  class="selection-item q-pa-sm rounded-borders row items-center"
                  :class="insumo.selected ? 'bg-secondary-light' : 'bg-grey-1'"
                >
                  <q-checkbox v-model="insumo.selected" :label="insumo.nome" color="secondary" dense />
                  <q-space />
                  <transition name="fade">
                    <div v-if="insumo.selected" class="row items-center no-wrap">
                      <q-input
                        v-model.number="insumo.quantidade"
                        type="number"
                        outlined
                        dense
                        :suffix="insumo.unidade"
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

        <!-- Submit Button -->
        <div class="q-pt-md">
          <q-btn
            label="Criar Evento"
            type="submit"
            color="primary"
            unelevated
            class="full-width btn-primary shadow-elevated"
            size="lg"
          />
        </div>
      </q-form>
    </div>

    <!-- Hidden padding to avoid footer/fab overlap -->
    <div style="height: 40px"></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

interface Evento {
  contratante: string;
  local: string;
  data: string;
  horario: string;
  observacoes: string;
}

const evento = ref<Evento>({
  contratante: '',
  local: '',
  data: '',
  horario: '',
  observacoes: ''
});

interface ItemBase {
  id: number;
  nome: string;
  selected: boolean;
  quantidade: number;
  unidade: string;
}

const listaCarnes = ref<ItemBase[]>([
  { id: 1, nome: 'Picanha', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 2, nome: 'Alcatra', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 3, nome: 'Cupim', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 4, nome: 'Linguiça Tosc.', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 5, nome: 'Frango (Tulipa)', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 6, nome: 'Coração', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 7, nome: 'Costela Bovina', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 8, nome: 'Costelinha Suína', selected: false, quantidade: 1, unidade: 'kg' }
]);

const listaInsumos = ref<ItemBase[]>([
  { id: 1, nome: 'Carvão', selected: false, quantidade: 1, unidade: 'sc' },
  { id: 2, nome: 'Sal Grosso', selected: false, quantidade: 1, unidade: 'kg' },
  { id: 3, nome: 'Pratos Descart.', selected: false, quantidade: 50, unidade: 'un' },
  { id: 4, nome: 'Talheres Descart.', selected: false, quantidade: 50, unidade: 'un' },
  { id: 5, nome: 'Guardanapos', selected: false, quantidade: 2, unidade: 'pt' },
  { id: 6, nome: 'Álcool Gel', selected: false, quantidade: 1, unidade: 'un' },
  { id: 7, nome: 'Pão de Alho', selected: false, quantidade: 5, unidade: 'un' },
  { id: 8, nome: 'Farofa', selected: false, quantidade: 1, unidade: 'kg' }
]);

const carnesSelecionadas = computed(() => listaCarnes.value.filter(c => c.selected));
const insumosSelecionados = computed(() => listaInsumos.value.filter(i => i.selected));

const onSubmit = () => {
  $q.loading.show({ message: 'Salvando evento...' });
  
  // Prepare data (for future API integration)
  const payload = {
    ...evento.value,
    carnes: carnesSelecionadas.value.map(c => ({ nome: c.nome, quantidade: c.quantidade })),
    insumos: insumosSelecionados.value.map(i => ({ nome: i.nome, quantidade: i.quantidade }))
  };

  console.log('Salvar Evento:', payload);

  // Simulate API delay
  setTimeout(() => {
    $q.loading.hide();
    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: 'Evento criado com sucesso!'
    });
    router.push('/home');
  }, 1200);
};
</script>

<style lang="scss" scoped>
.selection-item {
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.bg-accent-light {
  background-color: rgba($primary, 0.08);
  border: 1px solid rgba($primary, 0.2);
}

.bg-secondary-light {
  background-color: rgba($secondary, 0.08);
  border: 1px solid rgba($secondary, 0.2);
}

.small-quantity-input {
  width: 90px;
  :deep(.q-field__control) {
    height: 32px;
    min-height: 32px;
  }
  :deep(.q-field__native) {
    padding: 0 4px;
    text-align: center;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
