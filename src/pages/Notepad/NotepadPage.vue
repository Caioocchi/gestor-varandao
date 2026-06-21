<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 600px; margin: 0 auto">
      <!-- Cabeçalho do Bloco de Notas -->
      <div class="row items-center justify-between q-mb-lg q-pt-md no-wrap">
        <div class="column">
          <div class="text-h4 text-weight-bold text-white">Lista de Compras</div>
          <div class="text-body2 text-grey-5" style="opacity: 0.75">
            {{ totalItensTexto }}
          </div>
        </div>
        <q-btn
          v-if="itens.length > 0"
          flat
          round
          dense
          color="negative"
          icon="delete_sweep"
          size="md"
          class="clear-all-btn"
          :disable="salvando"
          @click="limparNotepad"
        >
        </q-btn>
      </div>

      <!-- Card do Bloco de Notas (Estilo Papel de Notas iOS) -->
      <q-card class="glass-card shadow-elevated overflow-hidden notepad-card">
        <!-- Campo para Adicionar Novo Item -->
        <div class="q-pa-md border-bottom-dashed">
          <q-input
            v-model="novoItemText"
            placeholder="Digite um item para inserir na lista..."
            outlined
            rounded
            dense
            dark
            color="secondary"
            bg-color="transparent"
            class="input-rounded input-ios"
            @keyup.enter="adicionarItem"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                color="secondary"
                icon="add"
                class="add-btn"
                :disable="!novoItemText.trim() || salvando"
                @click="adicionarItem"
              >
                <q-tooltip v-if="novoItemText.trim()">Adicionar Item</q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </div>

        <!-- Lista de Itens -->
        <q-card-section class="q-pa-none relative-position list-container">
          <div v-if="loading" class="q-pa-xl text-center">
            <q-spinner-oval color="secondary" size="44px" />
            <div class="text-caption text-grey-5 q-mt-md">Carregando notas...</div>
          </div>

          <div v-else-if="itens.length === 0" class="q-pa-xl text-center text-grey-5 empty-state">
            <q-icon name="edit_note" size="72px" color="grey-6" class="q-mb-sm pulse-slow" />
            <div class="text-subtitle1 text-weight-bold text-white">Lista de Compras Vazia</div>
            <div class="text-caption text-grey-5 q-mt-xs" style="max-width: 280px; margin: 0 auto">
              Comece escrevendo um item no campo acima e pressione Enter.
            </div>
          </div>

          <q-list v-else class="notepad-list">
            <transition-group name="list" tag="div">
              <!-- Item com Swipe Customizado -->
              <div
                v-for="item in itens"
                :key="item._id"
                :id="`swipe-container-${item._id}`"
                class="swipe-container relative-position overflow-hidden"
              >
                <!-- Botão de Excluir Fixo ao Fundo -->
                <div
                  class="delete-action-bg absolute-right full-height bg-negative flex items-center justify-end"
                  :style="{ width: `${Math.max(60, -(item.offsetX || 0))}px` }"
                >
                  <q-btn
                    flat
                    square
                    no-caps
                    color="white"
                    icon="delete"
                    class="delete-action-btn full-height"
                    style="width: 100%"
                    @click.stop="removerItem(item)"
                  />
                </div>

                <!-- Conteúdo Deslizável superior -->
                <div
                  class="swipe-content"
                  :class="{ 'swipe-transition': !item.isDragging }"
                  :style="{ transform: `translateX(${item.offsetX || 0}px)` }"
                  @touchstart="(e) => onTouchStart(e, item)"
                  @touchmove="onTouchMove"
                  @touchend="onTouchEnd"
                  @mousedown="(e) => onMouseDown(e, item)"
                >
                  <q-item class="notepad-item q-py-sm q-px-md row items-center no-wrap">
                    <div class="row items-center col no-wrap">
                      <q-btn
                        flat
                        round
                        dense
                        :color="item.checked ? 'secondary' : 'grey-5'"
                        :icon="item.checked ? 'check_circle' : 'radio_button_unchecked'"
                        size="md"
                        class="checkbox-ios q-mr-sm"
                        :disable="salvando"
                        @click.stop="toggleItem(item)"
                      />
                      <span
                        class="notepad-item-text text-white cursor-pointer col text-weight-medium"
                        :class="{ 'item-checked': item.checked }"
                        @click.stop="toggleItem(item)"
                      >
                        {{ item.nome }}
                      </span>
                    </div>
                  </q-item>
                </div>
              </div>
            </transition-group>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Dialog de Confirmação para Limpar Tudo -->
    <q-dialog v-model="confirmClearDialog" backdrop-filter="blur(4px)">
      <q-card class="confirm-card card-base">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold text-primary">Excluir todos os itens</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md text-grey-8">
          Você tem certeza de que deseja excluir todos os itens da Lista de Compras? Essa ação não
          pode ser desfeita.
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat label="Cancelar" color="primary" no-caps v-close-popup />
          <q-btn
            unelevated
            label="Excluir tudo"
            color="negative"
            class="btn-rounded"
            style="padding: 4px 20px; border-radius: 8px"
            @click="limparNotepadConfirmado"
            v-close-popup
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

