<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 600px; margin: 0 auto">
      <!-- Cabeçalho de Boas-vindas -->
      <div class="text-center q-mb-lg q-pt-md">
        <div class="text-h4 text-weight-bold" style="color: rgba(255, 255, 255, 0.9)">
          Olá, {{ nomeUsuario.split(' ')[0] }}
        </div>
        <div class="text-body2" style="color: rgba(255, 255, 255, 0.45)">
          Gerencie e acompanhe seus eventos do Varandão
        </div>
      </div>

      <!-- Seção do Calendário de Eventos -->
      <div class="row items-center justify-between q-mb-sm text-white no-wrap" style="opacity: 0.9">
        <div class="text-subtitle1 text-weight-bold">Calendário de Eventos</div>
        <!-- <q-btn
          flat
          round
          dense
          :color="hasGoogleAuth ? 'green-11' : 'white'"
          :icon="hasGoogleAuth ? 'sync' : 'sync_disabled'"
          size="sm"
          @click="abrirPainelSync"
        >
          <q-badge v-if="hasGoogleAuth" color="green" floating rounded />
          <q-tooltip>{{
            hasGoogleAuth ? 'Sincronizar com Google Agenda' : 'Conectar Google Agenda'
          }}</q-tooltip>
        </q-btn> -->
      </div>

      <!-- Filtro/Seletor de Modo (Mês vs Semana) -->
      <q-card class="glass-card q-mb-md q-pa-sm shadow-soft">
        <div class="row items-center justify-between no-wrap">
          <!-- Navegação de Data -->
          <div class="row items-center q-gutter-x-xs no-wrap">
            <q-btn flat round dense icon="chevron_left" color="white" @click="navegarAnterior" />
            <q-btn
              flat
              dense
              no-caps
              color="white"
              class="text-subtitle2 text-weight-bold text-center text-ellipsis text-white"
              style="
                min-width: 100px;
                max-width: 200px;
                overflow: hidden;
                white-space: nowrap;
                padding: 2px 4px;
                min-height: 24px;
              "
            >
              {{ tituloDataReferencia }}
              <q-menu
                cover
                auto-close
                class="bg-dark text-white q-pa-md shadow-soft"
                style="
                  border-radius: 16px;
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  max-width: 280px;
                "
                @before-show="sincronizarPickerComReferencia"
              >
                <div class="column q-gutter-y-sm">
                  <!-- Ano Header Selector -->
                  <div class="row items-center justify-between no-wrap">
                    <q-btn
                      flat
                      round
                      dense
                      size="sm"
                      icon="chevron_left"
                      color="white"
                      @click.stop="decrementarAnoPicker"
                    />
                    <div class="text-subtitle1 text-weight-bold text-white">
                      {{ anoPicker }}
                    </div>
                    <q-btn
                      flat
                      round
                      dense
                      size="sm"
                      icon="chevron_right"
                      color="white"
                      @click.stop="incrementarAnoPicker"
                    />
                  </div>

                  <q-separator dark />

                  <!-- Grid de Meses -->
                  <div class="row q-col-gutter-xs" style="max-width: 210px">
                    <div v-for="(mesAbrev, index) in mesesPicker" :key="mesAbrev" class="col-4">
                      <q-btn
                        flat
                        dense
                        no-caps
                        :color="mesPicker === index ? 'secondary' : 'white'"
                        :class="{ 'bg-secondary text-white': mesPicker === index }"
                        class="full-width text-caption text-weight-medium"
                        style="border-radius: 8px"
                        :label="mesAbrev"
                        @click="selecionarMesAnoPicker(index)"
                      />
                    </div>
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn flat round dense icon="chevron_right" color="white" @click="navegarProximo" />
          </div>

          <!-- Toggle Mês/Semana -->
          <q-btn-toggle
            v-model="visualizacao"
            toggle-color="secondary"
            color="primary"
            text-color="white"
            toggle-text-color="white"
            dense
            rounded
            unelevated
            no-caps
            :options="[
              { label: 'Mês', value: 'mes' },
              { label: 'Semana', value: 'semana' },
            ]"
            class="btn-toggle-custom"
          />
        </div>
      </q-card>

      <!-- Grid do Calendário -->
      <q-card class="card-base shadow-soft q-mb-lg q-pa-md bg-white overflow-hidden">
        <transition name="calendar-fade" mode="out-in">
          <!-- Visão de Mês -->
          <div v-if="visualizacao === 'mes'" key="mes">
            <!-- Dias da Semana Header -->
            <div
              class="row text-center q-mb-sm text-weight-bold text-grey-7"
              style="font-size: 0.85rem"
            >
              <div class="col" v-for="d in diasDaSemanaSopros" :key="d">{{ d }}</div>
            </div>

            <!-- Mês View (Grid de 6 linhas x 7 colunas) -->
            <div class="calendar-grid">
              <div
                v-for="cell in diasNoGrid"
                :key="cell.dataStr"
                class="calendar-day-cell column items-center justify-center cursor-pointer"
                :class="{
                  'day-not-current': !cell.isCurrentMonth,
                  'day-selected': cell.isSelected,
                  'day-today': cell.isToday,
                }"
                @click="selecionarDia(cell)"
              >
                <span class="day-number">{{ cell.numero }}</span>
                <div class="dots-container row justify-center items-center">
                  <span
                    v-if="cell.hasEvents"
                    class="event-dot"
                    :class="{ 'dot-white': cell.isSelected }"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Visão de Semana (Timeline com horas integrada) -->
          <div v-else key="semana">
            <!-- Linha de 7 dias da Semana -->
            <div class="row justify-around q-mb-md">
              <div
                v-for="cell in diasNaSemana"
                :key="cell.dataStr"
                class="col week-day-cell column items-center justify-center cursor-pointer"
                :class="{
                  'day-selected': cell.isSelected,
                  'day-today': cell.isToday,
                }"
                @click="selecionarDia(cell)"
              >
                <div
                  class="day-name text-caption text-grey-6 text-uppercase q-mb-xs"
                  style="font-size: 0.65rem"
                >
                  {{ obterDiaSemanaAbrev(cell.data) }}
                </div>
                <div class="day-number">{{ cell.numero }}</div>
                <div class="dots-container row justify-center items-center">
                  <span
                    v-if="cell.hasEvents"
                    class="event-dot"
                    :class="{ 'dot-white': cell.isSelected }"
                  ></span>
                </div>
              </div>
            </div>

            <q-separator class="q-mb-md" />

            <!-- Agenda do Dia selecionado (Timeline com horas) -->
            <div class="row justify-start q-mb-sm" style="justify-content: flex-start">
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                icon="arrow_back"
                class="text-weight-bold text-caption"
                style="padding: 2px 4px; border-radius: 8px"
                @click="visualizacao = 'mes'"
              >
                <div class="text-subtitle2 text-weight-bold text-primary">
                  Agenda de {{ dataSelecionadaFormatada }}
                </div>
              </q-btn>
            </div>

            <div
              class="timeline-container relative-position"
              style="
                height: 250px;
                overflow-y: auto;
                border: 1px solid rgba(0, 0, 0, 0.06);
                border-radius: 12px;
              "
            >
              <!-- Linhas de Horas -->
              <div
                v-for="h in horasTimeline"
                :key="h"
                class="hour-row row no-wrap items-center"
                style="
                  height: 60px;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
                  position: relative;
                "
              >
                <div
                  class="hour-label text-caption text-grey-6 text-right q-pr-sm"
                  style="
                    width: 50px;
                    border-right: 1px solid rgba(0, 0, 0, 0.06);
                    font-weight: 600;
                    font-size: 0.75rem;
                  "
                >
                  {{ formatarHoraLabel(h) }}
                </div>
                <div class="col timeline-slot relative-position full-height"></div>
              </div>

              <!-- Cards de Eventos Posicionados Absolutamente -->
              <div
                v-for="item in eventosTimelineDiaPosicionados"
                :key="item.evt._id"
                class="absolute timeline-event-card cursor-pointer q-px-sm q-py-xs column justify-start"
                :style="obterEstiloEventoPosicionado(item)"
                @click="irParaEvento(item.evt._id)"
              >
                <div class="text-subtitle2 text-weight-bold ellipsis text-white leading-tight">
                  {{ item.evt.nome_contratante }}
                </div>
                <div
                  class="text-caption text-white ellipsis opacity-90 row items-center"
                  style="font-size: 0.7rem; line-height: 1.1; margin-top: 1px"
                >
                  <q-icon name="schedule" size="10px" class="q-mr-xs" />
                  <span>{{ item.evt.hora_evento }}</span>
                </div>
                <div
                  class="text-caption text-white ellipsis opacity-85 row items-center"
                  style="font-size: 0.7rem; line-height: 1.1; margin-top: 1px"
                >
                  <q-icon name="mdi-chef-hat" size="10px" class="q-mr-xs" />
                  <span class="ellipsis">
                    {{ item.evt.responsavel ? item.evt.responsavel : 'Não atribuído' }}
                  </span>
                </div>
              </div>

              <!-- Estado Vazio na Timeline -->
              <div
                v-if="eventosTimelineDia.length === 0"
                class="absolute-center text-center text-grey-5"
              >
                <q-icon name="event_available" size="28px" class="q-mb-xs" />
                <div class="text-caption" style="font-size: 0.75rem">Sem eventos agendados</div>
              </div>
            </div>
          </div>
        </transition>
      </q-card>

      <!-- Lista de Eventos do Mês Visualizado -->
      <div class="text-subtitle1 text-weight-bold text-white q-mb-sm">
        Próximos Eventos de {{ tituloDataReferencia }}
      </div>

      <!-- Horizontal Scroll of Skeletons -->
      <div v-if="loading" class="row no-wrap scroll q-gutter-x-md q-pb-md hide-scrollbar q-mb-lg">
        <q-card
          v-for="i in 2"
          :key="i"
          class="card-base shadow-soft"
          style="min-width: 170px; width: 100%"
        >
          <q-card-section class="q-pa-md column justify-between" style="min-height: 110px">
            <div class="row justify-between">
              <q-skeleton type="text" width="40%" />
              <q-skeleton type="text" width="30%" />
            </div>
            <q-skeleton type="text" width="85%" class="q-my-xs" />
            <q-skeleton type="text" width="50%" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Horizontal Scroll Empty State -->
      <div
        v-else-if="eventosDoMesVisualizado.length === 0"
        class="text-center q-pa-md glass-card text-white-section q-mb-lg"
      >
        <q-icon name="event_busy" size="32px" class="q-mb-xs text-grey-4" />
        <div class="text-caption text-grey-4">Nenhum evento agendado para este período.</div>
      </div>

      <!-- Horizontal Scroll of Event Mini-Cards -->
      <div v-else class="row no-wrap scroll q-gutter-x-md q-pb-md hide-scrollbar q-mb-lg">
        <router-link
          v-for="evento in eventosDoMesVisualizado"
          :key="evento._id"
          :to="`/eventos/visualizar/${evento._id}`"
          class="text-decoration-none"
          style="min-width: 170px; width: 100%"
        >
          <q-card class="feature-card card-base shadow-soft full-height">
            <q-card-section class="q-pa-md column justify-between full-height">
              <!-- Data & Hora -->
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <q-badge
                  color="accent-light"
                  text-color="primary"
                  class="text-weight-bold text-caption q-py-xs"
                >
                  {{ obterDia(evento.data) }} {{ obterDiaSemana(evento.data) }}
                </q-badge>
                <div class="text-caption text-grey-6 text-weight-medium">
                  <q-icon name="access_time" size="14px" style="vertical-align: sub" />
                  {{ evento.hora_evento }}
                </div>
              </div>

              <!-- Contratante -->
              <div class="text-subtitle2 text-weight-bold text-primary q-my-xs">
                {{ evento.nome_contratante }}
              </div>

              <!-- Chef -->
              <div class="row items-center text-caption text-grey-6">
                <q-icon name="person" size="14px" class="q-mr-xs text-secondary" />
                <span class="ellipsis col">{{ evento.responsavel || 'Não definido' }}</span>
              </div>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
    </div>

    <!-- Modal do Painel de Sincronização Google -->
    <q-dialog v-model="showSyncDialog" backdrop-filter="blur(4px)">
      <q-card class="confirm-card card-base q-pa-md" style="max-width: 420px; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">Google Agenda</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup :disable="googleSyncing" />
        </q-card-section>

        <!-- Estado de Sincronizando (Loading) -->
        <q-card-section v-if="googleSyncing" class="text-center q-py-lg">
          <q-spinner-oval color="primary" size="48px" class="q-mb-md" />
          <div class="text-subtitle2 text-weight-medium text-primary">{{ googleSyncStep }}</div>
          <div class="text-caption text-grey-6 q-mt-xs">Isso pode levar alguns segundos...</div>
        </q-card-section>

        <template v-else>
          <!-- Estado: Não Conectado (Precisa de Client ID) -->
          <q-card-section v-if="!hasGoogleAuth" class="q-pt-md">
            <div class="text-body2 text-grey-8 q-mb-md">
              Vincule sua conta do Google para enviar os eventos do Varandão para o Google Agenda de
              forma automática.
            </div>

            <q-input
              v-model="clientIdInput"
              label="Google OAuth Client ID"
              placeholder="Cole seu Client ID do Google Cloud aqui"
              outlined
              dense
              stack-label
              color="primary"
              bg-color="white"
              class="input-rounded q-mb-sm"
            />

            <div class="text-caption text-grey-6 q-mb-md" style="line-height: 1.25">
              Para obter um Client ID, crie uma credencial OAuth 2.0 Web Application no Google Cloud
              Console com o escopo de Calendar e adicione esta URL como origem autorizada:
              <br /><strong>{{ origensAutorizadas }}</strong>
            </div>

            <q-btn
              unelevated
              color="primary"
              label="Autorizar e Conectar"
              icon="login"
              class="full-width btn-primary"
              style="height: 48px; border-radius: 12px"
              :disable="!clientIdInput"
              @click="salvarEConectar"
            />
          </q-card-section>

          <!-- Estado: Conectado (Pronto para Sincronizar) -->
          <q-card-section v-else class="q-pt-md">
            <div
              class="row items-center justify-center q-gutter-x-sm bg-green-1 text-green-9 q-pa-md rounded-borders q-mb-md"
            >
              <q-icon name="check_circle" size="24px" />
              <div class="text-subtitle2 text-weight-bold">Status: Conectado com Sucesso</div>
            </div>

            <div class="text-body2 text-grey-8 q-mb-lg text-center">
              Seu calendário do app será sincronizado com a agenda secundária chamada
              <strong>"Varandão"</strong> no seu Google Agenda.
            </div>

            <div class="column q-gutter-y-sm">
              <q-btn
                unelevated
                color="primary"
                label="Sincronizar Agenda Agora"
                icon="sync"
                class="full-width btn-primary"
                style="height: 48px; border-radius: 12px; margin-left: 0"
                @click="executarSincronizacao"
              />

              <div class="row q-col-gutter-x-sm no-wrap q-mt-xs">
                <div class="col-6">
                  <q-btn
                    outline
                    color="primary"
                    label="Alterar Client ID"
                    no-caps
                    dense
                    class="full-width text-caption"
                    style="height: 38px; border-radius: 8px"
                    @click="desvincularParaEditar"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    outline
                    color="negative"
                    label="Desconectar Conta"
                    no-caps
                    dense
                    class="full-width text-caption"
                    style="height: 38px; border-radius: 8px"
                    @click="desconectarGoogle"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </template>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

