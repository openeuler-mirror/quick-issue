<script lang="ts" setup>
import { watch, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  navItems: {
    type: Object,
    default() {
      return [];
    },
  },
  lang: {
    type: String,
    default() {
      return 'zh';
    },
  },
});

const { navItems } = toRefs(props);
const activeItem = ref(route.path);

const navClick = (path: string, windowOpen: boolean) => {
  windowOpen ? window.open(path) : router.push(path);
};
watch(
  () => {
    return route.path;
  },
  (path) => {
    activeItem.value = path;
  }
);
</script>

<template>
  <div class="nav-list">
    <div
      v-for="item in navItems"
      :key="item.id"
      :class="[activeItem === item.link ? 'active' : '']"
      class="nav-item"
      @click="navClick(item.link, item.windowOpen)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<style lang="scss">
$color: #ffffff;
.nav-list {
  display: flex;
  width: 100%;
  padding: 0 48px;
  height: 100%;
  .nav-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
    margin: 0 24px;
    font-size: 16px;
    line-height: 24px;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #979797;
    cursor: pointer;

    &.active {
      color: $color !important;
    }

    &:hover {
      color: $color;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 2px;
      background: transparent;
      border-radius: 1px;
      transition: background 0.3s;
    }

    &.active::after {
      background: #ffffff;
    }
  }
}
</style>
