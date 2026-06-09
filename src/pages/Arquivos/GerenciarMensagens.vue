<template>
  <q-page class="q-pa-md">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Barra de Pesquisa e Botão Novo -->
      <div class="row q-col-gutter-sm q-mb-md items-center">
        <div class="col">
          <q-input
            v-model="filtro"
            placeholder="Pesquisar por título..."
            outlined
            dense
            bg-color="white"
            class="input-rounded"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append v-if="filtro">
              <q-icon name="close" class="cursor-pointer" @click="filtro = ''" />
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Nova"
            no-caps
            unelevated
            @click="abrirDialogNovo"
            class="shadow-soft"
            style="border-radius: 12px; height: 40px"
          />
        </div>
      </div>

      <!-- Lista de Mensagens -->
      <div v-if="loading" class="row justify-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="mensagensFiltradas.length === 0" class="text-center q-pa-xl text-grey-5 glass-card-dark bg-white">
        <q-icon name="chat" size="64px" class="q-mb-md text-grey-4" />
        <div class="text-subtitle1 text-grey-6 text-weight-medium">Nenhum modelo de mensagem encontrado</div>
        <div class="text-caption text-grey-5">Crie modelos de mensagens para envio rápido de WhatsApp.</div>
      </div>

      <div v-else class="column q-gutter-y-sm">
        <q-card
          v-for="msg in mensagensFiltradas"
          :key="msg._id"
          class="card-base shadow-soft message-card"
        >
          <q-card-section class="q-pa-md column">
            <!-- Top Row -->
            <div class="row items-center justify-between">
              <div class="row items-center q-gutter-x-sm">
                <q-avatar
                  size="36px"
                  color="green-1"
                  text-color="green-8"
                  icon="chat"
                />
                <div class="text-subtitle1 text-weight-bold text-grey-9">{{ msg.titulo }}</div>
              </div>
              <q-badge
                :color="msg.ativo ? 'green-11' : 'grey-3'"
                :text-color="msg.ativo ? 'green-10' : 'grey-7'"
                class="text-weight-bold q-px-sm q-py-xs text-caption"
                style="border-radius: 8px"
              >
                {{ msg.ativo ? 'Ativa' : 'Inativa' }}
              </q-badge>
            </div>

            <!-- Preview da mensagem -->
            <div class="whatsapp-bubble q-pa-md q-my-md preserve-whitespace">
              {{ msg.mensagem }}
            </div>

            <!-- Bottom Row -->
            <div class="row justify-between items-center">
              <span class="text-caption text-grey-5">Criado em: {{ formatarData(msg.createdAt) }}</span>
              <div class="row q-gutter-x-xs">
                <q-btn
                  flat
                  round
                  dense
                  color="green-8"
                  icon="content_copy"
                  @click="copiarMensagem(msg.mensagem)"
                  class="action-btn"
                >
                  <q-tooltip>Copiar Mensagem</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="secondary"
                  icon="edit"
                  @click="abrirDialogEditar(msg)"
                  class="action-btn"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click="confirmarExclusao(msg)"
                  class="action-btn"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Dialog Criar/Editar -->
      <q-dialog v-model="showFormDialog" persistent>
        <q-card style="min-width: 400px; max-width: 600px; border-radius: 16px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-primary">
              {{ isEdit ? 'Editar Mensagem' : 'Nova Mensagem Padrão' }}
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md column q-gutter-y-sm">
            <!-- Título -->
            <q-input
              v-model="formulario.titulo"
              label="Título do Modelo"
              outlined
              dense
              class="input-rounded"
              :rules="[val => !!val || 'Título é obrigatório']"
            />

            <!-- Conteúdo da Mensagem -->
            <q-input
              v-model="formulario.mensagem"
              label="Texto da Mensagem (WhatsApp)"
              outlined
              type="textarea"
              rows="6"
              class="input-rounded"
              placeholder="Digite o texto do modelo..."
              :rules="[val => !!val || 'Texto da mensagem é obrigatório']"
            />

            <!-- Toggle Ativo -->
            <q-toggle
              v-model="formulario.ativo"
              label="Modelo Ativo"
              color="primary"
            />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn label="Cancelar" flat color="grey-6" v-close-popup no-caps />
            <q-btn
              label="Salvar"
              color="primary"
              unelevated
              no-caps
              @click="salvarMensagem"
              :disable="!formulario.titulo.trim() || !formulario.mensagem.trim()"
              class="rounded-borders"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Confirmação de Exclusão -->
      <q-dialog v-model="showDeleteDialog" persistent>
        <q-card style="border-radius: 16px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-negative">Excluir Mensagem</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md text-body1 text-grey-8">
            Tem certeza que deseja excluir permanentemente o modelo <strong>{{ mensagemFoco?.titulo }}</strong>? Essa ação não pode ser desfeita.
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn label="Cancelar" flat color="grey-6" v-close-popup no-caps />
            <q-btn
              label="Excluir"
              color="negative"
              unelevated
              no-caps
              @click="excluirMensagem"
              class="rounded-borders"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

