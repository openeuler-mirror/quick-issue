<script setup lang="ts">
import { useAttrs, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { throttle } from 'lodash-es';

const attrs = useAttrs();
const props = defineProps({
  listenerScorll: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['scorll-bottom']);

const debounceEvent = throttle(
  function () {
    if (!optionDom) {
      return false;
    }
    const isBottom =
      optionDom.clientHeight / (optionDom.scrollHeight - optionDom.scrollTop) >=
      0.6;
    if (isBottom) {
      emit('scorll-bottom');
    }
  },
  300,
  {
    trailing: true,
  }
);

const classNames = computed(() => {
  return `${attrs['custom-class']} o-select-dropdown`;
});

let optionDom: null | HTMLElement = null;

// 移动端 输入框无法弹出
function cancalReadOnly(onOff: boolean) {
  nextTick(() => {
    if (!onOff) {
      const input = document.querySelector('.el-input__inner');
      if (input) {
        input.removeAttribute('readonly');
      }
    }
  });
}
function scrollEvent(val: boolean) {
  cancalReadOnly(val);
  if (val && props.listenerScorll) {
    nextTick(() => {
      optionDom = document.querySelector(
        '.el-select__popper[aria-hidden="false"] .el-select-dropdown .el-select-dropdown__wrap'
      );
      if (optionDom) {
        optionDom.addEventListener('scroll', debounceEvent);
      }
    });
  }
}
onMounted(() => {
  cancalReadOnly(false);
});
onUnmounted(() => {
  if (optionDom) {
    optionDom.removeEventListener('scroll', debounceEvent);
  }
});
</script>

<template>
  <ElSelect
    class="o-select"
    :popper-class="classNames"
    v-bind="attrs"
    @visible-change="scrollEvent"
  >
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot> </slot>
  </ElSelect>
</template>

<style lang="scss">
.o-select {
  --o-select-font-tip: var(--o-font-size-tip);
  --o-select-font-text: var(--o-color-text4);
  --o-select-color-bg: var(--o-color-bg2);
  --o-select-shadow: var(--o-shadow-l1);
  --o-select-shadow_hover: var(--o-shadow-l2);
  --o-el-tag-color: var(--o-color-text4);
  --o-el-tag-bg-color: var(--o-color-bg-secondary);
  border: none;
  --el-select-border-color-hover: transparent !important;
  &:hover {
    box-shadow: var(--o-select-shadow_hover);
  }
  .el-select__tags {
    .el-tag {
      border-radius: 0;
      background-color: var(--o-el-tag-bg-color);
      .el-tag__content {
        --el-tag-text-color: var(--o-el-tag-color);
      }
      .el-tag__close {
        color: var(--o-color-text1);
      }
    }
  }

  .el-input__wrapper {
    background-color: var(--o-select-color-bg);
    border-radius: 0;
    box-shadow: var(--o-select-shadow);
    &:hover {
      border: none;
    }
  }
  .el-input__prefix-inner {
    // font-size: var(--o-select-font-tip);
    .o-icon {
      display: flex;
      align-items: center;
    }
  }
  .el-input__suffix {
    height: 40px;
    .el-icon {
      svg {
        color: var(--o-select-font-text);
      }
    }
  }
  @media screen and (max-width: 867px) {
    .el-input {
      height: 34px;
      .el-input__wrapper {
        padding: var(--o-spacing-h8);
        .el-input__inner {
          font-size: var(--o-select-font-tip);
        }
      }
      .el-input__suffix {
        height: 34px;
      }
    }
  }
}
.el-popper.el-select__popper {
  border-radius: 0;
}
.el-scrollbar {
  .el-select-dropdown__wrap {
    .search-box {
      position: sticky;
      top: 5px;
      margin-bottom: 0;
      padding-bottom: 5px;
      background-color: var(--o-color-bg2);
      z-index: 1;
      .o-search {
        width: 100%;
        height: 34px;
        // margin: var(--o-spacing-h10) var(--o-spacing-h5);
        .el-input__wrapper {
          box-shadow: 0 0 0 1px var(--o-color-border1) inset;
          &:hover {
            box-shadow: 0 0 0 1px var(--o-color-border1) inset;
          }
          .el-input__prefix-inner {
            font-size: 18px;
          }
        }
      }
      &::before {
        position: absolute;
        content: '';
        height: 5px;
        width: 100%;
        top: -5px;
        background-color: var(--o-color-bg2);
      }
    }
  }
}
</style>
