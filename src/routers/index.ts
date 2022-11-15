import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/zh/issues' },
  // zh
  {
    path: '/zh/issues',
    name: 'issues',
    component: () => import('@/views/TheQuickIssue.vue'),
  },
  {
    path: '/zh/pulls',
    name: 'pulls',
    component: () => import('@/views/pull-request/PullRequest.vue'),
  },
  {
    path: '/zh/new-issues',
    name: 'new-issues',
    component: () => import('@/views/submit-issue/SubmitIssue.vue'),
  },
  // en
  {
    path: '/en/',
    name: 'en',
    component: () => import('@/views/TheQuickIssue.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  // 设置语言
  const langStore = useLangStore();
  langStore.lang = to.fullPath.includes('en') ? 'en' : 'zh';
});
