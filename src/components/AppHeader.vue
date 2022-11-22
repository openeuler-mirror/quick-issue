<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useLangStore } from '@/stores';

import ONav from '@/components/ONav.vue';
import OIcon from 'opendesign/icon/OIcon.vue';

import { useI18n } from 'vue-i18n';

import communityLogoWhite from '@/assets/openeuler-logo.png';
import QuickIssueLogo from '@/assets/quickissue-logo.png';
import IconDown from '~icons/app/icon-chevron-down.svg';
import { router } from '@/routers';

const { t, locale } = useI18n({ useScope: 'global' });

const lang = computed(() => {
  return useLangStore().lang;
});

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
  router.push(newHref.join('/'));
};
watch(
  () => {
    return locale.value as string;
  },
  (val) => {
    useLangStore().setLangStore(val);
  }
);
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
      margin-right: 48px;
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
</style>
