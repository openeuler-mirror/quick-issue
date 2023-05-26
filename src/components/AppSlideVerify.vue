<script lang="ts" setup>
import { ref } from 'vue';

import SlideVerify, { SlideVerifyInstance } from 'vue3-slide-verify';

import { useI18n } from 'vue-i18n';

import img1 from '@/assets/category/verify/img1.jpg';
import img2 from '@/assets/category/verify/img2.jpg';
import img3 from '@/assets/category/verify/img3.jpg';
import img4 from '@/assets/category/verify/img4.jpg';
import img5 from '@/assets/category/verify/img5.jpg';
import img6 from '@/assets/category/verify/img6.jpg';

const msg = ref('');
const block = ref<SlideVerifyInstance>();

const msgs = [img1, img2, img3, img4, img5, img6];

const { t } = useI18n();

const emit = defineEmits(['succuss']);

const onAgain = () => {
  msg.value = 'try again!';
  // 刷新
  block.value?.refresh();
};

const onSuccess = (times: number) => {
  emit('succuss');
  block.value?.refresh();
  msg.value = `${t('quickIssue.VERIFY_SUCCESS')}${(times / 1000).toFixed(1)}s`;
  setTimeout(() => {
    msg.value = '';
  }, 1000);
};

const onFail = () => {
  msg.value = t('quickIssue.VERIFY_FAIL');
  setTimeout(() => {
    msg.value = '';
  }, 1000);
};

const onRefresh = () => {
  msg.value = '';
};
</script>
<template>
  <div class="silde_box">
    <slide-verify
      ref="block"
      class="silde_box"
      :slider-text="t('quickIssue.SWIPE_RIGHT')"
      :accuracy="5"
      :imgs="msgs"
      :h="200"
      :w="400"
      :interval="30"
      @again="onAgain"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
    ></slide-verify>
    <p class="tip-msg">{{ msg }}</p>
  </div>
</template>
<style scoped lang="scss">
:deep(.silde_box) {
  position: relative;
  margin: 0 auto;
  .tip-msg {
    position: absolute;
    bottom: -24px;
  }

  @font-face {
    font-family: iconfont;
    src: url(data:font/ttf;base64,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)
      format('truetype');
  }
  .iconfont {
    font-family: iconfont !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-fail:before {
    content: '\e6d5';
  }
  .icon-success:before {
    content: '\eb09';
  }
  .icon-arrow-right:before {
    content: '\eb08';
  }
  .icon-refresh:before {
    content: '\e654';
  }
  .slide-verify {
    position: relative;
  }
  .slide-verify-loading {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 999;
    animation: loading-f61c42f2 1.5s infinite;
  }
  .slide-verify-block {
    position: absolute;
    left: 0;
    top: 0;
  }
  .slide-verify-refresh-icon {
    cursor: pointer;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    width: 34px;
    height: 34px;
  }
  .slide-verify-refresh-icon .iconfont {
    font-size: 24px;
    color: #fff;
  }
  .slide-verify-slider {
    position: relative;
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
  }
  .slide-verify-slider-mask {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid var(--o-color-brand1);
    background: #d1e9fe;
  }
  .slide-verify-slider-mask-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px #0000004d;
    cursor: pointer;
    transition: background 0.2s linear;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .slide-verify-slider-mask-item:hover {
    background: var(--o-color-brand1);
  }
  .is-move {
    background: var(--o-color-brand1);
  }
  .slide-verify-slider-mask-item:hover .iconfont {
    color: #fff;
  }
  .is-move .iconfont {
    color: #fff;
  }
  .slide-verify-slider-mask-item-icon {
    line-height: 1;
    font-size: 30px;
    color: #303030;
  }
  .container-active .slide-verify-slider-mask {
    height: 38px;
    border-width: 1px;
  }
  .container-active .slide-verify-slider-mask-item {
    height: 38px;
    top: -1px;
    border: 1px solid var(--o-color-brand1);
  }
  .container-success .slide-verify-slider-mask {
    height: 38px;
    border: 1px solid #52ccba;
    background-color: #d2f4ef;
  }
  .container-success .slide-verify-slider-mask-item {
    height: 38px;
    top: -1px;
    border: 1px solid #52ccba;
    background-color: #52ccba !important;
  }
  .container-success .slide-verify-slider-mask .iconfont {
    color: #fff;
  }
  .container-fail .slide-verify-slider-mask {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
  }
  .container-fail .slide-verify-slider-mask-item {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
  }
  .container-fail .slide-verify-slider-mask .iconfont {
    color: #fff;
  }
  .container-active .slide-verify-slider-text,
  .container-success .slide-verify-slider-text,
  .container-fail .slide-verify-slider-text {
    display: none;
  }
  @keyframes loading-f61c42f2 {
    0% {
      opacity: 0.7;
    }
    to {
      opacity: 9;
    }
  }
}
</style>
