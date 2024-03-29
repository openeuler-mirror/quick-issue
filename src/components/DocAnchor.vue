<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import _ from 'lodash-es';
import { useLangStore } from '@/stores';

const props = defineProps({
  className: {
    type: String,
    default: 'h2',
  },
});
const lang = computed(() => {
  return useLangStore().lang;
});
const route = useRoute();

const activeIndex = ref(0);
const anchorList = ref();

const debounceEvent = _.throttle(goAnchor, 300, {
  trailing: true,
});

function goAnchor() {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop;
  anchorList.value = document.querySelectorAll(props.className);

  const topArr: number[] = [];
  anchorList.value = Array.from(anchorList.value).filter((item: any) => {
    return item.className !== 'for-seo'
      ? topArr.push(item.offsetTop + item.clientHeight)
      : '';
  });
  for (let i = 0; i < topArr.length; i++) {
    if (scrollTop - 100 <= topArr[i]) {
      activeIndex.value = i;
      break;
    }
  }
}

onMounted(() => {
  goAnchor();
  window.addEventListener('scroll', debounceEvent);
});
onUnmounted(() => {
  window.removeEventListener('scroll', debounceEvent);
});
watch(
  () => {
    return route.path;
  },
  () => {
    nextTick(() => {
      goAnchor();
    });
  }
);
</script>
<template>
  <div class="md-anchor" :class="lang === 'en' ? 'en-anchor' : ''">
    <a
      v-for="(item, index) in anchorList"
      :key="item.id"
      :href="`#${item.id}`"
      :class="{ 'active-link': index === activeIndex }"
      class="anchor-link"
    >
      <div class="anchor-link-inner">
        {{
          item.id.split('-').splice(1, item.id.split('-').length).join('-') ||
          item.id
        }}
      </div>
    </a>
  </div>
</template>

<style lang="scss">
.md-anchor {
  position: fixed;
  top: 142px;
  left: calc((100vw - 1416px) / 2 - 110px);
  width: 100px;
  z-index: 999;
  @media screen and (max-width: 1620px) {
    left: 16px;
    width: 40px;
  }
  &::after {
    position: absolute;
    content: '';
    width: 1px;
    height: 100%;
    left: 0;
    bottom: -50%;
    background-color: #2e2e2e;
    z-index: 0;
  }
  @media screen and (max-width: 1100px) {
    display: none;
  }
  .anchor-link {
    position: relative;
    cursor: pointer;
    display: block !important;
    color: var(--o-color-white);
    line-height: var(--o-line-height-text);
    font-size: var(--o-font-size-text);
    border-left: 1px solid #2e2e2e;
    z-index: 1;
    &:hover {
      color: var(--o-color-brand2);
    }
    &-inner {
      padding: 8px var(--o-spacing-h6);
    }
  }
  .active-link {
    color: var(--o-color-brand2);
    border-left: 1px solid var(--o-color-brand2);
  }
}
.en-anchor {
  width: 130px;
  left: calc((100vw - 1416px) / 2 - 130px);
  @media screen and (max-width: 1620px) {
    left: 16px;
    width: 20px;
    .anchor-link {
      writing-mode: vertical-rl;
    }
  }
}
</style>