interface Mensagem {
  _id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  ativo: boolean;
  createdAt: string;
}

const mensagens = ref<Mensagem[]>([]);
const loading = ref(true);
const filtro = ref('');

// Controles do Form
const showFormDialog = ref(false);
const isEdit = ref(false);
const mensagemFoco = ref<Mensagem | null>(null);

const formulario = ref({
  titulo: '',
  mensagem: '',
  ativo: true,
});

// Controle de exclusão
const showDeleteDialog = ref(false);

const carregarMensagens = async () => {
  loading.value = true;
  $q.loading.show({
    message: 'Carregando mensagens...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get('/arquivos');
    mensagens.value = data.whatsapp || [];
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar mensagens do servidor.',
      icon: 'error',
    });
  } finally {
    loading.value = false;
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

const mensagensFiltradas = computed(() => {
  if (!filtro.value) return mensagens.value;
  const termo = filtro.value.toLowerCase();
  return mensagens.value.filter((msg) => msg.titulo.toLowerCase().includes(termo));
});

// Ações
const abrirDialogNovo = () => {
  isEdit.value = false;
  mensagemFoco.value = null;
  formulario.value = {
    titulo: '',
    mensagem: '',
    ativo: true,
  };
  showFormDialog.value = true;
};

const abrirDialogEditar = (msg: Mensagem) => {
  isEdit.value = true;
  mensagemFoco.value = msg;
  formulario.value = {
    titulo: msg.titulo,
    mensagem: msg.mensagem,
    ativo: msg.ativo,
  };
  showFormDialog.value = true;
};

const salvarMensagem = async () => {
  const payload = {
    titulo: formulario.value.titulo.trim(),
    mensagem: formulario.value.mensagem.trim(),
    ativo: formulario.value.ativo,
  };

  $q.loading.show({ message: 'Salvando modelo de mensagem...' });

  try {
    if (isEdit.value && mensagemFoco.value) {
      await api.put(`/arquivos/whatsapp/update/${mensagemFoco.value._id}`, payload);
      $q.notify({
        color: 'positive',
        message: 'Modelo atualizado com sucesso!',
        icon: 'check',
      });
    } else {
      await api.post('/arquivos/whatsapp', payload);
      $q.notify({
        color: 'positive',
        message: 'Modelo criado com sucesso!',
        icon: 'check',
      });
    }

    showFormDialog.value = false;
    await carregarMensagens();
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao registrar modelo de mensagem.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const confirmarExclusao = (msg: Mensagem) => {
  mensagemFoco.value = msg;
  showDeleteDialog.value = true;
};

const excluirMensagem = async () => {
  if (!mensagemFoco.value) return;

  $q.loading.show({ message: 'Excluindo modelo...' });
  try {
    await api.post(`/arquivos/delete/${mensagemFoco.value._id}`);

    $q.notify({
      color: 'positive',
      message: 'Modelo excluído com sucesso!',
      icon: 'check',
    });

    showDeleteDialog.value = false;
    await carregarMensagens();
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao excluir modelo do servidor.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const copiarMensagem = async (texto: string) => {
  try {
    await navigator.clipboard.writeText(texto);
    $q.notify({
      color: 'positive',
      message: 'Texto copiado para a área de transferência!',
      icon: 'check',
      timeout: 1500,
    });
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    $q.notify({
      color: 'negative',
      message: 'Não foi possível copiar o texto.',
      icon: 'warning',
    });
  }
};

// Formatação helpers
const formatarData = (dataStr: string) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

onMounted(carregarMensagens);
</script>

<style lang="scss" scoped>
.glass-card-dark {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}
.preserve-whitespace {
  white-space: pre-wrap;
  word-break: break-word;
}
.input-rounded {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}
.whatsapp-bubble {
  background: rgba(37, 211, 102, 0.06);
  border-left: 4px solid #25d366;
  border-radius: 0 12px 12px 12px;
  color: #2c3e50;
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.5;
}
.message-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
  background: rgba(250, 249, 246, 0.95);
  backdrop-filter: blur(8px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}
.action-btn {
  opacity: 0.8;
  transition: opacity 0.2s ease, transform 0.2s ease;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
