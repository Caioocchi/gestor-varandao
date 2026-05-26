<template>
  <div class="q-py-md">
    <q-btn
      class="custom-btn shadow-robust"
      :label="props.label"
      :to="props.link"
      :icon="props.icon"
      unelevated
      color="primary"
      no-caps
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-btn {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
</style>

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
