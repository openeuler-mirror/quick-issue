import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';

import '@/shared/styles/index.scss';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';

import App from './App.vue';
import OpenDesign from 'opendesign';
import { enableOA, reportPerformance } from './shared/analytics';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);
app.use(VueMarkdownEditor);

enableOA();
reportPerformance();

app.mount('#app');