import {
  getAccessToken,
  clearAccessToken,
  getStoredClientId,
  setStoredClientId,
  initiateAuthFlow,
  handleAuthRedirect,
  syncEvents,
  type LocalEvento,
} from 'src/services/googleCalendar';

const $q = useQuasar();

// State variables
const visualizacao = ref<'mes' | 'semana'>('mes'); // Default view in dashboard
const dataSelecionada = ref<Date>(new Date());
const mesReferencia = ref<Date>(new Date());
const semanaReferencia = ref<Date>(new Date());

const eventos = ref<LocalEvento[]>([]);
const loading = ref(true);
const token = ref(localStorage.getItem('token'));
const nomeUsuario = ref('');
const hasGoogleAuth = ref(false);

const anoPicker = ref(new Date().getFullYear());
const mesPicker = ref(new Date().getMonth());
const mesesPicker = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const sincronizarPickerComReferencia = () => {
  const refDate = visualizacao.value === 'mes' ? mesReferencia.value : semanaReferencia.value;
  anoPicker.value = refDate.getFullYear();
  mesPicker.value = refDate.getMonth();
};

const decrementarAnoPicker = () => {
  anoPicker.value--;
};

const incrementarAnoPicker = () => {
  anoPicker.value++;
};

const selecionarMesAnoPicker = (indexMes: number) => {
  const novoAno = anoPicker.value;
  const novaData = new Date(novoAno, indexMes, 1);
  dataSelecionada.value = novaData;
  if (visualizacao.value === 'mes') {
    mesReferencia.value = novaData;
  } else {
    semanaReferencia.value = novaData;
  }
};
const showSyncDialog = ref(false);
const clientIdInput = ref('');
const googleSyncing = ref(false);
const googleSyncStep = ref('');

