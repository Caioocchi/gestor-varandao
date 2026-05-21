<template>
  <div class="q-py-md">
    <q-btn
      class="shadow-10"
      :label="props.label"
      :to="props.link"
      :icon="props.icon"
      type="submit"
      color="blue-grey-10"
      style="width: 100%; height: 56px"
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
