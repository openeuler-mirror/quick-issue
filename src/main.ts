import { createApp } from 'vue';
import { createPinia } from 'pinia';

import mavonEditor from 'mavon-editor';

import { router } from './routers';
import i18n from './i18n';

import '@/shared/styles/index.scss';

import 'mavon-editor/dist/css/index.css';

import App from './App.vue';
import OpenDesign from 'opendesign';

const app = createApp(App);

app.use(mavonEditor);
app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);

app.mount('#app');
