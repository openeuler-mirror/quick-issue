import type { App } from 'vue';
import Select from './OSelect.vue';
Select.install = function (app: App) {
  app.component('OSelect', Select);
};


export { Select };
