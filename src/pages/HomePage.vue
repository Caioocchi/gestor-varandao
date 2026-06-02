<template>
  <q-page class="q-pa-lg">
    <div class="full-width" style="max-width: 600px; margin: 0 auto;">
      <div class="text-center q-mb-xl q-pt-lg">
        <div class="text-h4 text-weight-bold" style="color: rgba(255,255,255,0.9);">Painel Gestor</div>
        <div class="text-body1" style="color: rgba(255,255,255,0.45);">
          Selecione uma categoria para gerenciar
        </div>
      </div>

      <div class="column q-gutter-y-md">
        <router-link to="/freelas" class="text-decoration-none">
          <q-card class="feature-card card-base shadow-soft">
            <q-card-section class="row items-center no-wrap q-pa-lg">
              <q-avatar size="56px" color="primary" text-color="white" icon="groups" class="q-mr-lg" />
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
              <q-avatar size="56px" color="secondary" text-color="white" icon="event" class="q-mr-lg" />
              <div class="col">
                <div class="text-h6 text-weight-bold text-primary">Eventos</div>
                <div class="text-body2 text-grey-7">Organize e acompanhe eventos</div>
              </div>
              <q-icon name="chevron_right" size="28px" color="grey-5" />
            </q-card-section>
          </q-card>
        </router-link>

        <q-card class="feature-card card-base shadow-soft" style="opacity: 0.6; cursor: not-allowed;">
          <q-card-section class="row items-center no-wrap q-pa-lg">
            <q-avatar size="56px" color="accent" text-color="primary" icon="work_outline" class="q-mr-lg" />
            <div class="col">
              <div class="text-h6 text-weight-bold text-primary">Funções</div>
              <div class="text-body2 text-grey-7">Configure cargos e permissões</div>
            </div>
            <q-badge color="grey-5" label="Em breve" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}

.text-decoration-none {
  text-decoration: none;
}
</style>

