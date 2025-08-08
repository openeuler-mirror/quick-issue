<script lang="ts" setup>
import { ref, computed, type CSSProperties } from 'vue';
import { OIcon, OTextarea, useMessage, ODivider } from '@opensig/opendesign';
import { ElSlider } from 'element-plus';
import OButton from 'opendesign/button/src/button'

import IconClose from '~icons/app/icon-close.svg';

import { postFeedback } from '@/api/api-feedback';
import { useScreen } from '@/components/hooks/useScreen';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const message = useMessage();
const { t } = useI18n();
const { gtPhone, isPhone } = useScreen();

interface MarkT {
  style: CSSProperties;
  label: string;
}

type Marks = Record<number, MarkT | string>;

const marks = computed(() => {
  const temp: Marks = {};
  for (let i = 0; i < 11; i++) {
    temp[i * 10] = String(i);
  }
  return temp;
});

const forumLink = import.meta.env.VITE_SERVICE_FORUM_URL;

const placeholder = computed(() => {
  if (score.value / 10 < 7) {
    return t('feedback.placeholder1');
  } else if (score.value / 10 < 9) {
    return t('feedback.placeholder2');
  } else {
    return t('feedback.placeholder3');
  }
});

const isShow = ref(props.show);
const inputText = ref('');
const score = ref(0);

const scoreTip = computed(() => {
  return score.value / 10;
});
const scorePosition = computed(() => {
  return score.value + '%';
});

const emits = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'close', value: boolean): void;
}>();

const showFeedbackInput = () => {
  isShow.value = true;
  emits('input', isShow.value);
};

const closeFeedbackPopup = () => {
  inputText.value = '';
  score.value = 0;
  isShow.value = false;
  emits('close', isShow.value);
};

const submitFeedback = () => {
  const params = {
    feedbackPageUrl: window.location.href,
    feedbackText: inputText.value,
    feedbackValue: score.value / 10,
  };

  postFeedback(params)
    .then((res: any) => {
      if (res?.data?.code === 200) {
        message.success({
          content: t('feedback.feedbackSuccess'),
        });
      } else {
        message.danger({
          content: t('feedback.feedbackSubmitFailed'),
        });
      }
    })
    .catch(() => {
      message.danger({
        content: t('feedback.feedbackSubmitFailed'),
      });
    });

  closeFeedbackPopup();
};

// ------------------ 移动端nss评分 -----------------
const RATE_MAX_MB = 10;

const RATE_INDEX = Array(RATE_MAX_MB + 1)
  .fill(0)
  .map((_, index) => index);
</script>
<template>
  <div class="feedback-slider">
    <OIcon v-if="gtPhone" class="icon-close" @click="closeFeedbackPopup"><IconClose /></OIcon>

    <p class="slider-title">
      {{ t('feedback.title1') }}<strong>{{ t('feedback.title2') }}</strong
      >{{ t('feedback.title3') }}
    </p>

    <div class="slider-body">
      <div v-show="isShow && gtPhone" class="slider-tip">
        {{ scoreTip }}
      </div>

      <div v-if="isPhone" class="rate-stop">
        <div v-for="(_, index) in RATE_INDEX" :key="index" class="stop" :style="{ left: `${index * 10}%` }">{{ index }}</div>
      </div>

      <el-slider v-model="score" :step="10" :marks="marks" show-stops :show-tooltip="false" @input="showFeedbackInput" />
    </div>

    <div class="grade-info">
      <span>{{ t('feedback.grade1') }}</span>
      <span>{{ t('feedback.grade2') }}</span>
    </div>

    <div v-show="isShow" class="reason">
      <OTextarea v-model="inputText" :placeholder="placeholder" resize="none" :max-length="500" :rows="4" :input-on-outlimit="false" />
      <p class="more-info">
        <span>{{ t('feedback.moreInfo') }}</span>
        <a :href="forumLink" target="_blank">{{ t('feedback.moreInfo2') }}</a>
        <span>{{ t('feedback.moreInfo3') }}</span>
      </p>
      <div v-if="gtPhone" class="submit-btn">
        <OButton type="primary" size="medium" variant="solid" class="submit" :disabled="!inputText" @click="submitFeedback">
          {{ t('feedback.submit') }}
        </OButton>
      </div>
    </div>
    <div v-if="isPhone" class="btn-box">
      <OButton color="normal" variant="text" size="large" @click="closeFeedbackPopup">{{ t('feedback.cancel') }}</OButton>
      <ODivider class="divider-btn" direction="v" />
      <OButton color="normal" variant="text" size="large" :disabled="!inputText" @click="submitFeedback">{{ t('feedback.confirmTitle') }}</OButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.feedback-slider {
  cursor: initial;
}

.slider-title {
  color: var(--o-color-text1);
  padding-right: 12px;
  text-align: center;
  @include tip1;
  @include respond-to('<=pad_v') {
    text-align: center;
    margin-bottom: 12px;
    @include text2;
  }
}

