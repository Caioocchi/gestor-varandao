<template>
  <q-page class="q-pa-md">
    <div class="full-width" style="max-width: 800px; margin: 0 auto">
      <!-- Barra de Pesquisa e Upload -->
      <div class="row q-col-gutter-sm q-mb-md items-center">
        <div class="col">
          <q-input
            v-model="filtro"
            placeholder="Pesquisar por nome de arquivo..."
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
            icon="cloud_upload"
            label="Enviar"
            no-caps
            unelevated
            @click="abrirDialogUpload"
            class="shadow-soft"
            style="border-radius: 12px; height: 40px"
          />
        </div>
      </div>

      <!-- Lista de Arquivos -->
      <div v-if="loading" class="row justify-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div
        v-else-if="arquivosFiltrados.length === 0"
        class="text-center q-pa-xl text-grey-5 glass-card-dark bg-white"
      >
        <q-icon name="folder_open" size="64px" class="q-mb-md text-grey-4" />
        <div class="text-subtitle1 text-grey-6 text-weight-medium">Nenhum arquivo encontrado</div>
        <div class="text-caption text-grey-5">Faça upload de arquivos como PDFs ou imagens.</div>
      </div>

      <div v-else class="column q-gutter-y-sm">
        <q-card
          v-for="arquivo in arquivosFiltrados"
          :key="arquivo._id"
          class="card-base shadow-soft file-card"
          style="max-width: 600px; width: 100%"
        >
          <q-item class="q-py-md">
            <!-- Icone dependendo do tipo do arquivo -->
            <q-item-section avatar>
              <q-avatar
                size="48px"
                :class="[
                  obterEstilosIcone(arquivo.mimeType).bg,
                  obterEstilosIcone(arquivo.mimeType).text,
                ]"
                :icon="obterIcone(arquivo.mimeType)"
                class="shadow-mini"
              />
            </q-item-section>

            <!-- Descrição do arquivo -->
            <q-item-section>
              <q-item-label class="text-weight-bold text-grey-9 ellipsis text-subtitle1">
                {{ arquivo.nomeArquivo }}
              </q-item-label>
              <q-item-label caption class="text-grey-6 row items-center q-gutter-x-sm">
                <span>{{ formatarTamanho(arquivo.tamanho) }}</span>
                <span class="text-grey-4">•</span>
                <span>{{ formatarData(arquivo.createdAt) }}</span>
              </q-item-label>
            </q-item-section>

            <!-- Ações do arquivo -->
            <q-item-section side>
              <div class="row no-wrap q-gutter-x-xs">
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="cloud_download"
                  @click="baixarArquivo(arquivo)"
                  class="action-btn"
                >
                  <q-tooltip>Baixar Arquivo</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="green-8"
                  icon="mdi-whatsapp"
                  @click="enviarPorWhatsapp(arquivo)"
                  class="action-btn"
                >
                  <q-tooltip>Enviar via WhatsApp</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  @click="confirmarExclusao(arquivo)"
                  class="action-btn"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <!-- Dialog de Upload -->
      <q-dialog v-model="showUploadDialog" persistent>
        <q-card style="width: 100%; max-width: 350px; border-radius: 16px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-primary">Enviar Novo Arquivo</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md column q-gutter-y-sm">
            <!-- Campo Nome Personalizado -->
            <q-input
              v-model="customNomeArquivo"
              label="Nome do Arquivo"
              outlined
              dense
              class="input-rounded"
              placeholder="Digite o nome do arquivo (ex: Cardápio)"
              :rules="[(val) => !!val || 'Nome do arquivo é obrigatório']"
            />

            <q-file
              v-model="arquivoSelecionado"
              label="Selecione um arquivo"
              outlined
              dense
              bg-color="white"
              class="input-rounded"
              @update:model-value="preencherNomePadrao"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn label="Cancelar" flat color="grey-6" v-close-popup no-caps />
            <q-btn
              label="Enviar"
              color="primary"
              unelevated
              no-caps
              @click="enviarArquivo"
              :disable="!arquivoSelecionado || !customNomeArquivo.trim()"
              class="rounded-borders px-md"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog de Confirmação de Exclusão -->
      <q-dialog v-model="showDeleteDialog" persistent>
        <q-card style="border-radius: 16px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-negative">Excluir Arquivo</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md text-body1 text-grey-8">
            Tem certeza que deseja excluir permanentemente o arquivo
            <strong>{{ arquivoFoco?.nomeArquivo }}</strong
            >? Essa ação não pode ser desfeita.
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn label="Cancelar" flat color="grey-6" v-close-popup no-caps />
            <q-btn
              label="Excluir"
              color="negative"
              unelevated
              no-caps
              @click="excluirArquivo"
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

interface Arquivo {
  _id: string;
  nomeArquivo: string;
  mimeType: string;
  urlArquivo: string;
  tamanho: number;
  createdAt: string;
}

const arquivos = ref<Arquivo[]>([]);
const loading = ref(true);
const filtro = ref('');

