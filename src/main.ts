import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';

import '@/shared/styles/index.scss';
import '@/shared/styles/theme-default.scss'
import '@opensig/opendesign/es/index.css';
import '@opendesign-plus/components/styles';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';

import App from './App.vue';
import OpenDesign from 'opendesign';

import { initOpenDesignAnalytics } from '@opendesign-plus/plugins/analytics';
import { reportAnalytics } from './api/api-analytics';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);
app.use(VueMarkdownEditor);
app.use(initOpenDesignAnalytics, {
  appKey: 'openEuler',
  service: 'quickissue',
  request(data) {
    reportAnalytics(data);
  },
  isCookieAgreed() {
    return i18n.global.locale.value === 'zh' ? true : document.cookie.includes('agreed-cookiepolicy-en=1');
  },
});

app.mount('#app');
