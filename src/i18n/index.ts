import { createI18n } from 'vue-i18n';

import sig from './sig';

import common from './common';
import quickIssue from './quick-issue';
import cookie from './cookie';
import feedback from './feedback';

const messages = {
  zh: {
    common: common.zh,
    sig: sig.zh,
    quickIssue: quickIssue.zh,
    cookie: cookie.zh,
    feedback: feedback.zh,
  },
  en: {
    common: common.en,
    sig: sig.en,
    quickIssue: quickIssue.en,
    cookie: cookie.en,
    feedback: feedback.en,
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
