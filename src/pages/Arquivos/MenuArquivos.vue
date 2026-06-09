<template>
  <q-page class="q-pa-lg flex flex-center">
    <div class="full-width" style="max-width: 600px; margin: 0 auto">
      <!-- Cabeçalho -->
      <div class="text-center q-mb-xl">
        <div class="row items-center justify-center q-mb-md">
          <div class="text-h4 text-weight-bold text-white-shadow text-white">
            Painel de Conteúdo
          </div>
        </div>
        <div class="text-body2 text-grey-4">
          Gerencie os arquivos salvos no servidor e as mensagens padrões do WhatsApp
        </div>
      </div>

      <!-- Grid de Duas Colunas -->
      <div class="row q-col-gutter-md">
        <!-- Card 1: Arquivos Salvos -->
        <div class="col-12 col-sm-6">
          <router-link to="/arquivos/gerenciar" class="text-decoration-none block full-height">
            <q-card class="menu-card card-base shadow-soft full-height">
              <q-card-section
                class="column items-center justify-center text-center q-pa-lg full-height"
              >
                <q-avatar
                  size="64px"
                  color="green-11"
                  text-color="primary"
                  icon="folder_zip"
                  class="q-mb-md shadow-robust"
                />
                <div class="text-h6 text-weight-bold text-primary q-mb-xs">Arquivos Salvos</div>
                <div class="text-caption text-grey-6">
                  Faça upload, baixe, renomeie ou exclua arquivos úteis para os eventos.
                </div>
              </q-card-section>
            </q-card>
          </router-link>
        </div>

        <!-- Card 2: Mensagens WhatsApp -->
        <div class="col-12 col-sm-6">
          <router-link to="/arquivos/mensagens" class="text-decoration-none block full-height">
            <q-card class="menu-card card-base shadow-soft full-height">
              <q-card-section
                class="column items-center justify-center text-center q-pa-lg full-height"
              >
                <q-avatar
                  size="64px"
                  color="primary"
                  text-color="white"
                  icon="chat"
                  class="q-mb-md shadow-robust"
                />
                <div class="text-h6 text-weight-bold text-primary q-mb-xs">
                  Mensagens de WhatsApp
                </div>
                <div class="text-caption text-grey-6">
                  Crie, altere e exclua modelos de mensagens padrão para compartilhamento.
                </div>
              </q-card-section>
            </q-card>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Nenhuma lógica de estado necessária para o menu simples
</script>

<style lang="scss" scoped>
.text-white-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.bg-white-opacity {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.15);
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
  }
}

.menu-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  border-radius: 16px;
  background: white;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);
  }
}

.block {
  display: block;
}

.full-height {
  height: 100%;
}

.text-decoration-none {
  text-decoration: none;
}

.shadow-robust {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
</style>