// Date references
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
const hojeStr = formatToYYYYMMDD(hoje);

const diasDaSemanaSopros = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const origensAutorizadas = computed(() => {
  return window.location.origin;
});

// Watch view mode to synchronize references
watch(visualizacao, (newVal) => {
  if (newVal === 'semana') {
    semanaReferencia.value = new Date(dataSelecionada.value);
  } else {
    mesReferencia.value = new Date(dataSelecionada.value);
  }
});

// Format Date helpers
function formatToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const dataSelecionadaFormatada = computed(() => {
  const d = dataSelecionada.value;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
});

const tituloDataReferencia = computed(() => {
  const meses = [
    'Jananeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  if (visualizacao.value === 'mes') {
    const mes = mesReferencia.value.getMonth();
    const ano = mesReferencia.value.getFullYear();
    return `${meses[mes]} de ${ano}`;
  } else {
    const mes = semanaReferencia.value.getMonth();
    const ano = semanaReferencia.value.getFullYear();
    return `${meses[mes]} de ${ano}`;
  }
});

const obterDiaSemanaAbrev = (d: Date) => {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return dias[d.getDay()];
};

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

const router = useRouter();

const irParaEvento = (id: string) => {
  void router.push(`/eventos/visualizar/${id}`);
};

const horasTimeline = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const formatarHoraLabel = (h: number) => {
  return `${String(h).padStart(2, '0')}:00`;
};

