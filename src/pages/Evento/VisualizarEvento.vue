<template>
  <q-page class="q-pa-md">
    <div class="full-width" style="max-width: 900px; margin: 0 auto">
      <!-- Header Section -->
      <div class="row items-center justify-between q-mb-md">
        <div class="column">
          <div class="text-h4 text-weight-bold text-primary">Detalhes do Evento</div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Sidebar Info -->
        <div class="col-12 col-md-4">
          <q-card class="card-base shadow-soft full-height">
            <q-card-section class="q-pa-lg">
              <div class="text-overline text-primary text-weight-bold q-mb-sm">
                Chef responsável
              </div>
              <div class="row items-center q-mb-md">
                <q-icon name="mdi-chef-hat" color="grey-6" size="20px" class="q-mr-sm" />
                <div class="text-body1 text-weight-medium">
                  {{ evento.responsavel ? evento.responsavel : 'Não definido' }}
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-overline text-primary text-weight-bold q-mb-sm">Contratante</div>
              <div class="row items-center q-mb-md">
                <q-icon name="person" color="grey-6" size="20px" class="q-mr-sm" />
                <div class="text-body1 text-weight-medium">{{ evento.nome_contratante }}</div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-overline text-primary text-weight-bold q-mb-sm">Contato</div>
              <div class="row items-center q-mb-md">
                <q-icon name="phone" color="grey-6" size="20px" class="q-mr-sm" />
                <div class="text-body1 text-weight-medium">{{ evento.telefone }}</div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-overline text-primary text-weight-bold q-mb-sm">
                Data e hora do evento
              </div>
              <div class="row items-center q-mb-xs">
                <q-icon name="event" color="primary" size="20px" class="q-mr-sm" />
                <div class="text-body1">{{ formatarData(evento.data) }}</div>
              </div>
              <div class="row items-center q-mb-md">
                <q-icon name="schedule" color="primary" size="20px" class="q-mr-sm" />
                <div class="text-body1">{{ evento.hora_evento }}</div>
              </div>

              <div v-if="evento.hora_saida && evento.hora_saida != '' && evento.hora_saida != null">
                <q-separator class="q-my-lg" />

                <div class="text-overline text-primary text-weight-bold q-mb-sm">
                  Horário de saída para o evento
                </div>
                <div class="row items-center q-mb-md">
                  <q-icon name="schedule" color="primary" size="20px" class="q-mr-sm" />
                  <div class="text-body1">{{ evento.hora_saida }}</div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-overline text-primary text-weight-bold q-mb-sm">Resumo</div>
              <div class="row items-center q-mb-xs">
                <q-icon name="groups" color="secondary" size="20px" class="q-mr-sm" />
                <div class="text-body1">
                  <span>
                    {{ evento.quantidade_pessoas.quantidade_adultos || 0 }} Adultos,
                    {{ evento.quantidade_pessoas.quantidade_criancas || 0 }} Crianças,
                    {{ evento.quantidade_pessoas.quantidade_staffs || 0 }} Staffs
                  </span>
                </div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-icon name="restaurant_menu" color="secondary" size="20px" class="q-mr-sm" />
                <div class="text-body1">{{ evento.menu }}</div>
              </div>
              <div class="row items-center q-mb-xs">
                <q-icon name="local_bar" color="secondary" size="20px" class="q-mr-sm" />
                <div class="text-body1">
                  Terá bebidas?
                  <span class="text-weight-bold text-secondary">{{
                    evento.bebidas ? 'Sim' : 'Não'
                  }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Main Info -->
        <div class="col-12 col-md-8">
          <div class="column q-gutter-y-lg">
            <!-- Address Card -->

            <q-card class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md justify-between">
                  <div class="text-h6 text-weight-bold text-primary row items-center">
                    <q-icon name="location_on" color="primary" size="24px" />
                    Localização
                  </div>
                  <div class="text-subtitle2 text-weight-bold text-secondary text-right">
                    <q-btn
                      flat
                      dense
                      no-caps
                      :ripple="false"
                      label="Abrir mapa"
                      @click="abrirMapa"
                    />
                  </div>
                </div>
                <div class="text-body1 text-grey-8">{{ formatarEndereco(evento.endereco) }}</div>
                <div v-if="evento.endereco.cep" class="text-caption text-grey-6 q-mt-xs">
                  CEP: {{ evento.endereco.cep }}
                </div>
              </q-card-section>
            </q-card>

            <!-- Freelas Card -->
            <q-card class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-lg">
                  <div class="row items-center">
                    <q-icon name="person" color="primary" size="24px" class="q-mr-sm" />
                    <div class="text-h6 text-weight-bold text-primary">Freelas</div>
                  </div>
                </div>

                <div v-if="evento.freelas?.length > 0" class="column q-gutter-y-md">
                  <div v-for="freela in evento.freelas" :key="freela.nome" class="item-group">
                    <div
                      class="text-subtitle2 text-weight-bold text-secondary q-mb-sm row justify-between checkbox-ellipsis"
                    >
                      <div class="ellipsis col">
                        {{ freela.nome }}
                      </div>
                      <div class="text-no-wrap">
                        {{ freela.funcao }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center q-pa-xl text-grey-5">
                  <q-icon name="info" size="48px" class="q-mb-md" />
                  <div>Nenhum Freela selecionado para este evento.</div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Imagens Card (HTML puro) -->
            <div
              v-if="evento.imagens && evento.imagens.length > 0"
              class="card-base shadow-soft q-pa-lg"
            >
              <div class="row items-center q-mb-md">
                <q-icon name="image" color="primary" size="24px" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold text-primary">Imagens do Evento</div>
              </div>

              <div class="row q-col-gutter-sm">
                <div
                  v-for="(img, idx) in evento.imagens"
                  :key="idx"
                  class="col-4 col-sm-3 col-md-2"
                >
                  <div
                    class="overflow-hidden cursor-pointer image-hover-zoom"
                    style="
                      aspect-ratio: 1;
                      border-radius: 12px;
                      border: 1px solid rgba(0, 0, 0, 0.12);
                    "
                    @click="abrirImagem(img)"
                  >
                    <img
                      :src="img"
                      class="full-width full-height"
                      style="object-fit: cover; display: block"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Items Card -->
            <q-card class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-col-gutter-sm q-mb-lg">
                  <div class="row items-center col-12 col-sm-auto">
                    <q-icon
                      name="shopping_basket"
                      color="primary"
                      size="24px"
                      class="q-mr-sm col-auto"
                    />
                    <div
                      v-if="!modoPosEvento"
                      class="text-h6 text-weight-bold text-primary col"
                      style="word-break: break-word"
                    >
                      Lista de compras
                    </div>
                    <div
                      v-else
                      class="text-h6 text-weight-bold text-primary col"
                      style="word-break: break-word"
                    >
                      Itens retornados
                    </div>
                  </div>
                  <div
                    class="row items-center q-gutter-x-md col-12 col-sm-auto justify-between justify-sm-end"
                  >
                    <q-toggle
                      v-model="modoPosEvento"
                      label="Modo Pós-Evento"
                      color="secondary"
                      left-label
                      class="text-weight-medium text-caption"
                    />
                    <q-chip outline color="secondary" text-color="white" :ripple="false">
                      {{ evento.itens?.length || 0 }} item(s)
                    </q-chip>
                  </div>
                </div>

                <!-- Filtro de busca -->
                <div v-if="evento.itens && evento.itens.length > 0" class="q-mb-md">
                  <q-input
                    v-model="filtroTexto"
                    outlined
                    dense
                    placeholder="Buscar item"
                    clearable
                    clear-icon="close"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>

                <div v-if="ordenadosItens.length > 0" class="column q-gutter-y-md">
                  <q-list bordered separator class="rounded-borders overflow-hidden">
                    <q-item
                      v-for="item in ordenadosItens"
                      :key="item.produtoId || item.nome"
                      class="q-py-md column items-stretch"
                      :clickable="!modoPosEvento"
                      @click="!modoPosEvento && toggleItem(item)"
                    >
                      <!-- Linha Superior: Checkbox/Icone + Nome + Badge de Status/Consumo -->
                      <div class="row items-center no-wrap full-width justify-between">
                        <div v-if="!modoPosEvento" @click.stop class="col-auto">
                          <q-checkbox
                            v-model="checkedItems[item.produtoId || item.nome]"
                            dense
                            color="secondary"
                          >
                            <div
                              class="text-weight-medium text-grey-9"
                              :class="{
                                'text-strike text-grey-5':
                                  !modoPosEvento && checkedItems[item.produtoId || item.nome],
                              }"
                            >
                              {{ item.nome }}
                            </div>
                          </q-checkbox>
                        </div>

                        <!-- Nome do Item -->
                        <div
                          v-else
                          class="text-weight-medium text-grey-9"
                          :class="{
                            'text-strike text-grey-5':
                              !modoPosEvento && checkedItems[item.produtoId || item.nome],
                          }"
                        >
                          {{ item.nome }}
                        </div>

                        <!-- Badge de Status Geral/Quantidade original ou cálculo de consumo -->
                        <div class="q-ml-sm">
                          <template v-if="modoPosEvento">
                            <q-badge
                              v-if="
                                item.categoria === 'proteina' ||
                                item.categoria === 'acompanhamento' ||
                                item.nome === 'Carvão'
                              "
                              :color="calcularConsumo(item) > 0 ? 'accent-light' : 'grey-3'"
                              :text-color="calcularConsumo(item) > 0 ? 'primary' : 'grey-6'"
                              class="q-pa-xs text-caption text-weight-bold"
                            >
                              Usado: {{ formatarNumero(calcularConsumo(item)) }}
                              {{ item.unidade }}
                            </q-badge>
                            <q-badge
                              v-else
                              :color="calcularFalta(item) > 0 ? 'red-1' : 'green-1'"
                              :text-color="calcularFalta(item) > 0 ? 'negative' : 'positive'"
                              class="q-pa-xs text-caption text-weight-bold"
                            >
                              {{
                                calcularFalta(item) > 0
                                  ? `Falta: ${formatarNumero(calcularFalta(item))} ${item.unidade}`
                                  : 'Completo'
                              }}
                            </q-badge>
                          </template>
                          <q-badge
                            v-else
                            :color="
                              checkedItems[item.produtoId || item.nome] ? 'grey-3' : 'accent-light'
                            "
                            :text-color="
                              checkedItems[item.produtoId || item.nome] ? 'grey-6' : 'primary'
                            "
                            class="q-pa-sm text-body2"
                          >
                            {{ formatarNumero(item.quantidade) }} {{ item.unidade }}
                          </q-badge>
                        </div>
                      </div>

                      <!-- Linha Inferior (Controles pós-evento): Quantidade Levada e Controles de Retorno -->
                      <div
                        v-if="modoPosEvento"
                        class="row items-center justify-between full-width q-mt-sm"
                      >
                        <div class="text-caption text-grey-6">
                          Levado:
                          <span class="text-weight-bold text-grey-8"
                            >{{ formatarNumero(item.quantidade) }}
                            {{ item.unidade === 'unidade' ? 'un' : item.unidade }}</span
                          >
                        </div>

                        <div class="row no-wrap items-center q-gutter-x-sm">
                          <!-- Botão de preenchimento completo -->
                          <div class="text-caption text-grey-6">Retornou:</div>
                          <q-input
                            v-model.number="item.quantidade_retornada"
                            type="number"
                            step="any"
                            borderless
                            dense
                            class="text-center bg-grey-2 rounded-borders q-mx-xs"
                            style="width: 30px; height: 35px"
                            input-class="text-center text-weight-bold text-grey-9 text-caption"
                            @change="validaRetorno(item)"
                            @click.stop
                          />
                          <span
                            class="text-caption text-grey-7 q-ml-xs text-weight-bold"
                            style="min-width: 20px"
                            >{{ item.unidade === 'unidade' ? 'un' : item.unidade }}</span
                          >
                        </div>
                      </div>
                    </q-item>
                  </q-list>
                </div>
                <div v-else class="text-center q-pa-xl text-grey-5">
                  <q-icon name="info" size="48px" class="q-mb-md" />
                  <div v-if="evento.itens && evento.itens.length > 0">
                    Nenhum item corresponde à busca.
                  </div>
                  <div v-else>Nenhum item selecionado para este evento.</div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Resumo de Fechamento Card (Post-Event only) -->
            <q-card v-if="modoPosEvento" class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-col-gutter-sm q-mb-md">
                  <div class="col-12 col-sm-auto row items-center no-wrap">
                    <q-icon name="assessment" color="primary" size="24px" class="q-mr-sm" />
                    <div class="text-h6 text-weight-bold text-primary">Fechamento do Evento</div>
                  </div>
                  <div class="col-12 col-sm-auto">
                    <q-btn
                      color="primary"
                      icon="save"
                      label="Salvar Conferência"
                      no-caps
                      unelevated
                      class="full-width shadow-soft rounded-borders"
                      @click="salvarConferencia"
                    />
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row q-col-gutter-lg">
                  <!-- Coluna de Proteínas -->
                  <div class="col-12 col-md-6">
                    <div
                      class="text-subtitle2 text-weight-bold text-secondary q-mb-sm row items-center"
                    >
                      <q-icon name="restaurant" class="q-mr-xs" size="18px" />
                      Consumo de Proteínas
                    </div>
                    <q-list bordered separator class="rounded-borders bg-grey-1">
                      <template v-if="proteinasConsumidas.length > 0">
                        <q-item
                          v-for="item in proteinasConsumidas"
                          :key="item.produtoId || item.nome"
                          class="q-py-sm"
                        >
                          <q-item-section>
                            <q-item-label class="text-weight-medium text-grey-8">{{
                              item.nome
                            }}</q-item-label>
                            <q-item-label caption
                              >Levou: {{ formatarNumero(item.quantidade) }} {{ item.unidade }} |
                              Retornou: {{ formatarNumero(item.quantidade_retornada ?? 0) }}
                              {{ item.unidade }}</q-item-label
                            >
                          </q-item-section>
                          <q-item-section side>
                            <q-badge color="primary" class="q-pa-sm text-body2">
                              {{ formatarNumero(calcularConsumo(item)) }} {{ item.unidade }}
                            </q-badge>
                          </q-item-section>
                        </q-item>
                      </template>
                      <q-item v-else>
                        <q-item-section class="text-center text-grey-5 q-pa-md">
                          Nenhuma proteína conferida ou consumida.
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <!-- Coluna de Divergências -->
                  <div class="col-12 col-md-6">
                    <div
                      class="text-subtitle2 text-weight-bold text-secondary q-mb-sm row items-center"
                    >
                      <q-icon name="warning" class="q-mr-xs text-negative" size="18px" />
                      Divergências de Retorno
                    </div>
                    <q-list bordered separator class="rounded-borders bg-grey-1">
                      <template v-if="itensDivergentes.length > 0">
                        <q-item
                          v-for="item in itensDivergentes"
                          :key="item.produtoId || item.nome"
                          class="q-py-sm"
                        >
                          <q-item-section>
                            <q-item-label class="text-weight-medium text-negative">{{
                              item.nome
                            }}</q-item-label>
                            <q-item-label caption
                              >Levou: {{ formatarNumero(item.quantidade) }} | Retornou:
                              {{ formatarNumero(item.quantidade_retornada ?? 0) }}</q-item-label
                            >
                          </q-item-section>
                          <q-item-section side>
                            <q-badge
                              color="red-1"
                              text-color="negative"
                              class="q-pa-sm text-body2 text-weight-bold"
                            >
                              Faltando: {{ formatarNumero(calcularFalta(item)) }} {{ item.unidade }}
                            </q-badge>
                          </q-item-section>
                        </q-item>
                      </template>
                      <q-item v-else>
                        <q-item-section class="text-center text-positive text-weight-bold q-pa-md">
                          <q-icon
                            name="check_circle"
                            color="positive"
                            size="24px"
                            class="q-mb-xs self-center"
                          />
                          Tudo completo! Sem divergências.
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    color="positive"
                    icon="mdi-whatsapp"
                    label="Compartilhar Fechamento"
                    no-caps
                    unelevated
                    class="full-width col-xs-12 col-sm-auto shadow-soft"
                    @click="compartilharWhatsAppFechamento"
                  />
                </div>
              </q-card-section>
            </q-card>

            <!-- Observations -->
            <q-card v-if="evento.observacoes" class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <q-icon name="notes" color="primary" size="24px" class="q-mr-sm" />
                  <div class="text-h6 text-weight-bold text-primary">Observações</div>
                </div>
                <div class="text-body1 text-grey-8 preserve-whitespace">
                  {{ evento.observacoes }}
                </div>
              </q-card-section>
            </q-card>

            <!-- Sugestão de Quantidade -->
            <q-card v-if="evento.sugestao_qtd" class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-col-gutter-sm q-mb-md">
                  <div class="row items-center col">
                    <q-icon name="notes" color="primary" size="24px" class="q-mr-sm col-auto" />
                    <div
                      class="text-h6 text-weight-bold text-primary col"
                      style="word-break: break-word"
                    >
                      Sugestão de quantidade de produção
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="secondary"
                      icon="content_copy"
                      @click="copyToClipboard(evento.sugestao_qtd)"
                      no-caps
                      flat
                      dense
                      size="12px"
                    />
                  </div>
                </div>
                <div
                  class="text-body1 text-grey-8 preserve-whitespace"
                  :class="{ 'collapsed-text': !expandidoSugestao }"
                >
                  {{ evento.sugestao_qtd }}
                </div>
                <div
                  class="row justify-center q-mt-sm"
                  v-if="evento.sugestao_qtd?.split('\n').length > 5"
                >
                  <q-btn
                    flat
                    no-caps
                    color="primary"
                    :label="expandidoSugestao ? 'Ver menos' : 'Ver mais'"
                    :icon="expandidoSugestao ? 'expand_less' : 'expand_more'"
                    @click="expandidoSugestao = !expandidoSugestao"
                    dense
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="fixed-bottom-right q-ma-xl q-pb-xl">
      <q-fab
        v-model="fabRight"
        vertical-actions-align="center"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-btn
          fab
          color="primary"
          icon="edit"
          no-caps
          :to="`/eventos/editar/${eventId}`"
          class="shadow-robust"
        />
        <q-btn
          fab
          color="positive"
          icon="mdi-whatsapp"
          @click="compartilharWhatsApp"
          no-caps
          rounded
          unelevated
          class="shadow-soft"
        />
      </q-fab>
    </div>

    <!-- Dialog de visualização de imagem (Lightbox) -->
    <q-dialog v-model="dialogImagem" backdrop-filter="blur(4px)">
      <q-card style="max-width: 90vw; background: transparent; box-shadow: none">
        <q-card-section class="q-pa-none relative-position">
          <q-img
            :src="imagemSelecionada"
            style="max-height: 80vh; border-radius: 12px"
            fit="contain"
          />
          <q-btn
            icon="close"
            flat
            round
            dense
            color="white"
            class="absolute-top-right q-ma-md text-white"
            style="background: rgba(0, 0, 0, 0.4)"
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const eventId = route.params.id?.toString();
const STORAGE_KEY = `shopping_list_${eventId}`;
const fabRight = ref(false);

