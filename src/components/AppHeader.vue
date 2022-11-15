<script setup lang="ts">
import { computed } from 'vue';

import ONav from '@/components/ONav.vue';

import communityLogoWhite from '@/assets/openeuler-logo.png';
import QuickIssueLogo from '@/assets/quickissue-logo.png';

// 返回首页

const navList = computed(() => {
  return [
    {
      id: '',
      label: 'ISSUE',
      link: '/zh/issues/',
    },
    {
      id: 'pulls',
      label: 'PR',
      link: '/zh/pulls/',
    },
  ];
});
</script>

<template>
  <header class="app-header">
    <div class="wrap">
      <div class="header-logo">
        <img class="quickissue-logo" :src="QuickIssueLogo" alt="" />
        <span class="line"></span>
        <a target="_blank" href="https://www.openeuler.org/zh/"
          ><img class="community-logo" :src="communityLogoWhite"
        /></a>
      </div>
      <div class="out-box">
        <ONav :nav-items="navList"></ONav>
      </div>
      <a href="/zh/new-issues/" class="new-issue">
        <OButton> 提交 Issue </OButton>
      </a>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  // position: absolute;
  // width: 100%;
  // left: 0;
  // right: 0;
  // z-index: 99;
  // top: 0;
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
        color: #fff;
        border: 1px solid #fff;
      }
    }
    .out-box {
      width: 100%;
      height: 100%;
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
