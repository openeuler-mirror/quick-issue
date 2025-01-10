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
  oa.report(OpenEventKeys.PV, $referrer ? () => ({ $referrer }) : undefined);
};

export const reportPerformance = () => {
  oa.report(OpenEventKeys.LCP);
  oa.report(OpenEventKeys.INP);
  oa.report(OpenEventKeys.PageBasePerformance);
};

export const oaReport = async <T extends Record<string, any>>(
  event: string,
  eventData?: T | ((...opt: any[]) => Promise<T> | T),
  $service = 'quickissue',
  options?: {
    immediate?: boolean;
    eventOptions?: any;
  }
) => {
  let data: T | undefined;
  if (eventData) {
    data =
      typeof eventData === 'function'
        ? await (eventData as (...opt: any[]) => Promise<T> | T)()
        : eventData;
  }
  await oa.report(
    event,
    () => ({
      $service,
      ...data,
    }),
    options
  );
};