const eventosTimelineDia = computed(() => {
  const dateStr = formatToYYYYMMDD(dataSelecionada.value);
  return eventosDoDiaMap.value.get(dateStr) || [];
});

interface PosicionedEvento {
  evt: LocalEvento;
  startMin: number;
  endMin: number;
  col: number;
  totalCols: number;
}

const eventosTimelineDiaPosicionados = computed<PosicionedEvento[]>(() => {
  const dateStr = formatToYYYYMMDD(dataSelecionada.value);
  const evts = eventosDoDiaMap.value.get(dateStr) || [];
  if (evts.length === 0) return [];

  // Map to position items and sort
  const sorted: PosicionedEvento[] = evts
    .map((evt) => {
      const startHourStr = evt.hora_evento || '12:00';
      const [sH, sM] = startHourStr.split(':').map(Number);
      const startMin = (sH ?? 12) * 60 + (sM ?? 0);
      const endMin = startMin + 60; // Normalize to exactly 60 minutes (1 hour slot) to fit on its start hour line
      return {
        evt,
        startMin,
        endMin,
        col: 0,
        totalCols: 1,
      };
    })
    .sort((a, b) => a.startMin - b.startMin);

  // Group events into overlapping clusters
  const clusters: PosicionedEvento[][] = [];
  sorted.forEach((item) => {
    let placedInCluster = false;
    for (const cluster of clusters) {
      const clusterStart = Math.min(...cluster.map((c) => c.startMin));
      const clusterEnd = Math.max(...cluster.map((c) => c.endMin));
      const overlaps = item.startMin < clusterEnd && item.endMin > clusterStart;
      if (overlaps) {
        cluster.push(item);
        placedInCluster = true;
        break;
      }
    }
    if (!placedInCluster) {
      clusters.push([item]);
    }
  });

  // Assign columns within each cluster
  clusters.forEach((cluster) => {
    const columns: number[] = []; // stores endMin of last event in each column
    cluster.forEach((item) => {
      let colIndex = -1;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i]! <= item.startMin) {
          colIndex = i;
          columns[i] = item.endMin;
          break;
        }
      }
      if (colIndex === -1) {
        columns.push(item.endMin);
        colIndex = columns.length - 1;
      }
      item.col = colIndex;
    });

    const totalCols = columns.length;
    cluster.forEach((item) => {
      item.totalCols = totalCols;
    });
  });

  return sorted;
});

