<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useLangStore } from '@/stores';

const lang = computed(() => {
  return useLangStore().lang;
});
const editRef = ref();
const editLang = ref('zh-CN');

const toolbars = {
  preview: true, // 预览
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
};

watch(
  () => lang.value,
  (val) => {
    editLang.value = val === 'zh' ? 'zh-CN' : 'en';
  },
  { immediate: true }
);

defineExpose({
  editRef,
});
</script>

<template>
  <mavon-editor
    class="mavon-editor"
    ref="editRef"
    placeholder=""
    :xssOptions="{}"
    :language="editLang"
    :box-shadow="false"
    :toolbars="toolbars"
    :right-toolbar="''"
    :disabled-menus="[]"
    height="400px"
  />
</template>

<style lang="scss" scoped>
.mavon-editor {
  width: 100%;
  box-shadow: none;
  border-radius: 0;
  border: 1px solid var(--o-color-border2);
  :deep(.add-image-link) {
    .op-btn.sure {
      background-color: var(--o-color-brand1) !important;
    }
    .op-btn.cancel {
      color: var(--o-color-brand1);
      border: 1px solid var(--o-color-brand1);
      &:hover {
        color: var(--o-color-brand1);
      }
    }
    .input-wrapper {
      border: 1px solid #000;
    }
  }
}
</style>