const checkedItems = ref<Record<string, boolean>>({});
const expandidoSugestao = ref(false);
const modoPosEvento = ref(false);
const filtroTexto = ref('');

// Salvar no localStorage sempre que houver mudança
watch(
  checkedItems,
  (newState: Record<string, boolean>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  },
  { deep: true },
);

const toggleItem = (item: Item) => {
  const key = item.produtoId || item.nome;
  checkedItems.value[key] = !checkedItems.value[key];
};

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

interface Item {
  produtoId: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  quantidade_retornada?: number | null;
}

interface Freela {
  _id: string;
  nome: string;
  funcao: string;
}

interface QuantidadePessoas {
  quantidade_adultos: number;
  quantidade_criancas: number;
  quantidade_staffs: number;
}

interface Evento {
  nome_contratante: string;
  telefone: string;
  endereco: Endereco;
  data: string;
  hora_evento: string;
  hora_saida: string;
  responsavel: string;
  quantidade_pessoas: QuantidadePessoas;
  menu: string;
  bebidas: boolean | null;
  observacoes: string;
  sugestao_qtd: string;
  itens: Item[];
  freelas: Freela[];
  imagens?: string[];
}

const evento = ref<Evento>({
  nome_contratante: '',
  telefone: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
  },
  data: '',
  hora_evento: '',
  hora_saida: '',
  responsavel: '',
  quantidade_pessoas: {
    quantidade_adultos: 0,
    quantidade_criancas: 0,
    quantidade_staffs: 0,
  },
  observacoes: '',
  sugestao_qtd: '',
  menu: '',
  bebidas: null,
  itens: [],
  freelas: [],
  imagens: [],
});