const obterEstiloEventoPosicionado = (item: PosicionedEvento) => {
  const timelineStartMin = 7 * 60; // Starts at 07:00

  let top = item.startMin - timelineStartMin;
  const height = 70; // Fixed size corresponding to a single hour line (60px minus margins)

  if (top < 0) {
    top = 0;
  }

  // Calculate left position and width dynamically to split screen columns
  return {
    top: `${top}px`,
    height: `${height}px`,
    left: `calc(55px + ${item.col} * ((100% - 60px) / ${item.totalCols}))`,
    width: `calc(((100% - 60px) / ${item.totalCols}) - 2px)`,
    backgroundColor: 'rgba(45, 62, 64, 0.95)',
    borderLeft: '4px solid #8b7355',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    color: '#ffffff',
    zIndex: 10 + item.col,
    overflow: 'hidden',
  };
};

const eventosDoMesVisualizado = computed(() => {
  if (!eventos.value) return [];

  const refDate = visualizacao.value === 'mes' ? mesReferencia.value : semanaReferencia.value;
  const anoRef = String(refDate.getFullYear());
  const mesRef = String(refDate.getMonth() + 1).padStart(2, '0');

  return eventos.value
    .filter((evt) => {
      if (!evt.data) return false;
      const parts = evt.data.split('-');
      if (parts.length < 3) return false;

      const [ano, mes] = parts;
      const mesmoMes = ano === anoRef && mes === mesRef;
      const noFuturo = evt.data >= hojeStr;

      return mesmoMes && noFuturo;
    })
    .sort((a, b) => a.data.localeCompare(b.data));
});

