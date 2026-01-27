<script setup lang="ts">
import { watch, onMounted, ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLangStore } from '@/stores';

import { useLabelColor } from '@/stores/index';
import { getLabelColors } from '@/api/api-quick-issue';

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

import { refreshInfo } from '@/shared/login';
import FloatingButton from '@/components/FloatingButton.vue';
import { OPlusConfigProvider } from '@opendesign-plus/components';
import { OElCookieNotice } from '@opendesign-plus/components/element-plus';
import { useRoute } from 'vue-router';

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

const cookieNoticeVisible = ref(false);
const MAIN_URL = import.meta.env.VITE_MAIN_DOMAIN_URL;
const cookieRef = ref();
const route = useRoute();
watch(
  () => route.path,
  async () => {
    await nextTick();
    cookieRef.value?.check();
  }
);
</script>

<template>
  <header><AppHeader /></header>
  <main><RouterView></RouterView></main>
  <OPlusConfigProvider :locale="langStore.lang">
    <OElCookieNotice ref="cookieRef" v-model:visible="cookieNoticeVisible" community="openEuler" :detail-url="`${MAIN_URL}/${langStore.lang}/other/cookies/`" />
  </OPlusConfigProvider>
  <footer><AppFooter /></footer>
  <FloatingButton />
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
  --layout-content-max-width: 1544px;
  --layout-content-padding: 64px;
  --layout-header-height: 80px;
  
  @include respond-to('<=laptop') {
    --layout-content-max-width: 100%;
    --layout-content-padding: 40px;
  }
  
  @include respond-to('<=pad') {
    --layout-content-padding: 32px;
  }
  
  @include respond-to('phone') {
    --layout-content-padding: 24px;
  }
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
