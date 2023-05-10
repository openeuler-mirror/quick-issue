<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLangStore } from '@/stores';

import { useLabelColor } from '@/stores/index';
import { getLabelColors } from '@/api/api-quick-issue';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import { refreshInfo } from '@/shared/login';

refreshInfo();
const { locale } = useI18n();
const langStore = useLangStore();
const labelColor = useLabelColor();
onMounted(async () => {
  await getLabelColors().then((res) => {
    labelColor.setLabelColor(res?.data);
  });
});
watch(
  () => langStore.lang,
  (val) => {
    locale.value = val;
  }
);
</script>

<template>
  <header><AppHeader /></header>
  <main><RouterView></RouterView></main>
  <footer><AppFooter /></footer>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: url(@/assets/category/quick-issue/quick-bg.png);
  background-position: center top;
  background-size: 100% auto;
  background-repeat: repeat;
  background-color: rgb(1, 10, 51);
}

main {
  position: relative;
  min-height: calc(100vh - 339px);
  overflow: hidden;

  @media (max-width: 1100px) {
    margin-top: 48px;
  }
}
</style>
