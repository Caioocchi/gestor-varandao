<template>
  <q-page class="flex flex-center q-pa-lg">
    <div class="full-width" style="max-width: 500px">
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary q-mb-xs">Painel Gestor</div>
        <div class="text-subtitle1 text-grey-7 border-bottom-accent q-pb-md">
          Selecione uma categoria para gerenciar
        </div>
      </div>

      <div class="column q-gutter-y-sm">
        <ButtonComponent label="Freelas" link="/freelas" icon="groups" />
        <ButtonComponent label="Eventos" icon="event" />
        <ButtonComponent label="Funções" icon="work_outline" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ButtonComponent from 'src/components/ButtonComponent.vue';
</script>

<style lang="scss" scoped>
.border-bottom-accent {
  border-bottom: 2px solid $accent;
  display: inline-block;
}
</style>
