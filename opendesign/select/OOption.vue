<script lang="ts" setup>
</script>
<template>
  <ElOption class="o-option">
    <slot> </slot>
  </ElOption>
</template>

<style lang="scss">
.el-popper__arrow {
  display: none;
}
.el-popper.o-select-dropdown {
  border: none;
  border-radius: 0 !important;
  background-color: var(--o-color-bg2);
  .o-option.hover {
    background-color: var(--o-color-bg4);
  }
  .o-option:hover {
    background-color: var(--o-color-bg4);
  }
}
</style>
