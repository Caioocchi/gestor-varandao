<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 600px; margin: 0 auto">
      <div class="text-center q-mb-xl q-pt-lg">
        <div class="text-h4 text-weight-bold" style="color: rgba(255, 255, 255, 0.9)">
          Painel Gestor
        </div>
        <div class="text-body1" style="color: rgba(255, 255, 255, 0.45)">
          Selecione uma categoria para gerenciar
        </div>
      </div>

      <div class="column q-gutter-y-md">
        <router-link to="/freelas" class="text-decoration-none">
          <q-card class="feature-card card-base shadow-soft">
            <q-card-section class="row items-center no-wrap q-pa-lg">
              <q-avatar
                size="56px"
                color="primary"
                text-color="white"
                icon="groups"
                class="q-mr-lg"
              />
              <div class="col">
                <div class="text-h6 text-weight-bold text-primary">Freelas</div>
                <div class="text-body2 text-grey-7">Gerencie prestadores de serviço</div>
              </div>
              <q-icon name="chevron_right" size="28px" color="grey-5" />
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/eventos" class="text-decoration-none">
          <q-card class="feature-card card-base shadow-soft">
            <q-card-section class="row items-center no-wrap q-pa-lg">
              <q-avatar
                size="56px"
                color="secondary"
                text-color="white"
                icon="event"
                class="q-mr-lg"
              />
              <div class="col">
                <div class="text-h6 text-weight-bold text-primary">Eventos</div>
                <div class="text-body2 text-grey-7">Organize e acompanhe eventos</div>
              </div>
              <q-icon name="chevron_right" size="28px" color="grey-5" />
            </q-card-section>
          </q-card>
        </router-link>

        <router-link to="/produtos" class="text-decoration-none">
          <q-card class="feature-card card-base shadow-soft">
            <q-card-section class="row items-center no-wrap q-pa-lg">
              <q-avatar
                size="56px"
                color="accent"
                text-color="primary"
                icon="shopping_basket"
                class="q-mr-lg"
              />
              <div class="col">
                <div class="text-h6 text-weight-bold text-primary">Produtos</div>
                <div class="text-body2 text-grey-7">Gerencie produtos</div>
              </div>
              <q-icon name="chevron_right" size="28px" color="grey-5" />
            </q-card-section>
          </q-card>
        </router-link>
      </div>

      <!-- Upcoming Events of the Month Section -->
      <div class="text-h6 text-weight-bold q-mt-xl q-mb-md" style="color: rgba(255, 255, 255, 0.9)">
        Próximos Eventos de {{ nomeMesAtual }}
      </div>

      <div v-if="loading" class="column q-gutter-y-sm">
        <q-card v-for="i in 2" :key="i" class="card-base shadow-soft">
          <q-card-section class="row items-center no-wrap q-pa-md">
            <q-skeleton type="QAvatar" size="48px" class="q-mr-md" />
            <div class="col">
              <q-skeleton type="text" width="60%" class="q-mb-xs" />
              <q-skeleton type="text" width="40%" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-else-if="proximosEventos.length === 0" class="text-center q-pa-lg glass-card text-white-section">
        <q-icon name="event_busy" size="40px" class="q-mb-sm text-grey-4" />
        <div class="text-subtitle2 text-grey-4">Nenhum evento agendado para o restante do mês.</div>
      </div>

      <div v-else class="column q-gutter-y-sm">
        <router-link
          v-for="evento in proximosEventos"
          :key="evento._id"
          :to="`/eventos/visualizar/${evento._id}`"
          class="text-decoration-none"
        >
          <q-card class="feature-card card-base shadow-soft">
            <q-card-section class="row items-center no-wrap q-pa-md">
              <!-- Calendário/Data Badge -->
              <div class="date-badge column items-center justify-center q-mr-md">
                <div class="date-day text-weight-bold text-primary">{{ obterDia(evento.data) }}</div>
                <div class="date-weekday text-uppercase text-weight-medium text-grey-7">{{ obterDiaSemana(evento.data) }}</div>
              </div>

              <!-- Informações do Evento -->
              <div class="col">
                <div class="text-subtitle1 text-weight-bold text-primary ellipsis">
                  {{ evento.nome_contratante }}
                </div>
                <div class="row items-center text-caption text-grey-7 q-gutter-x-sm q-mt-xs">
                  <span class="row items-center">
                    <q-icon name="schedule" size="14px" class="q-mr-xs text-secondary" />
                    {{ evento.hora_evento }}
                  </span>
                  <q-separator vertical class="q-my-xs" />
                  <span class="row items-center">
                    <q-icon name="person" size="14px" class="q-mr-xs text-secondary" />
                    Chef: {{ evento.responsavel || 'Não definido' }}
                  </span>
                </div>
              </div>

              <!-- Chevron -->
              <q-icon name="chevron_right" size="24px" color="grey-5" />
            </q-card-section>
          </q-card>
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

interface Evento {
  _id: string;
  nome_contratante: string;
  telefone: string;
  endereco: Endereco;
  data: string;
  hora_evento: string;
  hora_saida: string;
  responsavel: string;
  quantidade_pessoas: {
    quantidade_adultos: number | null;
    quantidade_criancas: number | null;
    quantidade_staffs: number | null;
  };
  menu: string;
  bebidas: boolean;
}

const eventos = ref<Evento[]>([]);
const loading = ref(true);

const loadEventos = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/eventos');
    eventos.value = data;
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  } finally {
    loading.value = false;
  }
};

const nomeMesAtual = computed(() => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return meses[new Date().getMonth()];
});

const obterDia = (dataStr: string) => {
  if (!dataStr) return '';
  const parts = dataStr.split('-');
  return parts[2] || '';
};

const obterDiaSemana = (dataStr: string) => {
  if (!dataStr) return '';
  const parts = dataStr.split('-').map(Number);
  if (parts.length < 3) return '';
  const [ano, mes, dia] = parts as [number, number, number];
  const data = new Date(ano, mes - 1, dia);
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return diasSemana[data.getDay()] || '';
};

const proximosEventos = computed(() => {
  if (!eventos.value) return [];

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
  const diaAtual = String(hoje.getDate()).padStart(2, '0');
  const hojeStr = `${anoAtual}-${mesAtual}-${diaAtual}`;

  return eventos.value
    .filter((evt) => {
      if (!evt.data) return false;
      const parts = evt.data.split('-');
      if (parts.length < 3) return false;

      const [ano, mes] = parts;
      const mesmoMes = ano === String(anoAtual) && mes === mesAtual;
      const noFuturo = evt.data >= hojeStr;

      return mesmoMes && noFuturo;
    })
    .sort((a, b) => a.data.localeCompare(b.data));
});

onMounted(loadEventos);
</script>

<style lang="scss" scoped>
.feature-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}

.text-decoration-none {
  text-decoration: none;
}

.text-white-section {
  color: rgba(255, 255, 255, 0.75);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.date-badge {
  width: 52px;
  height: 52px;
  background-color: rgba(#8b7355, 0.12); // Using secondary color $secondary
  border: 1px solid rgba(#8b7355, 0.25);
  border-radius: 12px;
  text-align: center;
  flex-shrink: 0;

  .date-day {
    font-size: 1.2rem;
    line-height: 1.2;
  }

  .date-weekday {
    font-size: 0.7rem;
    line-height: 1;
  }
}
</style>

