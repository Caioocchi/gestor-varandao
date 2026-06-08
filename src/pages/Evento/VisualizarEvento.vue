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
                <div class="text-body1 text-weight-medium">{{ evento.responsavel }}</div>
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

            <!-- Items Card -->
            <q-card class="card-base shadow-soft">
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-lg">
                  <div class="row items-center no-wrap">
                    <q-icon name="shopping_basket" color="primary" size="24px" class="q-mr-sm" />
                    <div class="text-h6 text-weight-bold text-primary">Lista de compras</div>
                  </div>
                  <div class="row items-center q-gutter-x-md">
                    <q-chip outline color="secondary" text-color="white" :ripple="false">
                      {{ evento.itens?.length || 0 }} item(s)
                    </q-chip>
                  </div>
                </div>

                <div v-if="groupedItems.length > 0" class="column q-gutter-y-md">
                  <div v-for="group in groupedItems" :key="group.categoria" class="item-group">
                    <div class="text-subtitle2 text-weight-bold text-secondary q-mb-sm">
                      {{ formatarCategoria(group.categoria) }}
                    </div>
                    <q-list bordered separator class="rounded-borders overflow-hidden">
                      <q-item
                        v-for="item in group.itens"
                        :key="item.produtoId || item.nome"
                        class="q-py-md"
                        clickable
                        @click="toggleItem(item)"
                      >
                        <q-item-section side>
                          <q-checkbox
                            v-model="checkedItems[item.produtoId || item.nome]"
                            color="secondary"
                            @click.stop
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            class="text-weight-medium"
                            :class="{
                              'text-strike text-grey-5': checkedItems[item.produtoId || item.nome],
                            }"
                          >
                            {{ item.nome }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-badge
                            :color="
                              checkedItems[item.produtoId || item.nome] ? 'grey-3' : 'accent-light'
                            "
                            :text-color="
                              checkedItems[item.produtoId || item.nome] ? 'grey-6' : 'primary'
                            "
                            class="q-pa-sm text-body2"
                          >
                            {{ item.quantidade }} {{ item.unidade }}
                          </q-badge>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
                <div v-else class="text-center q-pa-xl text-grey-5">
                  <q-icon name="info" size="48px" class="q-mb-md" />
                  <div>Nenhum item selecionado para este evento.</div>
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
                <div class="row items-center justify-between q-mb-md no-wrap">
                  <div class="row items-center no-wrap">
                    <q-icon name="notes" color="primary" size="24px" class="q-mr-sm" />
                    <div style="text-align: center" class="text-h6 text-weight-bold text-primary">
                      Sugestão de quantidade de produção
                    </div>
                  </div>
                  <div>
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
    <div class="fixed-bottom-right q-ma-xl">
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
});

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

const abrirMapa = () => {
  const fullAddress = `${formatarEndereco(evento.value.endereco)}`;

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    '_blank',
    'rel="noopener noreferrer"',
  );
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

  if (e.observacoes) {
    mensagem += `*Observações:*\n${e.observacoes}\n\n`;
  }

  if (e.freelas && e.freelas.length > 0) {
    mensagem += `*Freelas:*\n`;
    e.freelas.forEach((f) => {
      mensagem += `- ${f.nome} (${f.funcao})\n`;
    });
  }

  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
};

const groupedItems = computed(() => {
  if (!evento.value.itens) return [];
  const groups: Record<string, Item[]> = {};
  evento.value.itens.forEach((item) => {
    if (!groups[item.categoria]) {
      groups[item.categoria] = [];
    }
    const group = groups[item.categoria];
    if (group) group.push(item);
  });
  return Object.entries(groups).map(([categoria, itens]) => ({
    categoria,
    itens,
  }));
});

const carregarEvento = async () => {
  try {
    $q.loading.show({ message: 'Carregando dados do evento...', customClass: 'loading-varandao' });
    const { data } = await api.get(`/eventos/${eventId}`);
    evento.value = data;

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
</style>
