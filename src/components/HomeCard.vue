<template>
  <div v-if="disabled" class="block full-height cursor-not-allowed disabled-wrapper">
    <q-card class="feature-card card-base shadow-soft full-height disabled-card">
      <q-card-section class="column items-center justify-center text-center q-pa-md full-height">
        <q-avatar
          size="44px"
          color="grey-4"
          text-color="grey-7"
          :icon="icon"
          class="q-mb-sm"
        />
        <div class="text-subtitle2 text-weight-bold text-grey-5 title-line-clamp">
          {{ title }}
        </div>
      </q-card-section>
    </q-card>
  </div>
  <router-link v-else :to="route" class="text-decoration-none block full-height">
    <q-card class="feature-card card-base shadow-soft full-height">
      <q-card-section class="column items-center justify-center text-center q-pa-md full-height">
        <q-avatar
          size="44px"
          :color="iconColor"
          :text-color="textColor"
          :icon="icon"
          class="q-mb-sm"
        />
        <div class="text-subtitle2 text-weight-bold text-primary title-line-clamp">
          {{ title }}
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  route: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
  },
  textColor: {
    type: String,
    default: 'white',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.block {
  display: block;
}
.full-height {
  height: 100%;
}
.title-line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
  font-size: 0.9rem;
}
.disabled-wrapper {
  opacity: 0.55;
}
.disabled-card {
  pointer-events: none;
  filter: grayscale(1);
}
</style>
