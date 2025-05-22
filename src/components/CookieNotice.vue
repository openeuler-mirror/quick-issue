<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue';
import { setCookie, removeCookie } from '@/shared/utils';
import {
  useCookieStore,
  COOKIE_AGREED_STATUS,
  COOKIE_KEY,
} from '@/stores/cookies';
import { useScreen } from './hooks/useScreen';
import { useI18n } from 'vue-i18n';

// import IconClose from '~icons/app/icon-close.svg';

import { useRoute, useRouter } from 'vue-router';
import { enableOA, removeHM } from '@/shared/analytics';
import { disableOA } from '@/shared/analytics';
import IconClose from './IconClose.vue';

const { lePadV } = useScreen();
const { t: $t, locale } = useI18n();
const isZh = computed(() => locale.value === 'zh');
const aboutCookiesUrl = computed(
  () => `${import.meta.env.VITE_MAIN_DOMAIN_URL}/${locale.value}/other/cookies/`
);

const cookieStore = useCookieStore();
const router = useRouter();
const route = useRoute();

const COOKIE_DOMAIN = import.meta.env.VITE_COOKIE_DOMAIN;

// 是否允许分析cookie
const analysisAllowed = ref(false);

// cookie提示是否显示
const isNoticeVisible = ref(false);

// 显示/隐藏cookie提示
const toggleNoticeVisible = (val: boolean) => {
  if (typeof val === 'boolean') {
    isNoticeVisible.value = val;
  } else {
    isNoticeVisible.value = !isNoticeVisible.value;
  }
};

// 弹出框是否显示
const isDlgVisible = ref(false);

// 显示/隐藏弹出框
const toggleDlgVisible = (val: boolean) => {
  if (typeof val === 'boolean') {
    isDlgVisible.value = val;
  } else {
    isDlgVisible.value = !isNoticeVisible.value;
  }
};

// 是否未签署
const isNotSigned = () => {
  return cookieStore.getUserCookieStatus() === COOKIE_AGREED_STATUS.NOT_SIGNED;
};

// 是否全部同意
const isAllAgreed = () => {
  return cookieStore.getUserCookieStatus() === COOKIE_AGREED_STATUS.ALL_AGREED;
};

onMounted(() => {
  // 未签署，展示cookie notice
  if (isNotSigned()) {
    toggleNoticeVisible(true);
  }

  if (cookieStore.isAllAgreed) {
    analysisAllowed.value = true;
    enableOA(router);
  } else {
    disableOA();
    removeHM();
  }
});

// 用户同意所有cookie
const acceptAll = () => {
  analysisAllowed.value = true;
  cookieStore.status = COOKIE_AGREED_STATUS.ALL_AGREED;
  removeCookie(COOKIE_KEY);
  setCookie(
    COOKIE_KEY,
    COOKIE_AGREED_STATUS.ALL_AGREED,
    180,
    COOKIE_DOMAIN
  );
  toggleNoticeVisible(false);
  enableOA(router);
};

// 用户拒绝所有cookie，即仅同意必要cookie
const rejectAll = () => {
  analysisAllowed.value = false;
  cookieStore.status = COOKIE_AGREED_STATUS.NECCESSARY_AGREED;
  removeCookie(COOKIE_KEY);
  setCookie(
    COOKIE_KEY,
    COOKIE_AGREED_STATUS.NECCESSARY_AGREED,
    180,
    COOKIE_DOMAIN
  );
  toggleNoticeVisible(false);
  disableOA();
  removeHM();
};

const handleSave = () => {
  if (analysisAllowed.value) {
    acceptAll();
  } else {
    rejectAll();
  }

  toggleDlgVisible(false);
};

const handleAllowAll = () => {
  analysisAllowed.value = true;
  acceptAll();
  toggleDlgVisible(false);
};

const onDlgChange = () => {
  if (!isAllAgreed()) {
    setTimeout(() => {
      analysisAllowed.value = false;
    }, 800);
  }
  toggleDlgVisible(false);
};

watch(
  () => route.path,
  () => {
    if (isNotSigned()) {
      toggleNoticeVisible(true);
    }
  }
);
</script>

<template>
  <div v-if="isNoticeVisible" class="cookie-notice">
    <div class="cookie-notice-content">
      <div class="cookie-notice-wrap">
        <div class="cookie-notice-left">
          <p class="cookie-title">{{ $t('cookie.title') }}</p>
          <p class="cookie-desc">
            {{ $t('cookie.desc') }}
            <a
              :href="aboutCookiesUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('cookie.link') }} </a
            >{{ isZh ? '。' : '.' }}
          </p>
        </div>
        <div class="cookie-notice-right">
          <OButton type="outline" size="mini" @click="acceptAll">{{
            $t('cookie.acceptAll')
          }}</OButton>
          <OButton type="outline" size="mini" @click="rejectAll">{{
            $t('cookie.rejectAll')
          }}</OButton>
          <OButton type="outline" size="mini" @click="toggleDlgVisible(true)">
            {{ $t('cookie.manage') }}
          </OButton>
        </div>

        <IconClose
          class="cookie-notice-close"
          @click="toggleNoticeVisible(false)"
        />
      </div>
    </div>
    <ElDialog
      :show-close="false"
      v-model="isDlgVisible"
      :width="lePadV ? '90%' : '50%'"
      :title="$t('cookie.manage')"
      destroy-on-close
      :before-close="onDlgChange"
    >
      <template #header="{ close, titleId, titleClass }">
        <span :id="titleId" :class="titleClass">{{ $t('cookie.manage') }}</span>
        <IconClose @click="close" style="position: absolute; top: 8px; right: 8px" />
      </template>
      <div class="cookie-dlg-content">
        <div class="content-item">
          <div class="item-header">
            <span class="item-title">{{ $t('cookie.necessaryCookie') }}</span>
            <span class="item-extra">{{
              $t('cookie.necessaryCookieTip')
            }}</span>
          </div>
          <div class="item-detail">
            {{ $t('cookie.necessaryCookieDetail') }}
          </div>
        </div>
        <div class="content-item">
          <div class="item-header">
            <span class="item-title">{{ $t('cookie.analyticalCookie') }}</span>
            <span class="item-extra">
              <ElSwitch v-model="analysisAllowed"></ElSwitch>
            </span>
          </div>
          <div class="item-detail">
            {{ $t('cookie.analyticalCookieDetail') }}
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <OButton type="outline" size="mini" @click="handleSave">{{
            $t('cookie.saveSetting')
          }}</OButton>
          <OButton type="outline" size="mini" @click="handleAllowAll">
            {{ $t('cookie.acceptAll') }}
          </OButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.cookie-notice {
  position: fixed;
  bottom: 0;
  z-index: 999;
  width: 100%;
  .o-button {
    --e-button-font-size-mini: 14px;
  }
  .o-button + .o-button {
    margin-left: 16px;

    @media (max-width: 840px) {
      margin-left: 0;
      margin-top: 12px;
    }
  }
}