interface NotepadItem {
  _id: string;
  nome: string;
  checked: boolean;
  offsetX?: number;
  isDragging?: boolean;
  isSwiped?: boolean;
}

const itens = ref<NotepadItem[]>([]);
const loading = ref(true);
const salvando = ref(false);
const novoItemText = ref('');
const confirmClearDialog = ref(false);

// ID do item que está atualmente arrastado/aberto
const activeSwipeId = ref<string | null>(null);

// Variáveis de controle de arrasto
let startX = 0;
let startY = 0;
let isDragging = false;
let isScrolling = false;
let hasCheckedDirection = false;
let currentSwipingItem: NotepadItem | null = null;

// Texto auxiliar de contador de itens
const totalItensTexto = computed(() => {
  if (itens.value.length === 0) return 'Nenhuma nota gravada';
  const marcados = itens.value.filter((i) => i.checked).length;
  return `${itens.value.length} ${itens.value.length === 1 ? 'item' : 'itens'} (${marcados} marcados)`;
});

// Inicializa propriedades de reatividade para o swipe
const mapearItens = (dados: NotepadItem[]): NotepadItem[] => {
  return dados.map((item) => ({
    ...item,
    offsetX: 0,
    isDragging: false,
    isSwiped: false,
  }));
};

// Buscar bloco de notas
const buscarNotepad = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/notepad', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    itens.value = mapearItens(data.itens || []);
  } catch (error) {
    console.error('Erro ao buscar a lista de compras:', error);
    $q.notify({
      color: 'negative',
      message: 'Não foi possível carregar a lista de compras.',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
};

// Adicionar item
const adicionarItem = async () => {
  const texto = novoItemText.value.trim();
  if (!texto) return;

  salvando.value = true;
  $q.loading.show({
    message: 'Adicionando item...',
    customClass: 'loading-varandao',
  });

  try {
    const { data } = await api.post(
      '/notepad',
      {
        nome: texto,
        checked: false,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    itens.value = mapearItens(data.itens || []);
    novoItemText.value = '';

    $q.notify({
      color: 'positive',
      message: 'Item adicionado!',
      icon: 'check',
      timeout: 1000,
    });
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao adicionar item.',
      icon: 'warning',
    });
  } finally {
    $q.loading.hide();
    salvando.value = false;
  }
};

// Alternar status do item
const toggleItem = async (item: NotepadItem) => {
  // Se o item estiver aberto para exclusão, não faz nada (não fecha e não altera o status)
  if (item.isSwiped) {
    return;
  }

  const novoEstado = !item.checked;
  item.checked = novoEstado;

  try {
    const { data } = await api.post(
      `/notepad/item/update/${item._id}`,
      {
        checked: novoEstado,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    itens.value = mapearItens(data.itens || []);
  } catch (error) {
    console.error('Erro ao atualizar status do item:', error);
    item.checked = !novoEstado;
    $q.notify({
      color: 'negative',
      message: 'Erro ao salvar alteração.',
      icon: 'warning',
    });
  }
};

// Remover item do bloco
const removerItem = async (item: NotepadItem) => {
  salvando.value = true;
  $q.loading.show({
    message: 'Removendo item...',
    customClass: 'loading-varandao',
  });

  try {
    const { data } = await api.post(
      `/notepad/item/delete/${item._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    itens.value = mapearItens(data.itens || []);
    activeSwipeId.value = null;

    $q.notify({
      color: 'positive',
      message: 'Item removido!',
      icon: 'delete',
      timeout: 1000,
    });
  } catch (error) {
    console.error('Erro ao remover item:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao excluir item.',
      icon: 'warning',
    });
    fecharItem(item);
  } finally {
    $q.loading.hide();
    salvando.value = false;
  }
};

// Limpar todos os itens de uma vez
const limparNotepad = () => {
  confirmClearDialog.value = true;
};

const limparNotepadConfirmado = async () => {
  salvando.value = true;
  $q.loading.show({
    message: 'Limpando lista de compras...',
    customClass: 'loading-varandao',
  });

  try {
    const { data } = await api.post(
      '/notepad/clear',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    itens.value = mapearItens(data.itens || []);
    activeSwipeId.value = null;

    $q.notify({
      color: 'positive',
      message: 'Lista de compras limpa!',
      icon: 'check',
      timeout: 1000,
    });
  } catch (error) {
    console.error('Erro ao limpar lista de compras:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao limpar lista de compras.',
      icon: 'warning',
    });
  } finally {
    $q.loading.hide();
    salvando.value = false;
  }
};

// Gestão de estado do Swipe (Arrastar)
const abrirItem = (item: NotepadItem) => {
  item.offsetX = -60; // Abre exibindo os 60px de largura do botão
  item.isSwiped = true;
  activeSwipeId.value = item._id;
};

const fecharItem = (item: NotepadItem) => {
  item.offsetX = 0;
  item.isSwiped = false;
  if (activeSwipeId.value === item._id) {
    activeSwipeId.value = null;
  }
};

const onDragStart = (x: number, item: NotepadItem) => {
  // Se houver outro item aberto, fecha-o antes
  if (activeSwipeId.value && activeSwipeId.value !== item._id) {
    const anterior = itens.value.find((it) => it._id === activeSwipeId.value);
    if (anterior) fecharItem(anterior);
  }

  startX = x;
  currentSwipingItem = item;
  isDragging = true;
  item.isDragging = true;
};

const onDragMove = (x: number) => {
  if (!isDragging || !currentSwipingItem) return;
  const deltaX = x - startX;

  if (deltaX < 0) {
    // Arrastando da direita para a esquerda (Abrindo ou esticando)
    const baseOffset = currentSwipingItem.isSwiped ? -60 : 0;
    const novoOffset = Math.max(-250, baseOffset + deltaX);
    currentSwipingItem.offsetX = novoOffset;
  } else if (deltaX > 0 && currentSwipingItem.isSwiped) {
    // Arrastando da esquerda para a direita (Fechando)
    const baseOffset = -60;
    const novoOffset = Math.min(0, baseOffset + deltaX);
    currentSwipingItem.offsetX = novoOffset;
  }
};

const onDragEnd = async () => {
  if (!isDragging || !currentSwipingItem) return;
  isDragging = false;
  currentSwipingItem.isDragging = false;

  const offset = currentSwipingItem.offsetX || 0;

  // Se arrastou muito para a esquerda (até o final), deleta direto
  if (offset <= -160) {
    await removerItem(currentSwipingItem);
    currentSwipingItem = null;
    return;
  }

  if (currentSwipingItem.isSwiped) {
    // Estava aberto, se arrastou de volta um pouco (offset > -40), fecha
    if (offset > -40) {
      fecharItem(currentSwipingItem);
    } else {
      abrirItem(currentSwipingItem);
    }
  } else {
    // Estava fechado, se arrastou o suficiente para a esquerda (offset < -30), abre e fixa
    if (offset < -30) {
      abrirItem(currentSwipingItem);
    } else {
      fecharItem(currentSwipingItem);
    }
  }

  currentSwipingItem = null;
};

// Eventos Touch (Mobile)
const onTouchStart = (e: TouchEvent, item: NotepadItem) => {
  const touch = e.touches[0];
  if (touch) {
    startY = touch.clientY;
    isScrolling = false;
    hasCheckedDirection = false;
    onDragStart(touch.clientX, item);
  }
};

const onTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (touch && isDragging && currentSwipingItem) {
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (!hasCheckedDirection) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX > 5 || absY > 5) {
        if (absY > absX) {
          isScrolling = true;
          isDragging = false;
          currentSwipingItem.isDragging = false;
          currentSwipingItem.offsetX = currentSwipingItem.isSwiped ? -60 : 0;
          currentSwipingItem = null;
        }
        hasCheckedDirection = true;
      } else {
        return;
      }
    }

    if (isScrolling) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault();
    }
    onDragMove(touch.clientX);
  }
};

const onTouchEnd = () => {
  void onDragEnd();
};

// Eventos Mouse (Desktop)
const onMouseDown = (e: MouseEvent, item: NotepadItem) => {
  if (e.button !== 0) return; // Apenas clique esquerdo
  onDragStart(e.clientX, item);

  const onMouseMove = (event: MouseEvent) => {
    onDragMove(event.clientX);
  };

  const onMouseUp = () => {
    void onDragEnd();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

// Clicar fora para fechar o item aberto
const handleGlobalClick = (event: MouseEvent | TouchEvent) => {
  if (!activeSwipeId.value) return;

  const target = event.target as HTMLElement;
  // Se clicou no próprio botão de excluir, não faz nada por aqui
  if (target.closest('.delete-action-btn')) {
    return;
  }

  // Se clicou dentro do próprio item que está aberto, não fecha
  const container = document.getElementById(`swipe-container-${activeSwipeId.value}`);
  if (container && container.contains(target)) {
    return;
  }

  // Se clicou em qualquer outro lugar (incluindo outros itens ou fora), fecha
  const item = itens.value.find((it) => it._id === activeSwipeId.value);
  if (item) {
    fecharItem(item);
  }
};

onMounted(() => {
  void buscarNotepad();
  window.addEventListener('mousedown', handleGlobalClick, true);
  window.addEventListener('touchstart', handleGlobalClick, true);
});

onUnmounted(() => {
  window.removeEventListener('mousedown', handleGlobalClick, true);
  window.removeEventListener('touchstart', handleGlobalClick, true);
});
</script>

<style lang="scss" scoped>
.clear-all-btn {
  background-color: rgba(244, 67, 54, 0.1);
  transition: all 0.25s ease;
  &:hover {
    background-color: rgba(244, 67, 54, 0.25);
    transform: scale(1.05);
  }
}

.notepad-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.border-bottom-dashed {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}

.input-ios {
  ::v-deep(.q-field__control) {
    background-color: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba($secondary, 0.5);
    }
  }

  &.q-field--focused {
    ::v-deep(.q-field__control) {
      border-color: $secondary;
      box-shadow: 0 0 10px rgba($secondary, 0.2);
    }
  }
}

.add-btn {
  transition: all 0.25s ease;
  &:hover:not([disabled]) {
    transform: scale(1.15) rotate(90deg);
  }
}

.list-container {
  min-height: 200px;
}

.notepad-list {
  max-height: 60vh;
  overflow-y: auto;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.swipe-container {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background: transparent !important;
  user-select: none;
  -webkit-user-select: none;

  &:last-child {
    border-bottom: none;
  }
}

.delete-action-bg {
  width: 60px;
  z-index: 1;
}

.delete-action-btn {
  width: 100%;
  border-radius: 0;
  font-weight: bold;
}

.swipe-content {
  position: relative;
  z-index: 2;
  background: #222d2f !important; /* Cor sólida para ocultar o botão vermelho de fundo */
  width: 100%;
  user-select: none;
  -webkit-user-select: none;
}

.swipe-transition {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.notepad-item {
  transition: background-color 0.25s ease;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
}

.checkbox-ios {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:active {
    transform: scale(0.85);
  }
}

.notepad-item-text {
  font-size: 0.95rem;
  letter-spacing: 0.2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  word-break: break-word;
  white-space: normal;
  padding: 8px 0;
  user-select: none;
}

.item-checked {
  text-decoration: line-through;
  opacity: 0.45;
  color: rgba(255, 255, 255, 0.4) !important;
}

/* Empty state animations */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

.pulse-slow {
  animation: pulse 3s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.95;
  }
}

/* List animations (Fades & Slide transitions) */
.list-enter-active,
.list-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