// Fast event lookup map
const eventosDoDiaMap = computed(() => {
  const map = new Map<string, LocalEvento[]>();
  eventos.value.forEach((evt) => {
    if (!evt.data) return;
    const dateStr = evt.data.substring(0, 10);
    if (!map.has(dateStr)) {
      map.set(dateStr, []);
    }
    map.get(dateStr)!.push(evt);
  });
  return map;
});

// Compute grid items for Month view (42 days)
const diasNoGrid = computed(() => {
  const ano = mesReferencia.value.getFullYear();
  const mes = mesReferencia.value.getMonth();

  const primeiroDiaDoMes = new Date(ano, mes, 1);
  const diaSemanaInicial = primeiroDiaDoMes.getDay(); // 0-6
  const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

  const grid = [];

  // Previous month offset days
  const totalDiasMesAnterior = new Date(ano, mes, 0).getDate();
  for (let i = diaSemanaInicial - 1; i >= 0; i--) {
    const dia = totalDiasMesAnterior - i;
    const dataCell = new Date(ano, mes - 1, dia);
    grid.push({
      data: dataCell,
      numero: dia,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= totalDiasNoMes; i++) {
    const dataCell = new Date(ano, mes, i);
    grid.push({
      data: dataCell,
      numero: i,
      isCurrentMonth: true,
    });
  }

  // Next month offset days to fill 42 cells (6 rows x 7 days)
  const remainingCells = 42 - grid.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dataCell = new Date(ano, mes + 1, i);
    grid.push({
      data: dataCell,
      numero: i,
      isCurrentMonth: false,
    });
  }

  return grid.map((cell) => {
    const dataStr = formatToYYYYMMDD(cell.data);
    const evts = eventosDoDiaMap.value.get(dataStr) || [];
    return {
      ...cell,
      dataStr,
      isToday: dataStr === hojeStr,
      isSelected: dataStr === formatToYYYYMMDD(dataSelecionada.value),
      hasEvents: evts.length > 0,
      eventos: evts,
    };
  });
});

// Compute grid items for Week view (7 days)
const diasNaSemana = computed(() => {
  const start = new Date(semanaReferencia.value);
  start.setHours(0, 0, 0, 0);
  const dayOfWeek = start.getDay();
  start.setDate(start.getDate() - dayOfWeek);

  const grid = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    grid.push(d);
  }

  return grid.map((d) => {
    const dataStr = formatToYYYYMMDD(d);
    const evts = eventosDoDiaMap.value.get(dataStr) || [];
    return {
      data: d,
      numero: d.getDate(),
      dataStr,
      isToday: dataStr === hojeStr,
      isSelected: dataStr === formatToYYYYMMDD(dataSelecionada.value),
      hasEvents: evts.length > 0,
      eventos: evts,
    };
  });
});

