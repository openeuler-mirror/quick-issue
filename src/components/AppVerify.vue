<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import iconReset from '~icons/app/icon-resetting.svg';

const props = defineProps({
  challenge: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: '',
  },
});

const emits = defineEmits([
  'verify-email',
  'change-verify-code',
  'update:challenge',
  'close-dlg',
]);

const templateChallenge = computed({
  get: () => props.challenge,
  set: (val) => {
    emits('update:challenge', val);
  },
});

const { t, locale } = useI18n();
</script>
<template>
  <ODialog
    class="verify-dialog"
    :width="locale === 'zh' ? 450 : 520"
    :show-close="true"
  >
    <template #header> {{ t('quickIssue.VERIFY_TITLE') }} </template>
    <OInput
      v-model="templateChallenge"
      :placeholder="t('quickIssue.VERIFY_PLH')"
    ></OInput>
    <div class="img-box">
      <img :src="`/api-issues${src}`" alt="" />
    </div>
    <OIcon @click="emits('change-verify-code')">
      <iconReset></iconReset>
    </OIcon>
    <template #footer>
      <OButton type="primary" size="small" @click="emits('verify-email')">{{
        t('quickIssue.VERIFY_CONFIRM')
      }}</OButton>
      <OButton size="small" @click="emits('close-dlg')">{{
        t('quickIssue.VERIFY_CANCEL')
      }}</OButton>
    </template>
  </ODialog>
</template>

<style lang="scss">
.o-icon {
  cursor: pointer;
  font-size: 24px;
}
.verify-dialog {
  padding: 32px 46px;
  .el-dialog__header {
    padding: 0;
    text-align: center;
    font-size: var(--o-font-size-h5);
    line-height: var(--o-line-height-h5);
    margin: 0;
  }
  .el-dialog__body {
    padding: 16px 0 32px 0;
    display: flex;
    align-items: center;
    .img-box {
      margin: 0 16px;
      max-width: 100px;
      img {
        width: 100%;
      }
    }
    .o-icon {
      color: rgba($color: #000000, $alpha: 0.4);
    }
  }
  .el-dialog__headerbtn {
    top: 12px;
    right: 12px;
    width: fit-content;
    height: fit-content;
    font-size: 24px;
    .el-dialog__close {
      color: var(--o-color-text1);
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: center;
    gap: 16px;
    align-items: center;
    padding: 0;
  }
}
</style>