.cookie-notice-content {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  box-shadow: var(--e-shadow-l1);
}
.dark .cookie-notice-content {
  background-color: rgba(0, 0, 0, 0.9);
}

.cookie-notice-wrap {
  padding: 24px 44px;
  max-width: 1504px;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 0 auto;
  @media (max-width: 840px) {
    padding-top: 16px;
    padding-bottom: 16px;
    flex-direction: column;
    align-items: center;
  }
}

.cookie-notice-left {
  width: 60%;

  @media (max-width: 1100px) {
    width: 58%;
  }

  @media (max-width: 840px) {
    width: 100%;
  }

  .cookie-title {
    font-size: 16px;
    line-height: 28px;
    color: var(--e-color-text1);
    font-weight: 500;
    @media (max-width: 840px) {
      font-size: 16px;
      line-height: 24px;
      text-align: center;
    }
  }

  .cookie-desc {
    font-size: 12px;
    line-height: 18px;
    color: var(--e-color-text3);
    margin-top: 8px;
  }
}

.cookie-notice-right {
  display: flex;
  align-items: center;
  margin-top: 12px;

  @media (max-width: 840px) {
    width: 100%;
  }

  @media (max-width: 840px) {
    flex-direction: column;
    align-items: center;
  }

  .o-button {
    border-radius: 32px;
    --o-button-bg-color_hover: var(--o-color-kleinblue5);
    --o-button-bg-color_active: var(--o-color-kleinblue4);
    --o-button-border_hover: 1px solid var(--o-color-kleinblue5);
    --o-button-border_active: 1px solid var(--o-color-kleinblue4);
    transition: all 0.2s cubic-bezier(.2, 0, 0, 1);
    html[class="dark"] & {
      --o-button-bg-color_hover: var(--o-color-kleinblue7);
      --o-button-bg-color_active: var(--o-color-kleinblue8);
      --o-button-border_hover: 1px solid var(--o-color-kleinblue7);
      --o-button-border_active: 1px solid var(--o-color-kleinblue8);
    }
    &:hover {
      color: var(--o-color-white);
    }
    &:active {
      color: var(--o-color-white);
    }
    @media (max-width: 840px) {
      width: 100%;
      justify-content: center;
    }
  }
}

.dialog-footer .o-button {
  border-radius: 32px;
  --o-button-bg-color_hover: var(--o-color-kleinblue5);
  --o-button-bg-color_active: var(--o-color-kleinblue4);
  --o-button-border_hover: 1px solid var(--o-color-kleinblue5);
  --o-button-border_active: 1px solid var(--o-color-kleinblue4);
  transition: all 0.2s cubic-bezier(.2, 0, 0, 1);
  html[class="dark"] & {
    --o-button-bg-color_hover: var(--o-color-kleinblue7);
    --o-button-bg-color_active: var(--o-color-kleinblue8);
    --o-button-border_hover: 1px solid var(--o-color-kleinblue7);
    --o-button-border_active: 1px solid var(--o-color-kleinblue8);
  }
  &:hover {
    color: var(--o-color-white);
  }
  &:active {
    color: var(--o-color-white);
  }
}

.cookie-notice-close {
  position: absolute;
  top: 12px;
  right: 44px;
  cursor: pointer;
  transform-origin: center;
}

:deep(.el-dialog) {
  .el-dialog__header {
    text-align: center;
    padding: 24px;
  }
  .el-dialog__title {
    font-size: 32px;
    color: var(--e-color-text1);
    @media (max-width: 840px) {
      font-size: 22px;
    }
  }
  .el-dialog__body {
    padding: 0 24px;
    .content-item + .content-item {
      margin-top: 24px;
    }

    .content-item {
      .item-header {
        display: flex;
        align-items: center;
        .item-title {
          font-size: 18px;
          line-height: 32px;
          color: var(--e-color-text1);
          font-weight: 500;
        }

        .item-extra {
          font-size: 14px;
          line-height: 22px;
          color: var(--e-color-text4);
          margin-left: 24px;
        }
      }

      .item-detail {
        font-size: 16px;
        line-height: 28px;
        color: var(--e-color-text3);
        margin-top: 12px;
        @media (max-width: 840px) {
          font-size: 14px;
          line-height: 21px;
          margin-top: 8px;
        }
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding: 24px;
    @media (max-width: 840px) {
      .o-button {
        margin: 0 8px;
      }
    }
  }
}
</style>
