import { createI18n } from 'vue-i18n';

import zh from './lang/zh';
import en from './lang/en';
import sig from './sig';

import common from './common';
import quickIssue from './quick-issue';

const messages = {
  zh: {
    ...zh,
    common: common.zh,
    sig: sig.zh,
    quickIssue: quickIssue.zh,
  },
  en: {
    ...en,
  },
};

const i18n = createI18n({
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
