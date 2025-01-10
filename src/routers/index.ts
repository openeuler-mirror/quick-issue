import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore, usePrevPageUrl } from '@/stores';
import { reportPV } from '@/shared/analytics';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/issues' },
  { path: '/zh/', redirect: '/zh/issues' },
  { path: '/en/', redirect: '/en/issues' },
  {
    path: '/zh/issues',
    name: 'issues',
    alias: '/en/issues',
    component: () => import('@/views/TheQuickIssue.vue'),
  },
  {
    path: '/zh/pulls',
    name: 'pulls',
    alias: '/en/pulls',
    component: () => import('@/views/pull-request/PullRequest.vue'),
  },
  {
    path: '/zh/new-issues',
    name: 'new-issues',
    alias: '/en/new-issues',
    component: () => import('@/views/submit-issue/SubmitIssue.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from) => {
  // 设置语言
  const langStore = useLangStore();
  const lang = to.fullPath.includes('en') ? 'en' : 'zh';
  langStore.lang = lang;

  if (from.path === '/') {
    return;
  }
  usePrevPageUrl().url = window.location.href;
});

router.afterEach((to, from) => {
  if (to.path !== from.path) {
    reportPV(usePrevPageUrl().url);
  }
});
