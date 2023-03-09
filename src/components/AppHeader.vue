<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useLangStore } from '@/stores';

import ONav from '@/components/ONav.vue';
import OIcon from 'opendesign/icon/OIcon.vue';

import { useI18n } from 'vue-i18n';
import { showGuard, logout, getUserAuth, useStoreData } from '@/shared/login';
import communityLogoWhite from '@/assets/openeuler-logo.png';
import QuickIssueLogo from '@/assets/quickissue-logo.png';
import IconDown from '~icons/app/icon-chevron-down.svg';
import IconLogin from '~icons/app/icon-login.svg';

const { t, locale } = useI18n();

const lang = computed(() => {
  return useLangStore().lang;
});

const { token } = getUserAuth();
const { guardAuthClient } = useStoreData();

const navList = computed(() => {
  return [
    {
      id: '',
      label: 'ISSUE',
      link: `/${lang.value}/issues/`,
    },
    {
      id: 'pulls',
      label: 'PR',
      link: `/${lang.value}/pulls/`,
    },
  ];
});

// 选择语言;
const options = ref([
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]);
// 选择语言
const handleCommand = (command: any): void => {
  locale.value = command.value;

  const { pathname } = window.location;
  const newHref = pathname.split('/');
  newHref[1] = command.value;
  useLangStore().setLangStore(command.value);
  window.location.href = newHref.join('/');
};

watch(
  () => {
    return locale.value as string;
  },
  (val) => {
    useLangStore().setLangStore(val);
  }
);

const jumpToUserZone = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  const origin = import.meta.env.VITE_LOGIN_ORIGIN;
  window.open(`${origin}/${language}/profile`, '_black');
};
</script>

<template>
  <header class="app-header">
    <div class="wrap">
      <div class="header-logo">
        <img class="quickissue-logo" :src="QuickIssueLogo" alt="" />
        <span class="line"></span>
        <a target="_blank" :href="`https://www.openeuler.org/${lang}/`"
          ><img class="community-logo" :src="communityLogoWhite"
        /></a>
      </div>
      <div class="out-box">
        <ONav :nav-items="navList"></ONav>
      </div>

      <div class="opt-user">
        <div v-if="token">
          <div class="opt-info">
            <img
              v-if="guardAuthClient.photo"
              :src="guardAuthClient.photo"
              class="opt-img"
            />
            <div v-else class="opt-img"></div>
            <p class="opt-name" :title="guardAuthClient?.username">
              {{ guardAuthClient.username }}
            </p>
          </div>
          <ul class="menu-list">
            <li @click="jumpToUserZone()">{{ t('common.USER_CENTER') }}</li>
            <li @click="logout()">{{ t('common.LOGOUT') }}</li>
          </ul>
        </div>
        <div v-else class="login" @click="showGuard()">
          <OIcon class="icon">
            <IconLogin />
          </OIcon>
        </div>
      </div>
      <a
        href="https://github.com/opensourceways/issue_pr_board/blob/main/doc/apis.md"
        class="api-docs"
        target="_blank"
      >
        API
      </a>
      <div class="language">
        <el-dropdown popper-class="language-change" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ t('quickIssue.LANG') }}
            <OIcon><IconDown></IconDown></OIcon>
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in options"
                :key="key"
                :class="{ active: lang === item.value }"
                :command="item"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <a :href="`/${lang}/new-issues/`" class="new-issue">
        <OButton>{{ t('quickIssue.SUBMIT_ISSUE') }} </OButton>
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  .wrap {
    display: flex;
    padding: 0 44px;
    margin: 0 auto;
    align-items: center;
    max-width: 1504px;
    height: 80px;
    .new-issue {
      flex-shrink: 0;
      .o-button {
        font-size: var(--o-font-size-h8);
        color: var(--o-color-text2);
        border: 1px solid #fff;
      }
    }
    .out-box {
      width: 100%;
      height: 100%;
    }
    .language {
      display: flex;
      justify-content: flex-end;
      margin-right: 40px;
      width: 100px;
      text-align: right;
      .el-dropdown {
        color: var(--o-color-text2);
        cursor: pointer;
        &-link {
          display: flex;
          color: var(--o-color-text2);
        }

        .o-icon {
          margin-left: 5px;
        }
      }
    }
    .api-docs {
      margin-right: 40px;
      font-size: var(--o-font-size-h8);
      color: #fff;
    }
  }
  &.isabout {
    background: #000;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: var(--o-font-size-h5);
  line-height: var(--o-line-height-h5);

  .line {
    height: 24px;
    background: #fff;
    margin: 0 12px;
    display: block;
    width: 1px;
  }
  a {
    display: flex;
    align-items: center;
    .community-logo {
      height: 32px;
    }
  }
  .quickissue-logo {
    height: 32px;
  }
}
.opt-user {
  margin-right: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  .opt-info {
    display: flex;
    align-items: center;
    .opt-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      vertical-align: middle;
      @media (max-width: 1100px) {
        width: 28px;
        height: 28px;
      }
    }
    .opt-name {
      color: var(--o-color-text2);
      margin-left: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 72px;
      line-height: var(--o-line-height-h8);
      @media (max-width: 1100px) {
        display: none;
      }
    }
  }
  &:hover {
    .menu-list {
      display: block;
    }
  }
  .menu-list {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    @media (max-width: 1100px) {
      top: 48px;
      left: -60px;
    }
    background: var(--o-color-bg2);
    cursor: pointer;
    z-index: 999;
    box-shadow: var(--o-shadow-l1);
    min-width: 78px;
    li {
      line-height: var(--o-line-height-h3);
      text-align: center;
      font-size: var(--o-font-size-text);
      color: var(--o-color-text1);
      border-bottom: 1px solid var(--o-color-division1);
      padding: 0 var(--o-spacing-h5);
      white-space: nowrap;
      &:last-child {
        border-bottom: 0 none;
      }

      &:hover {
        background: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
      &.active {
        color: var(--o-color-brand1);
        background: none;
        cursor: default;
      }
    }
  }
}
.login {
  .icon {
    font-size: var(--o-font-size-h6);
    color: var(--o-color-text2);
    cursor: pointer;
  }
}
</style>
