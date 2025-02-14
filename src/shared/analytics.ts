import {
  OpenAnalytics,
  OpenEventKeys,
  getClientInfo,
} from '@opensig/open-analytics';
import { reportAnalytics } from '@/api/api-analytics';
import { Router } from 'vue-router';
import { COOKIE_AGREED_STATUS, useCookieStore } from '@/stores/cookies';

export const oa = new OpenAnalytics({
  appKey: 'openEuler',
  request: (data) => {
    if (
      useCookieStore().getUserCookieStatus() !== COOKIE_AGREED_STATUS.ALL_AGREED
    ) {
      disableOA();
      return;
    }
    reportAnalytics(data);
  },
});

let routerGuards: (() => void)[];

export const enableOA = async (router: Router) => {
  if (oa.enabled) {
    return;
  }
  oa.setHeader(getClientInfo());
  oa.enableReporting(true);
  reportPerformance();
  await router.isReady();
  reportPV();
  (routerGuards ??= []).push(
    router.beforeEach((to, from) => {
      if (from.path === '/' || to.path === from.path) {
        return;
      }
      to.meta.$referrer = window.location.href;
    }),
    router.afterEach((to, from) => {
      if (to.path === from.path) {
        return;
      }
      reportPV(to.meta.$referrer as string);
    })
  );
};

export const disableOA = () => {
  oa.enableReporting(false);
  if (routerGuards) {
    routerGuards.forEach((item) => item());
    routerGuards = [];
  }
  [
    'oa-openEuler-client',
    'oa-openEuler-events',
    'oa-openEuler-session',
  ].forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const reportPV = ($referrer?: string) => {
  oaReport(OpenEventKeys.PV, $referrer ? { $referrer } : undefined);
};

export const reportPerformance = () => {
  oaReport(OpenEventKeys.LCP);
  oaReport(OpenEventKeys.INP);
  oaReport(OpenEventKeys.PageBasePerformance);
};

export const oaReport = <T extends Record<string, any>>(
  event: string,
  eventData?: T | ((...opt: any[]) => Promise<T> | T),
  $service = 'quickissue',
  options?: {
    immediate?: boolean;
    eventOptions?: any;
  }
) => {
  if (!oa.enabled) {
    return;
  }
  return oa.report(
    event,
    async (...opt) => ({
      $service,
      ...(typeof eventData === 'function'
        ? await eventData(...opt)
        : eventData),
    }),
    options
  );
};