const dialogImagem = ref(false);
const imagemSelecionada = ref('');
const abrirImagem = (url: string) => {
  imagemSelecionada.value = url;
  dialogImagem.value = true;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text.toString());
    $q.notify({
      color: 'positive',
      textColor: 'white',
      message: 'Texto copiado com sucesso!',
      icon: 'check',
    });
  } catch (err) {
    console.error('Erro ao copiar: ', err);
  }
};

const formatarEndereco = (end: Endereco) => {
  if (!end) return '';
  const parts = [
    end.logradouro,
    end.numero ? `nº ${end.numero}` : '',
    end.complemento,
    end.bairro,
    end.cidade,
  ].filter(Boolean);
  return parts.join(', ');
};

const formatarData = (data: string) => {
  if (!data) return '';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
};

const formatarCategoria = (slug: string) => {
  const cats: Record<string, string> = {
    proteina: 'Proteínas',
    limpeza_identidade: 'Limpeza e Identidade',
    servico_mesa: 'Serviço de Mesa',
    molho_finalizacao: 'Molhos e Finalização',
    acompanhamento: 'Acompanhamentos',
    equipamento: 'Equipamentos',
  };
  return cats[slug] || slug;
};

const formatarNumero = (valor: number | string | undefined | null) => {
  if (valor === undefined || valor === null) return '0';
  const num = Number(valor);
  if (isNaN(num)) return valor.toString();
  return Number(num.toFixed(2)).toString().replace('.', ',');
};

