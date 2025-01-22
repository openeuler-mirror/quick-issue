import {
  OpenAnalytics,
  OpenEventKeys,
  getClientInfo,
} from '@opensig/open-analytics';
import { reportAnalytics } from '@/api/api-analytics';

export const oa = new OpenAnalytics({
  appKey: 'openEuler',
  request: (data) => {
    reportAnalytics(data);
  },
});

export const enableOA = () => {
  oa.setHeader(getClientInfo());
  oa.enableReporting(true);
};

export const disableOA = () => {
  oa.enableReporting(false);
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
