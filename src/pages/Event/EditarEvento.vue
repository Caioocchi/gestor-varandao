<template>
  <q-page class="q-pa-md">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Header Section -->
      <div class="row items-center justify-between q-mb-xl">
        <div class="column">
          <div class="text-h4 text-weight-bold text-primary">Editar Evento</div>
          <div class="text-subtitle1 text-grey-6">Atualize os dados do evento</div>
        </div>
      </div>

      <q-form @submit.once="onSubmit" class="q-gutter-y-lg">
        <!-- Event Details Card -->
        <q-card class="card-base shadow-soft" bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-weight-bold text-primary q-mb-md">Dados Gerais</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.nome_contratante"
                  label="Nome do Contratante"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Contratante é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.telefone"
                  label="Telefone do Contratante"
                  mask="(xx) xxxxx-xxxx"
                  placeholder="(00) 00000-0000"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Telefone é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.endereco.cep"
                  label="CEP"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  mask="#####-###"
                  lazy-rules
                  :rules="[(val) => !!val || 'CEP é obrigatório']"
                  :error="cepErro !== ''"
                  :error-message="cepErro"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" color="primary" />
                  </template>
                  <template v-if="!verificado" v-slot:append>
                    <q-btn :ripple="false" outline @click="validarCep" no-caps label="Verificar" />
                  </template>
                  <template v-else v-slot:append>
                    <q-btn :ripple="false" outline @click="limparEndereco" no-caps label="Limpar" />
                  </template>
                </q-input>
              </div>
              <template v-if="enderecoValidado">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="evento.endereco.logradouro"
                    label="Logradouro"
                    outlined
                    stack-label
                    readonly
                    bg-color="white"
                    class="input-rounded"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="evento.endereco.numero"
                    label="Número"
                    outlined
                    stack-label
                    bg-color="white"
                    class="input-rounded"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="evento.endereco.bairro"
                    label="Bairro"
                    outlined
                    stack-label
                    readonly
                    bg-color="white"
                    class="input-rounded"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="evento.endereco.cidade"
                    label="Cidade"
                    outlined
                    stack-label
                    readonly
                    bg-color="white"
                    class="input-rounded"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="evento.endereco.complemento"
                    label="Complemento"
                    outlined
                    stack-label
                    color="primary"
                    bg-color="white"
                    class="input-rounded"
                  />
                </div>
              </template>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.data"
                  label="Data do evento"
                  type="date"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Data é obrigatória']"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.hora"
                  label="Horário do evento"
                  type="time"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Horário é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="schedule" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="evento.menu"
                  label="Tipo de menu"
                  outlined
                  stack-label
                  :options="options"
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Selecione um tipo de menu']"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" color="primary" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="evento.bebidas"
                  label="O evento terá bebidas?"
                  :options="bebidasOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => val != null || 'Este campo é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" color="primary" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="evento.responsavel"
                  label="Responsável"
                  outlined
                  stack-label
                  :options="responsaveis"
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Selecione um responsável']"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" color="primary" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.qtde_pessoas"
                  label="Quantidade de pessoas"
                  type="number"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                  lazy-rules
                  :rules="[(val) => !!val || 'Quantidade de pessoas é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" color="primary" />
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
              <div class="col-12">
                <q-input
                  v-model="evento.sugestao_qtd"
                  label="Sugestão de quantidade"
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

        <freela-card titulo="Freelas" :freelas="freelasDisponiveis" :funcoes="funcoes" />

        <div v-for="categoria in categoriasProdutos" :key="categoria.slug">
          <categoria-card
            :categoria="categoria.label"
            :produtos="categoria.produtos.value"
            :color="categoria.color"
          />
        </div>

        <!-- Submit Button -->
        <div class="q-pt-md">
          <q-btn
            label="Salvar Alterações"
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
import { ref, onMounted, toRaw, type Ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import CategoriaCard from 'src/components/CategoriaCard.vue';
import FreelaCard from 'src/components/FreelaCard.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const eventId = route.params.id?.toString();

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

interface Itens {
  produtoId: string;
  nome: string;
  categoria: string;
  quantidade: number | null;
  unidade: string;
}

interface Freelas {
  _id: string;
  nome: string;
  selected: boolean;
  funcao: string;
}

interface Evento {
  nome_contratante: string;
  telefone: string;
  endereco: Endereco;
  data: string;
  hora: string;
  responsavel: string;
  qtde_pessoas: number | null;
  menu: string;
  bebidas: boolean | null;
  observacoes: string;
  sugestao_qtd: string;
  itens: Itens[];
  freelas: Freelas[];
}

interface Produto {
  produtoId: string;
  nome: string;
  selected: boolean;
  categoria: string;
  quantidade: number | null;
  unidade: string;
}

interface CategoriaProduto {
  slug: string;
  label: string;
  color: string;
  produtos: Ref<Produto[]>;
}

const bebidasOptions = [
  { value: true, label: 'Sim' },
  { value: false, label: 'Não' },
];

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
  hora: '',
  responsavel: '',
  qtde_pessoas: null,
  observacoes: '',
  sugestao_qtd: '',
  menu: '',
  bebidas: null,
  itens: [],
  freelas: [],
});

