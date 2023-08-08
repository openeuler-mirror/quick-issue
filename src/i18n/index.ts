import { createI18n } from 'vue-i18n';

import sig from './sig';

import common from './common';
import quickIssue from './quick-issue';

const messages = {
  zh: {
    common: common.zh,
    sig: sig.zh,
    quickIssue: quickIssue.zh,
  },
  en: {
    common: common.en,
    sig: sig.en,
    quickIssue: quickIssue.en,
  },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
  global: true,
});

export default i18n;
