import { getCookie } from '@/shared/utils';
import { defineStore } from 'pinia';

export const COOKIE_AGREED_STATUS = {
  NOT_SIGNED: '0', // 未签署
  ALL_AGREED: '1', // 同意所有cookie
  NECCESSARY_AGREED: '2', // 仅同意必要cookie
};

export const COOKIE_KEY = 'agreed-cookiepolicy';

export const useCookieStore = defineStore('cookie', {
  state: () => ({
    status: COOKIE_AGREED_STATUS.NOT_SIGNED,
    version: '20240830',
  }),
  getters: {
    isAllAgreed(state) {
      return state.status === COOKIE_AGREED_STATUS.ALL_AGREED;
    },
  },
  actions: {
    getUserCookieStatus() {
      const cookieVal = getCookie(COOKIE_KEY) ?? '0';
      const cookieStatusVal = cookieVal[0];
      const privacyVersionVal = cookieVal.slice(1);
      if (privacyVersionVal !== this.version) {
        this.status = COOKIE_AGREED_STATUS.NOT_SIGNED;
        return COOKIE_AGREED_STATUS.NOT_SIGNED;
      }

      if (cookieStatusVal === COOKIE_AGREED_STATUS.ALL_AGREED) {
        this.status = COOKIE_AGREED_STATUS.ALL_AGREED;
        return COOKIE_AGREED_STATUS.ALL_AGREED;
      } else if (cookieStatusVal === COOKIE_AGREED_STATUS.NECCESSARY_AGREED) {
        this.status = COOKIE_AGREED_STATUS.NECCESSARY_AGREED;
        return COOKIE_AGREED_STATUS.NECCESSARY_AGREED;
      } else {
        this.status = COOKIE_AGREED_STATUS.NOT_SIGNED;
        return COOKIE_AGREED_STATUS.NOT_SIGNED;
      }
    },
  },
});