const options = ['Menu Premium', 'Menu Exclusivo', 'Menu VIP', 'Menu Mar e Terra'];

const responsaveis = ['Alexandre', 'Antonio', 'Kayque', 'André', 'Matheus'];

const funcoes = ['Chef', 'Sous Chef', 'Garçom', 'Meitre', 'Pia'];

const freelasDisponiveis = ref<Freelas[]>([]);

const carregarFreelas = async () => {
  try {
    const { data } = await api.get('/freelas');
    freelasDisponiveis.value = data.map((f: Freelas) => ({
      _id: f._id,
      nome: f.nome,
      selected: false,
      funcao: '',
    }));

    // Sincronizar após carregar freelas disponiveis
    sincronizarFreelas();
  } catch (error) {
    console.error('Erro ao carregar freelas:', error);
  }
};

const sincronizarFreelas = () => {
  if (!evento.value.freelas || evento.value.freelas.length === 0) return;

  freelasDisponiveis.value.forEach((freela) => {
    const salvo = evento.value.freelas.find(
      (f: Freelas) => f._id === freela._id || f.nome === freela.nome,
    );
    if (salvo) {
      freela.selected = true;
      freela.funcao = salvo.funcao;
    }
  });
};

// Mapeamento de itens por menu
const menuMapping: Record<string, string[]> = {
  'Menu Premium': [
    'Ancho',
    'Picanha',
    'Linguiça de pernil',
    'Pão de alho',
    'Arroz',
    'Farofa',
    'Coxinha da asa',
    'Coração de frango',
    'Queijo coalho',
    'Copa lombo',
    'Choripan',
  ],
  'Menu Exclusivo': ['Filé Mignon', 'Chorizo', 'Frango', 'Maionese'],
  'Menu VIP': ['Wagyu', 'Prime Rib', 'Cordeiro'],
  'Menu Mar e Terra': ['Camarão', 'Ancho', 'Peixe'],
};

const cepErro = ref('');
const enderecoValidado = ref(false);
const verificado = ref(false);

const limparEndereco = () => {
  evento.value.endereco.cep = '';
  evento.value.endereco.logradouro = '';
  evento.value.endereco.numero = '';
  evento.value.endereco.bairro = '';
  evento.value.endereco.cidade = '';
  evento.value.endereco.complemento = '';
  enderecoValidado.value = false;
  verificado.value = false;
};

const validarCep = async () => {
  cepErro.value = '';
  enderecoValidado.value = false;
  verificado.value = false;

  const cep = evento.value.endereco.cep.replace(/\D/g, '');

  if (cep.length !== 8) {
    cepErro.value = 'CEP inválido';
    limparEndereco();
    return;
  }

  $q.loading.show({
    message: 'Verificando endereço...',
  });

  try {
    const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (data.erro) {
      cepErro.value = 'CEP não encontrado';
      limparEndereco();
      return;
    }

    evento.value.endereco.logradouro = data.logradouro ?? '';
    evento.value.endereco.bairro = data.bairro ?? '';
    evento.value.endereco.cidade = data.localidade ?? '';

    enderecoValidado.value = true;
    verificado.value = true;
  } catch (error) {
    console.log(error);
    cepErro.value = 'Erro ao buscar CEP';
    limparEndereco();
  } finally {
    $q.loading.hide();
  }
};

const carregarEvento = async () => {
  try {
    $q.loading.show({ message: 'Carregando dados do evento...' });
    const { data } = await api.get(`/eventos/${eventId}`);

    // Preencher o objeto evento com os dados recebidos
    evento.value = {
      nome_contratante: data.nome_contratante,
      telefone: data.telefone,
      endereco: {
        cep: data.endereco?.cep || '',
        logradouro: data.endereco?.logradouro || '',
        numero: data.endereco?.numero || '',
        complemento: data.endereco?.complemento || '',
        bairro: data.endereco?.bairro || '',
        cidade: data.endereco?.cidade || '',
      },
      data: data.data,
      hora: data.hora,
      responsavel: data.responsavel,
      qtde_pessoas: data.qtde_pessoas,
      observacoes: data.observacoes || '',
      sugestao_qtd: data.sugestao_qtd || '',
      menu: data.menu,
      bebidas: data.bebidas,
      itens: data.itens || [],
      freelas: data.freelas || [],
    };

    if (evento.value.endereco.cep) {
      enderecoValidado.value = true;
      verificado.value = true;
    }

    // Sincronizar itens se os produtos já estiverem carregados
    sincronizarItens();
    sincronizarFreelas();
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
    $q.loading.hide();
  }
};

