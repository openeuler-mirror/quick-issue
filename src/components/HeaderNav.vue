<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { debounce } from 'lodash-es';

defineProps({
  navItems: {
    type: Object,
    default() {
      return {};
    },
  },
});

interface NavItem {
  NAME: string;
  PATH: string;
  ID: string;
  IS_OPEN_WINDOW?: number;
  IS_OPEN_MINISITE_WINDOW?: string;
  CHILDREN?: NavItem;
}

const router = useRouter();
const route = useRoute();
const lang = ref('zh');
const activeItem = ref(route.path);

watch(
  () => route.path,
  (val: string) => {
    activeItem.value = val;
  }
);
// 点击子导航事件
const goPath = (item: NavItem) => {
  if (item.IS_OPEN_MINISITE_WINDOW) {
    window.open(item.PATH);
    return;
  }

  if (item.PATH) {
    router.push('/' + lang.value + item.PATH);
    navActive.value = '';
  }
  isShow.value = false;
};

// nav 鼠标滑过事件
const isShow = ref(true);
const navActive = ref('');
const toggleSubDebounced = debounce(
  (item: NavItem | null) => {
    if (item === null) {
      navActive.value = '';
    } else {
      navActive.value = item.ID;
      isShow.value = true;
    }
  },
  100,
  {
    trailing: true,
  }
);
// nav 点击事件
const navItemClick = (item: NavItem) => {
  navActive.value = item.ID;
  isShow.value = true;
};
// nav 默认选中
const menuActiveFn = (item: any) => {
  return item.CLASS.some((el: string) =>
    item.ID === 'download'
      ? activeItem.value.includes(`/${lang.value}/${el}`)
      : activeItem.value.includes(el)
  );
};
</script>

<template>
  <nav class="o-nav">
    <ul class="o-nav-list" :class="{ 'lang-en': lang == 'en' }">
      <li
        v-for="item in navItems"
        :key="item.ID"
        :class="{
          active: menuActiveFn(item),
          hover: navActive === item.ID,
        }"
        @mouseenter="toggleSubDebounced(item)"
        @mouseleave="toggleSubDebounced(null)"
      >
        <span class="text" @click="navItemClick(item)">{{ item.NAME }} </span>

        <div v-if="isShow" class="sub-menu">
          <ul class="sub-menu-content">
            <li
              v-for="(subItem, subItemIndex) in item.CHILDREN"
              :key="subItemIndex"
              class="sub-menu-item"
              @click="goPath(subItem)"
            >
              {{ subItem.NAME }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@media (max-width: 1366px) {
  html[lang='ru'] .o-nav .o-nav-list > li {
    padding: 0 var(--o-spacing-h6);
    &::after {
      left: var(--o-spacing-h6);
      width: calc(100% - var(--o-spacing-h6) * 2);
    }
  }
  html[lang='en'] .o-nav .o-nav-list > li {
    padding: 0 var(--o-spacing-h5);
    &::after {
      left: var(--o-spacing-h5);
      width: calc(100% - var(--o-spacing-h5) * 2);
    }
  }
}
.o-nav {
  height: 100%;
  position: relative;
  .o-nav-list {
    height: 100%;
    padding: 0;
    margin: 0;
    > li {
      position: relative;
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 var(--o-spacing-h4);
      font-size: var(--o-font-size-text);
      line-height: var(--o-line-height-h8);
      color: var(--o-color-text1);
      cursor: pointer;

      &.active {
        color: var(--o-color-brand1);
        &::after {
          background: var(--o-color-brand1);
        }
      }
      &.hover {
        color: var(--o-color-brand1);
        .sub-menu {
          transform: translate(-50%) scaleY(1);
        }
        &::after {
          background: var(--o-color-brand1);
        }
      }

      &::after {
        content: '';
        position: absolute;
        left: var(--o-spacing-h4);
        bottom: 0;
        width: calc(100% - var(--o-spacing-h4) * 2);
        height: 2px;
        border-radius: 1px;
        transition: all 0.1s linear;
      }

      .sub-menu {
        position: absolute;
        top: 80px;
        left: 50%;
        right: 0;
        background-color: var(--o-color-bg2);
        transform: translate(-50%) scaleY(0);
        transform-origin: top;
        transition: all 0.3s ease-in-out;
        display: table;
        z-index: 99;
        box-shadow: var(--o-shadow-l1);
        &-content {
          margin: 0;
          padding: 0;
        }
        &-item {
          line-height: var(--o-line-height-h3);
          text-align: center;
          font-size: var(--o-font-size-text);
          color: var(--o-color-text1);
          display: block;
          white-space: nowrap;
          padding: 0 var(--o-spacing-h8);
          min-width: 106px;
          &.active {
            background-color: var(--o-color-brand1);
            color: var(--o-color-text2);
          }
          &:hover {
            background-color: var(--o-color-brand1);
            color: var(--o-color-text2);
          }
        }
      }
    }
  }
  &-line {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px;
    height: 2px;
    transition: all 0.3s ease-in-out;
    display: block;
    z-index: 9;
    background: var(--o-color-brand1);
  }
}
</style>