.slider-body {
  padding-top: 24px;
  position: relative;
  z-index: 3;
  @include respond-to('<=pad_v') {
    margin: 0 4px;
  }

  @include respond-to('phone') {
    padding-top: 0;
    margin-top: 36px;
  }

  .slider-tip {
    width: 28px;
    height: auto;
    padding: 4px 0;
    text-align: center;
    font-size: var(--o-font_size-tip1);
    color: var(--o-color-text1);
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-xs);
    box-shadow: 0 3px 8px rgba(18, 20, 23, 0.08);
    backdrop-filter: blur(5px);
    border: 1px solid var(--o-color-border2);
    position: absolute;
    top: -16px;
    left: v-bind(scorePosition);
    transform: translateX(-50%);

    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      transform: rotateZ(45deg);
      border: 1px solid;
      border-color: transparent var(--o-color-border2) var(--o-color-border2) transparent;
      background-color: var(--o-color-fill2);
      position: absolute;
      bottom: -4px;
      right: 9px;
    }
  }

  :deep(.el-slider) {
    --el-slider-height: 6px;
    --el-slider-border-radius: 4px;
    --el-slider-button-wrapper-size: 14px;
    --el-slider-button-wrapper-offset: -4px;
    --el-slider-button-size: 14px;
    --el-slider-runway-bg-color: var(--o-color-fill1);
    height: 10px;

    .el-slider__marks {
      width: 2px;
      height: 2px;
      display: none;
    }

    .el-slider__runway {
      height: 8px;
      border-radius: var(--o-radius-xs);
      background-color: transparent;
      &::before {
        content: '';
        position: absolute;
        width: calc(100% + 3px);
        inset: 0;
        right: 4px;
        background-color: var(--o-color-bg-secondary);
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }

    .el-slider__bar {
      --el-slider-height: 8px;
      left: -4px !important;
      height: 10px;
      background-image: linear-gradient(270deg, #002fa7 0%, #21a9fc 100%);
      top: -1px;
      border-radius: 5px;
    }

    .el-slider__button-wrapper {
      display: flex;
    }
    .el-slider__button-wrapper + div {
      position: relative;
      transform: translateY(2px);
      z-index: 2;

      & + div {
        transform: translateY(2px);
        & > .el-slider__stop:nth-of-type(1) {
          transform: translatex(2px);
        }
      }
    }

    .el-slider__stop {
      margin-top: -1px;
      width: 2px;
      height: 2px;
      background-color: var(--o-color-brand1);
      top: 1px;
    }

    .el-slider__marks-stop {
      background-color: var(--o-color-fill2);

      &:last-child {
        transform: translate(-3px, -1px);
        background-color: var(--o-color-info4);
      }
      &:nth-last-of-type(1) {
        transform: translateX(-4px);
        background-color: var(--o-color-brand1);
      }
    }

    .el-slider__button {
      background: linear-gradient(90deg, #07caff 0%, #5882ff 100%);
      position: relative;
      border: solid 8px var(--o-color-white);
      box-shadow: var(--o-shadow-2);

      &::after {
        display: block;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--o-color-brand1);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.grade-info {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: var(--o-color-text4);
  margin-top: 12px;
  @include tip2;
  @include respond-to('<=pad_v') {
    padding: 0 3px;
  }
  @include respond-to('phone') {
    margin-top: 8px;
  }
}

.reason {
  margin-top: 16px;

  :deep(.o-textarea) {
    --textarea-radius: 4px;
    --textarea-placeholder-color: var(--o-color-text-secondary);
    --textarea-bd-color: var(--o-color-border2);
    --textarea-bd-color-focus: var(--o-color-border3);
    --textarea-bd-color-hover: var(--o-color-border3);

    width: 100%;

    .o_textarea-suffix {
      color: var(--textarea-placeholder-color);

    }
    /* WebKit浏览器 */
    textarea::-webkit-input-placeholder {
      color: var(--textarea-placeholder-color); /* 设置颜色 */
      font-size: 12px;
    }

    /* Mozilla Firefox 4-18 */
    textarea:-moz-placeholder {
      color: var(--textarea-placeholder-color); /* 设置颜色 */
      font-size: 12px;
    }

    /* Mozilla Firefox 19+ */
    textarea::-moz-placeholder {
      color: var(--textarea-placeholder-color); /* 设置颜色 */
      font-size: 12px;
    }

    /* Internet Explorer 10+ */
    textarea::-ms-input-placeholder {
      color: var(--textarea-placeholder-color); /* 设置颜色 */
      font-size: 12px;
    }

  }

  .more-info {
    max-width: 270px;
    color: var(--o-color-text4);
    margin-top: 8px;
    text-align: center;
    @include tip2;
  }

  :deep(.o-button) {
    --o-button-padding: 6px 26px;
    border-radius: 19px;
  --o-button-font-size: 14px;
  }

  .submit-btn {
    text-align: center;
    margin-top: 16px;

    :deep(.o-btn) {
      border-color: var(--o-color-brand1);

      @include hover {
        border-color: var(--o-color-brand1);
      }

      &.o-btn-disabled {
        border-color: var(--o-color-brand5);
        @include hover {
          border-color: var(--o-color-brand5);
        }
      }
    }

    @include respond-to('<=pad_v') {
      display: flex;
      justify-content: space-evenly;

      .o-btn {
        flex: 1;
        position: relative;
        @include h3;
      }
    }
  }
}

.rate-stop {
  position: absolute;
  display: flex;
  width: calc(100% - 16px);
  left: 0;
  top: -36px;
  margin-top: 12px;
  color: var(--o-color-text4);
  height: 16px;
  @include text2;
  div {
    position: absolute;
  }
}
.btn-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  .o-btn {
    --btn-bg-color-hover: none;
    --btn-bg-color-active: none;
    --btn-padding: 0 50px;
    --btn-color: var(--o-color-text1);
    font-weight: 500;
  }
}
</style>