// Controles de Dialogs
const showUploadDialog = ref(false);
const arquivoSelecionado = ref<File | null>(null);
const customNomeArquivo = ref('');

const abrirDialogUpload = () => {
  customNomeArquivo.value = '';
  arquivoSelecionado.value = null;
  showUploadDialog.value = true;
};

const preencherNomePadrao = (file: File | null) => {
  if (file && !customNomeArquivo.value.trim()) {
    const nomeSemExtensao = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    customNomeArquivo.value = nomeSemExtensao;
  }
};

const showDeleteDialog = ref(false);
const arquivoFoco = ref<Arquivo | null>(null);

// Carregar arquivos da API
const carregarArquivos = async () => {
  loading.value = true;
  $q.loading.show({
    message: 'Carregando arquivos...',
    customClass: 'loading-varandao',
  });
  try {
    const { data } = await api.get('/arquivos', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    arquivos.value = data.arquivos || [];
  } catch (error) {
    console.error('Erro ao carregar arquivos:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar arquivos do servidor.',
      icon: 'error',
    });
  } finally {
    loading.value = false;
    setTimeout(() => {
      $q.loading.hide();
    }, 500);
  }
};

const arquivosFiltrados = computed(() => {
  if (!filtro.value) return arquivos.value;
  const termo = filtro.value.toLowerCase();
  return arquivos.value.filter((arq) => arq.nomeArquivo.toLowerCase().includes(termo));
});

// Ações
const enviarArquivo = async () => {
  if (!arquivoSelecionado.value) return;

  $q.loading.show({ message: 'Enviando arquivo...' });
  const formData = new FormData();
  formData.append('file', arquivoSelecionado.value);
  if (customNomeArquivo.value.trim()) {
    formData.append('nomeArquivo', customNomeArquivo.value.trim());
  }

  try {
    await api.post('/arquivos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    $q.notify({
      color: 'positive',
      message: 'Arquivo enviado com sucesso!',
      icon: 'check',
    });

    customNomeArquivo.value = '';
    arquivoSelecionado.value = null;
    showUploadDialog.value = false;
    await carregarArquivos();
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao fazer upload do arquivo.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

const enviarPorWhatsapp = (arquivo: Arquivo) => {
  const baseUrl = api.defaults.baseURL || '';
  const urlCompleta = arquivo.urlArquivo.startsWith('http')
    ? arquivo.urlArquivo
    : `${baseUrl}/${arquivo.urlArquivo}`;
  const texto = encodeURIComponent(
    `Olá! Segue o link para o arquivo *${arquivo.nomeArquivo}*: ${urlCompleta}`,
  );
  if (isIOS) {
    window.location.href = `https://wa.me/?text=${texto}`;
  } else {
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
  }
};

const confirmarExclusao = (arquivo: Arquivo) => {
  arquivoFoco.value = arquivo;
  showDeleteDialog.value = true;
};

const excluirArquivo = async () => {
  if (!arquivoFoco.value) return;

  $q.loading.show({ message: 'Excluindo arquivo...' });
  try {
    await api.post(`/arquivos/delete/${arquivoFoco.value._id}`);

    $q.notify({
      color: 'positive',
      message: 'Arquivo excluído com sucesso!',
      icon: 'check',
    });

    showDeleteDialog.value = false;
    await carregarArquivos();
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao excluir arquivo do servidor.',
      icon: 'error',
    });
  } finally {
    $q.loading.hide();
  }
};

const baixarArquivo = (arquivo: Arquivo) => {
  const url = arquivo.urlArquivo.startsWith('http')
    ? arquivo.urlArquivo
    : `${api.defaults.baseURL || ''}/${arquivo.urlArquivo}`;
  window.open(url, '_blank');
};

// Formatação helpers
const formatarTamanho = (bytes?: number) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatarData = (dataStr: string) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const obterIcone = (mime?: string) => {
  if (!mime) return 'insert_drive_file';
  if (mime.includes('pdf')) return 'picture_as_pdf';
  if (mime.includes('image')) return 'image';
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return 'table_view';
  if (mime.includes('word') || mime.includes('document')) return 'description';
  return 'insert_drive_file';
};

const obterEstilosIcone = (mime?: string) => {
  if (!mime) return { bg: 'bg-grey-2', text: 'text-grey-8' };
  if (mime.includes('pdf')) return { bg: 'bg-red-1', text: 'text-red-8' };
  if (mime.includes('image')) return { bg: 'bg-teal-1', text: 'text-teal-8' };
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv'))
    return { bg: 'bg-green-1', text: 'text-green-8' };
  if (mime.includes('word') || mime.includes('document'))
    return { bg: 'bg-blue-1', text: 'text-blue-8' };
  return { bg: 'bg-grey-2', text: 'text-grey-8' };
};

onMounted(carregarArquivos);
</script>

<style lang="scss" scoped>
.glass-card-dark {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}
.input-rounded {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}
.file-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
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
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}
.shadow-mini {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}
</style>