const abrirMapa = () => {
  const fullAddress = `${formatarEndereco(evento.value.endereco)}, CEP: ${evento.value.endereco?.cep}`;

  const endereco = encodeURIComponent(fullAddress);

  window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, '_blank');
};

const compartilharWhatsApp = () => {
  const e = evento.value;
  const dataFormatada = formatarData(e.data);
  const enderecoFormatado = formatarEndereco(e.endereco);

  let mensagem = `*Detalhes do Evento*\n\n`;
  mensagem += `*Contratante:* ${e.nome_contratante}\n`;
  mensagem += `*Contato:* ${e.telefone}\n`;
  mensagem += `*Data:* ${dataFormatada}\n`;
  mensagem += `*Horário do Evento:* ${e.hora_evento}\n`;
  if (e.hora_saida) mensagem += `*Horário de Saída:* ${e.hora_saida}\n`;
  mensagem += `*Chef Responsável:* ${e.responsavel}\n\n`;

  mensagem += `*Localização:* ${enderecoFormatado}\n`;
  if (e.endereco.cep) mensagem += `*CEP:* ${e.endereco.cep}\n\n`;

  mensagem += `*Resumo:*\n`;
  mensagem += `- ${e.menu}\n`;
  mensagem += `- ${e.quantidade_pessoas.quantidade_adultos} adultos, ${e.quantidade_pessoas.quantidade_criancas} crianças, ${e.quantidade_pessoas.quantidade_staffs} staffs\n`;
  mensagem += `- Bebidas: ${e.bebidas ? 'Sim' : 'Não'}\n\n`;

  mensagem += `*Lista de itens para levar:*\n`;
  e.itens?.forEach((item) => {
    if (item.quantidade) {
      mensagem += `- ${item.nome}: ${formatarNumero(item.quantidade)} ${item.unidade}\n`;
    }
  });

  if (e.observacoes) {
    mensagem += `\n*Observações:*\n${e.observacoes}\n\n`;
  }

  if (e.freelas && e.freelas.length > 0) {
    mensagem += `*Freelas:*\n`;
    e.freelas.forEach((f) => {
      mensagem += `- ${f.nome} (${f.funcao})\n`;
    });
  }

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, '_blank');
};