// Set username
if (token.value) {
  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]!));
    nomeUsuario.value = payload.nome || 'Usuário';
  } catch (e) {
    console.error('Error checking user payload', e);
  }
}

// Load events from local API
const loadEventos = async () => {
  loading.value = true;
  $q.loading.show({
    message: 'Carregando painel gestor...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get('/eventos?periodo=todos', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    eventos.value = data;
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  } finally {
    loading.value = false;
    setTimeout(() => {
      $q.loading.hide();
    }, 400);
  }
};

// Selection handler
const selecionarDia = (cell: { data: Date; isCurrentMonth?: boolean }) => {
  dataSelecionada.value = cell.data;
  if (visualizacao.value === 'mes') {
    if (cell.isCurrentMonth === false) {
      mesReferencia.value = new Date(cell.data.getFullYear(), cell.data.getMonth(), 1);
    }
    visualizacao.value = 'semana';
  }
};

// Navigation handlers
const navegarAnterior = () => {
  if (visualizacao.value === 'mes') {
    mesReferencia.value = new Date(
      mesReferencia.value.getFullYear(),
      mesReferencia.value.getMonth() - 1,
      1,
    );
  } else {
    const d = new Date(semanaReferencia.value);
    d.setDate(d.getDate() - 7);
    semanaReferencia.value = d;
  }
};

const navegarProximo = () => {
  if (visualizacao.value === 'mes') {
    mesReferencia.value = new Date(
      mesReferencia.value.getFullYear(),
      mesReferencia.value.getMonth() + 1,
      1,
    );
  } else {
    const d = new Date(semanaReferencia.value);
    d.setDate(d.getDate() + 7);
    semanaReferencia.value = d;
  }
};

// Sync handlers
// const abrirPainelSync = () => {
//   showSyncDialog.value = true;
// };

const salvarEConectar = () => {
  if (!clientIdInput.value) return;
  setStoredClientId(clientIdInput.value.trim());
  initiateAuthFlow(clientIdInput.value.trim());
};

const executarSincronizacao = async () => {
  googleSyncing.value = true;
  googleSyncStep.value = 'Iniciando sincronização...';
  try {
    const result = await syncEvents((step) => {
      googleSyncStep.value = step;
    });

    $q.notify({
      color: 'positive',
      icon: 'check',
      message: `Sincronização concluída! Google: +${result.createdGoogle} criados, ~${result.updatedGoogle} atualizados, -${result.deletedGoogle} removidos. App: +${result.createdLocal} importados.`,
      timeout: 5000,
    });

    await loadEventos();
  } catch (error: unknown) {
    console.error(error);
    const err = error as {
      response?: { data?: { error?: { message?: string } } };
      message?: string;
    };
    const msg = err.response?.data?.error?.message || err.message || String(error);
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Falha na sincronização: ${msg}`,
    });
  } finally {
    googleSyncing.value = false;
    showSyncDialog.value = false;
  }
};

const desvincularParaEditar = () => {
  clearAccessToken();
  hasGoogleAuth.value = false;
};

const desconectarGoogle = () => {
  clearAccessToken();
  hasGoogleAuth.value = false;
  showSyncDialog.value = false;
  $q.notify({
    color: 'info',
    icon: 'link_off',
    message: 'Conta Google desvinculada.',
  });
};

onMounted(async () => {
  // Check redirect token
  const redirected = handleAuthRedirect();
  if (redirected) {
    hasGoogleAuth.value = true;
    $q.notify({
      color: 'positive',
      icon: 'check',
      message: 'Google Agenda vinculada com sucesso!',
    });
    // Run sync immediately on return
    void executarSincronizacao();
  } else {
    hasGoogleAuth.value = getAccessToken() !== null;
  }

  // Load events
  await loadEventos();

  // Load Client ID
  clientIdInput.value = getStoredClientId();
});
</script>

<style lang="scss" scoped>
/* Estilos do Calendário */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  column-gap: 4px;
}

.calendar-day-cell {
  aspect-ratio: 1;
  border-radius: 12px;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px;

  &:hover {
    background-color: rgba(45, 62, 64, 0.08);
  }
}

.week-day-cell {
  border-radius: 12px;
  transition: all 0.2s ease;
  padding: 8px 4px;

  &:hover {
    background-color: rgba(45, 62, 64, 0.08);
  }
}

.day-not-current {
  opacity: 0.35;
  .day-number {
    color: #9e9e9e;
  }
}

.day-today {
  border: 2px solid #2d3e40;
  font-weight: 700;
}

.day-selected {
  background-color: #8b7355 !important;
  color: #ffffff !important;
  font-weight: 700;

  .day-number {
    color: #ffffff !important;
  }
  .day-name {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  &:hover {
    background-color: #8b7355 !important;
  }
}

.day-number {
  font-size: 1.05rem;
  color: #2d3e40;
}

.dots-container {
  height: 6px;
  margin-top: 2px;
}

.event-dot {
  width: 6px;
  height: 6px;
  background-color: #8b7355;
  border-radius: 50%;
}

.dot-white {
  background-color: #ffffff !important;
}

.btn-toggle-custom {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.confirm-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
}

.btn-primary {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: none;
}

/* Transições com Blur do Calendário */
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.calendar-fade-enter-from {
  opacity: 0;
  filter: blur(8px);
  transform: scale(0.98);
}

.calendar-fade-leave-to {
  opacity: 0;
  filter: blur(8px);
  transform: scale(1.02);
}
</style>
