<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();

const modalClassNames = computed(() => {
  return attrs['modal-class']
    ? `${attrs['modal-class']} o-dialog-modal`
    : 'o-dialog-modal';
});
</script>

<template>
  <ElDialog
    v-bind="attrs"
    class="o-dialog"
    append-to-body
    :modal-class="modalClassNames || ''"
  >
    <template #header>
      <slot name="header"></slot>
    </template>

    <slot></slot>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="scss">
// .o-dialog {
//   max-width: 1420px;
//   width: 100%;
// }
</style>