const ordenadosItens = computed(() => {
  if (!evento.value.itens) return [];
  let itens = [...evento.value.itens];
  const query = filtroTexto.value.trim().toLowerCase();
  if (query.length >= 3) {
    itens = itens.filter((item) => (item.nome || '').toLowerCase().includes(query));
  }
  return itens.sort((a, b) => a.nome.localeCompare(b.nome));
});

const carregarEvento = async () => {
  try {
    $q.loading.show({ message: 'Carregando dados do evento...', customClass: 'loading-varandao' });
    const { data } = await api.get(`/eventos/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data && data.itens) {
      data.itens = data.itens.map((item: Item) => {
        const val =
          item.quantidade_retornada !== undefined && item.quantidade_retornada !== null
            ? Number(item.quantidade_retornada)
            : null;
        return {
          ...item,
          quantidade_retornada: val === 0 ? null : val,
        };
      });
    }

    if (data && data.freelas) {
      data.freelas.sort((a: Freela, b: Freela) => {
        const comp = (b.funcao || '').localeCompare(a.funcao || '');
        if (comp !== 0) return comp;
        return (a.nome || '').localeCompare(b.nome || '');
      });
    }

    if (data) {
      data.imagens = data.imagens || [];
    }
    evento.value = data;

    // Verificar se o evento já passou para ativar o modo pós-evento
    if (evento.value && evento.value.data) {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const dia = String(hoje.getDate()).padStart(2, '0');
      const dataAtualStr = `${ano}-${mes}-${dia}`;

      if (dataAtualStr > evento.value.data) {
        modoPosEvento.value = true;
      } else if (dataAtualStr === evento.value.data && evento.value.hora_evento) {
        const horasAtuais = String(hoje.getHours()).padStart(2, '0');
        const minutosAtuais = String(hoje.getMinutes()).padStart(2, '0');
        const horaAtualStr = `${horasAtuais}:${minutosAtuais}`;
        if (horaAtualStr > evento.value.hora_evento) {
          modoPosEvento.value = true;
        }
      }
    }

    // Tentar carregar estado salvo do localStorage
    const savedStateStr = localStorage.getItem(STORAGE_KEY);
    const newState: Record<string, boolean> = {};

    if (data.itens) {
      let savedState: Record<string, boolean> = {};
      if (savedStateStr) {
        try {
          savedState = JSON.parse(savedStateStr);
        } catch (e) {
          console.error('Erro ao carregar estado do localStorage:', e);
        }
      }

      // Constrói o novo estado apenas com os itens atuais do evento
      data.itens.forEach((item: Item) => {
        const key = item.produtoId || item.nome;
        // Mantém o valor salvo se existir, senão inicializa com false
        newState[key] = savedState[key] !== undefined ? savedState[key] : false;
      });
    }

    checkedItems.value = newState;
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Erro ao carregar o evento.',
    });
    void router.push('/eventos');
  } finally {
    setTimeout(() => {
      $q.loading.hide();
    }, 800);
  }
};

const validaRetorno = (item: Item) => {
  if (
    item.quantidade_retornada === undefined ||
    item.quantidade_retornada === null ||
    (typeof item.quantidade_retornada === 'number' && item.quantidade_retornada <= 0) ||
    (item.quantidade_retornada as any) === ''
  ) {
    item.quantidade_retornada = null;
    return;
  }
};

const calcularConsumo = (item: Item) => {
  const ret = item.quantidade_retornada ?? 0;
  const consumo = item.quantidade - ret;
  return Number(consumo.toFixed(2));
};

const calcularFalta = (item: Item) => {
  const ret = item.quantidade_retornada ?? 0;
  const falta = item.quantidade - ret;
  return falta > 0 ? Number(falta.toFixed(2)) : 0;
};

const proteinasConsumidas = computed(() => {
  if (!evento.value.itens) return [];
  return evento.value.itens.filter((item) => item.categoria === 'proteina');
});

const itensDivergentes = computed(() => {
  if (!evento.value.itens) return [];
  return evento.value.itens.filter(
    (item) =>
      item.categoria !== 'proteina' &&
      item.categoria !== 'acompanhamento' &&
      item.nome !== 'Carvão' &&
      calcularFalta(item) > 0,
  );
});

const salvarConferencia = async () => {
  $q.loading.show({ message: 'Salvando conferência de retorno...' });

  const payload = {
    itens: evento.value.itens.map((item: Item) => ({
      nome: item.nome,
      quantidade_retornada: item.quantidade_retornada ?? 0,
    })),
  };

  try {
    await api.patch(`/eventos/${eventId}/conferencia`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: 'Conferência de retorno salva com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao salvar conferência:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: 'Erro ao salvar a conferência no servidor.',
    });
  } finally {
    $q.loading.hide();
  }
};

const compartilharWhatsAppFechamento = () => {
  const e = evento.value;
  const dataFormatada = formatarData(e.data);

  let mensagem = `*Resumo de Fechamento do Evento*\n`;
  mensagem += `*Contratante:* ${e.nome_contratante}\n`;
  mensagem += `*Data:* ${dataFormatada}\n`;
  mensagem += `*Responsável:* ${e.responsavel}\n\n`;

  mensagem += `*🥩 Consumo de Proteínas:*\n`;
  if (proteinasConsumidas.value.length > 0) {
    proteinasConsumidas.value.forEach((p) => {
      const consumido = calcularConsumo(p);
      mensagem += `- *${p.nome}:* Levou ${formatarNumero(p.quantidade)} ${p.unidade} | Retornou ${formatarNumero(p.quantidade_retornada ?? 0)} ${p.unidade} -> *Consumiu ${formatarNumero(consumido)} ${p.unidade}*\n`;
    });
  } else {
    mensagem += `_Nenhuma proteína registrada._\n`;
  }
  mensagem += `\n`;

  mensagem += `*⚠️ Divergências de Retorno (Faltantes):*\n`;
  if (itensDivergentes.value.length > 0) {
    itensDivergentes.value.forEach((d) => {
      const falta = calcularFalta(d);
      mensagem += `- *${d.nome}:* Levou ${formatarNumero(d.quantidade)} ${d.unidade} | Retornou ${formatarNumero(d.quantidade_retornada ?? 0)} ${d.unidade} -> *Falta ${formatarNumero(falta)} ${d.unidade}*\n`;
    });
  } else {
    mensagem += `_Tudo completo! Nenhuma divergência de retorno._\n`;
  }

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
};

onMounted(carregarEvento);
</script>

<style lang="scss" scoped>
.item-group {
  border-radius: 8px;
  overflow: hidden;
}

.preserve-whitespace {
  white-space: pre-wrap;
}

.bg-accent-light {
  background-color: rgba($primary, 0.05);
}

.shadow-robust {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.text-strike {
  text-decoration: line-through;
}

.collapsed-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-hover-zoom {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}
</style>
