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
                >
                  <template v-slot:prepend>
                    <q-icon name="event" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.hora_evento"
                  label="Horário do evento"
                  type="time"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="schedule" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.hora_saida"
                  label="Horário de saída"
                  type="time"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
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
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-silverware-variant" color="primary" />
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
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-glass-cocktail" color="primary" />
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
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-chef-hat" color="primary" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.quantidade_pessoas.quantidade_adultos"
                  label="Quantidade de adultos"
                  type="number"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-account-group" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.quantidade_pessoas.quantidade_criancas"
                  label="Quantidade de crianças"
                  type="number"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-account-group" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="evento.quantidade_pessoas.quantidade_staffs"
                  label="Quantidade de staffs"
                  type="number"
                  outlined
                  stack-label
                  color="primary"
                  bg-color="white"
                  class="input-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-account-group" color="primary" />
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
                  label="Sugestão de quantidade de produção"
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

interface QuantidadePessoas {
  quantidade_adultos: number | null;
  quantidade_criancas: number | null;
  quantidade_staffs: number | null;
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
  hora_evento: '',
  hora_saida: '',
  responsavel: '',
  quantidade_pessoas: {
    quantidade_adultos: null,
    quantidade_criancas: null,
    quantidade_staffs: null,
  },
  observacoes: '',
  sugestao_qtd: '',
  menu: '',
  bebidas: null,
  itens: [],
  freelas: [],
});

const options = ['Menu Premium', 'Menu Exclusivo', 'Menu VIP', 'Menu Mar e Terra'];

const responsaveis = ['Alexandre', 'Antonio', 'Kayque', 'André', 'Matheus'];

const funcoes = [
  'Chef',
  'Sous Chef',
  'Garçom churrasco',
  'Garçom bebida',
  'Meitre',
  'Pia',
  'Copeiro',
];

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

const menuPremium = [
  'Ancho',
  'Picanha',
  'Linguiça de pernil',
  'Coxinha da asa',
  'Tulipa',
  'Coração de frango',
  'Queijo coalho',
  'Copa lombo',
  'Choripan',
  'Pão de alho',
  'Feijão tropeiro',
  'Arroz',
  'Farofa',
  'Vinagrete',
  'Mix de folhas',
  'Pratos de mesa',
  'Cubas de guarnições',
  'Garfos de mesa',
  'Facas de mesa',
  'Colher de servir',
  'Carvão',
];

const menuExclusivo = [...menuPremium, 'Costela suína', 'Paleta de cordeiro', 'Ratatouille'];

const menuVIP = [...menuExclusivo, 'Hambúrguer'];

const menuMarETerra = [...menuExclusivo, 'Paella de frutos do mar'];

const menuMapping: Record<string, string[]> = {
  'Menu Premium': menuPremium,
  'Menu Exclusivo': menuExclusivo,
  'Menu VIP': menuVIP,
  'Menu Mar e Terra': menuMarETerra,
};

// Conjunto de todos os itens que pertencem a algum menu (para tratar downgrades)
const todosItensMenu = new Set([...menuPremium, ...menuExclusivo, ...menuVIP, ...menuMarETerra]);

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
    customClass: 'loading-varandao',
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
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

const carregarEvento = async () => {
  try {
    $q.loading.show({ message: 'Carregando dados do evento...', customClass: 'loading-varandao' });
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
      hora_evento: data.hora_evento,
      hora_saida: data.hora_saida,
      responsavel: data.responsavel,
      quantidade_pessoas: {
        quantidade_adultos: data.quantidade_pessoas?.quantidade_adultos || null,
        quantidade_criancas: data.quantidade_pessoas?.quantidade_criancas || null,
        quantidade_staffs: data.quantidade_pessoas?.quantidade_staffs || null,
      },
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
    setTimeout(() => {
      $q.loading.hide();
    }, 800);
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
  isCarregando.value = true;
  await carregarEvento();
  await carregarFreelas();
  await carregarProdutos();
  setTimeout(() => {
    isCarregando.value = false;
  }, 500);
});

const categoriasProdutos: CategoriaProduto[] = [
  { slug: 'proteina', label: 'Proteínas', color: 'secondary', produtos: ref<Produto[]>([]) },
  {
    slug: 'acompanhamento',
    label: 'Acompanhamentos',
    color: 'secondary',
    produtos: ref<Produto[]>([]),
  },
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
    $q.loading.show({ message: 'Carregando produtos...', customClass: 'loading-varandao' });

    await Promise.all(
      categoriasProdutos.map(async (categoria) => {
        categoria.produtos.value = await buscarProdutosPorCategoria(categoria.slug);
      }),
    );

    // Sincronizar itens após carregar produtos
    sincronizarItens();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Não foi possível carregar os produtos. Atualize a página e tente novamente.',
    });
  } finally {
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

// carregarProdutos is now called in the main onMounted block above
// onMounted(carregarProdutos);

const sugerirItensPorMenu = (menu: string) => {
  if (!menu) return;
  const itensSugeridos = menuMapping[menu] || [];

  categoriasProdutos.forEach((categoria) => {
    categoria.produtos.value.forEach((produto) => {
      // Se o produto faz parte do sistema de menus
      if (todosItensMenu.has(produto.nome)) {
        // Marca como selecionado se estiver no menu atual, desmarca se não estiver
        produto.selected = itensSugeridos.includes(produto.nome);
        if (produto.selected && !produto.quantidade) {
          produto.quantidade = null;
        }
      }
    });
  });
};

const isCarregando = ref(true);

watch(
  () => evento.value.menu,
  (novoMenu) => {
    if (!isCarregando.value) {
      sugerirItensPorMenu(novoMenu);
    }
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
