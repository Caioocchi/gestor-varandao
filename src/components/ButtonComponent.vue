<template>
  <div class="q-py-md">
    <q-btn
      class="btn-primary shadow-soft"
      :label="props.label"
      :to="props.link"
      :icon="props.icon"
      unelevated
      color="primary"
      no-caps
    />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    link: String,
    icon: String,
  },
  setup(props) {
    return {
      props,
    };
  },
};
</script>

<style lang="scss" scoped>
// Component uses global .btn-primary from app.scss
</style>
