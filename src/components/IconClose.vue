<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  size?: string | number;
}>();

const iconSize = computed(() => {
  if (typeof props.size === 'string' && /^\d+px$/.test(props.size)) {
    return props.size;
  }
  if (typeof props.size === 'number') {
    return `${props.size}px`;
  }
  return '20px';
});
</script>

<template>
  <svg
    class="close-icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      d="M18.528 5.472c0.246 0.246 0.271 0.63 0.074 0.903l-0.074 0.087-5.54 5.538 0.006 0.006-0.989 0.989-0.006-0.006-5.538 5.54c-0.273 0.273-0.717 0.273-0.99 0-0.246-0.246-0.271-0.63-0.074-0.903l0.074-0.087 5.538-5.539-5.538-5.538-0.074-0.087c-0.197-0.274-0.172-0.657 0.074-0.903s0.63-0.271 0.903-0.074l0.087 0.074 5.538 5.539 5.539-5.539c0.273-0.273 0.717-0.273 0.99 0zM14.551 13.561l3.978 3.978 0.074 0.087c0.197 0.274 0.172 0.657-0.074 0.903s-0.63 0.271-0.903 0.074l-0.087-0.074-3.978-3.978c-0.273-0.273-0.273-0.717 0-0.99v0c0.273-0.273 0.717-0.273 0.99 0z"
    ></path>
  </svg>
</template>

<style scoped lang="scss">
.close-icon {
  width: v-bind('iconSize');
  height: v-bind('iconSize');
  transition: all 0.25s cubic-bezier(0, 0, 0, 1);
  fill: currentColor;
  cursor: pointer;

  &:hover {
    transform: rotate(180deg);
    color: var(--o-color-kleinblue7);
  }
}
</style>