const sincronizarItens = () => {
  if (!evento.value.itens || evento.value.itens.length === 0) return;

  categoriasProdutos.forEach((categoria) => {
    categoria.produtos.value.forEach((produto) => {
      const itemSalvo = evento.value.itens.find((i: Itens) => i.nome === produto.nome);
      if (itemSalvo) {
        produto.selected = true;
        produto.quantidade = itemSalvo.quantidade || 0;
      }
    });
  });
};

onMounted(async () => {
  await carregarEvento();
  await carregarFreelas();
});

const categoriasProdutos: CategoriaProduto[] = [
  { slug: 'proteina', label: 'Proteínas', color: 'secondary', produtos: ref<Produto[]>([]) },
  {
    slug: 'limpeza_identidade',
    label: 'Limpeza e Identidade',
    color: 'secondary',
    produtos: ref<Produto[]>([]),
  },
  {
    slug: 'servico_mesa',
    label: 'Serviço de Mesa',
    color: 'secondary',
    produtos: ref<Produto[]>([]),
  },
  {
    slug: 'molho_finalizacao',
    label: 'Molhos e Finalização',
    color: 'secondary',
    produtos: ref<Produto[]>([]),
  },
  {
    slug: 'acompanhamento',
    label: 'Acompanhamentos',
    color: 'secondary',
    produtos: ref<Produto[]>([]),
  },
  { slug: 'equipamento', label: 'Equipamentos', color: 'secondary', produtos: ref<Produto[]>([]) },
];

const mapProdutoParaItem = (produto: Produto, categoria: string): Produto => ({
  produtoId: produto.produtoId,
  nome: produto.nome,
  selected: false,
  categoria,
  quantidade: 0,
  unidade: produto.unidade,
});

const buscarProdutosPorCategoria = async (categoria: string) => {
  const { data } = await api.get(`/produto/${categoria}`);
  if (!Array.isArray(data)) {
    return [] as Produto[];
  }

  return data.map((produto: Produto) => mapProdutoParaItem(produto, categoria));
};

const carregarProdutos = async () => {
  try {
    $q.loading.show({ message: 'Carregando produtos...' });

    await Promise.all(
      categoriasProdutos.map(async (categoria) => {
        categoria.produtos.value = await buscarProdutosPorCategoria(categoria.slug);
      }),
    );

    // Sincronizar itens após carregar produtos
    sincronizarItens();

    // Se já tiver um menu selecionado (do carregamento do evento), sugerir itens se necessário
    if (evento.value.menu) {
      sugerirItensPorMenu(evento.value.menu);
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Não foi possível carregar os produtos. Atualize a página e tente novamente.',
    });
  } finally {
    $q.loading.hide();
  }
};

// carregarProdutos is already called in its own onMounted or combined.
// I'll leave carregarProdutos as is if it's already there, but let's be safe.
onMounted(carregarProdutos);

const sugerirItensPorMenu = (menu: string) => {
  if (!menu) return;
  const itensSugeridos = menuMapping[menu] || [];
  if (itensSugeridos.length === 0) return;

  categoriasProdutos.forEach((categoria) => {
    if (categoria.produtos.value.length === 0) return;

    categoria.produtos.value.forEach((produto) => {
      if (itensSugeridos.includes(produto.nome)) {
        produto.selected = true;
        if (!produto.quantidade) produto.quantidade = null;
      }
    });
  });
};

watch(
  () => evento.value.menu,
  (novoMenu) => {
    sugerirItensPorMenu(novoMenu);
  },
);

const itensSelecionados = computed(() =>
  categoriasProdutos.flatMap((cat) => cat.produtos.value.filter((p) => p.selected)),
);

const onSubmit = async () => {
  $q.loading.show({ message: 'Salvando alterações...' });

  const rawEvento = toRaw(evento.value);
  const payload = {
    ...rawEvento,
    endereco: { ...(rawEvento.endereco ? toRaw(rawEvento.endereco) : {}) },
    itens: itensSelecionados.value.map((p) => ({
      produtoId: p.produtoId,
      nome: p.nome,
      categoria: p.categoria,
      quantidade: p.quantidade,
      unidade: p.unidade,
    })),
    freelas: freelasDisponiveis.value
      .filter((f) => f.selected)
      .map((f) => ({
        _id: f._id,
        nome: f.nome,
        funcao: f.funcao,
      })),
  };

  try {
    await api.put(`/eventos/${eventId}`, payload);

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: 'Evento atualizado com sucesso!',
    });
    void router.push('/eventos');
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: 'Erro ao atualizar o evento.',
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style lang="scss" scoped>
.btn-primary {
  border-radius: 12px;
  font-weight: 600;
  height: 56px;
}
</style>
