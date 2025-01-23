<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';

import { useLangStore } from '@/stores';
import { GroupInfo } from '@/shared/@types/type-sig';
import {
  getUrlParam,
  handleUploadImage,
  rules,
  emailRules,
  privacyRules,
  codeRules,
} from '@/shared';

import {
  getReposData,
  getIssueSelectOption,
  createIssue,
  reqGet,
  reqCheck,
} from '@/api/api-quick-issue';

import { OptionList, IssueData } from '@/shared/@types/type-quick-issue';
import { defaultIssueRepo, giteeUrl } from '@/config';

import { getSigLandscape } from '@/api/api-sig';

import AppEditor from '@/components/AppEditor.vue';
import AppVerify from '@/components/AppVerify.vue';
import AppContent from '@/components/AppContent.vue';
import SigLandscapeFeature from '@/components/SigLandscapeFeature.vue';
import OIcon from 'opendesign/icon/OIcon.vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, TabsPaneContext } from 'element-plus';

import IconGitee from '~icons/app/icon-gitee.svg';
import IconSearch from '~icons/app/icon-search.svg';
import { oaReport } from '@/shared/analytics';

interface TypesList {
  id: number;
  name: string;
  template: string;
  desc?: string;
}
const formRef = ref<FormInstance>();
const { t } = useI18n();

const landscapeInfo = ref<GroupInfo[]>([]); //landscape数据
const isMenuShown = ref(false); // landscape显示

// 发送邮箱验证码，验证
const veriflyData = ref({
  captcha_id: 0,
  src: '',
});

//landscape title
const titleList = ref([
  {
    value: t('sig.SIG_LANDSCAPE[0].CATEGORY_NAME'),
    key: 'tech',
  },
  {
    value: t('sig.SIG_LANDSCAPE[1].CATEGORY_NAME'),
    key: 'operate',
  },
]);

const lang = computed(() => {
  return useLangStore().lang;
});

// 按钮文字内容
const content = ref(t('quickIssue.SEND_CODE'));

const totalTime = ref(60);
const tabType = ref(titleList.value[0].key);
const clock = ref();
const challenge = ref('');
const isVerifyShown = ref(false);

const verifyEmail = () => {
  if (challenge.value.length !== 6) {
    return false;
  }
  reqCheck({
    captcha_id: veriflyData.value.captcha_id,
    challenge: challenge.value,
    email: issueData.email,
  })
    .then(() => {
      challenge.value = '';
      isVerifyShown.value = false;
      sendVerifyEmail();
    })
    .catch(() => {
      queryGetReq();
    });
};

const reposList = ref<OptionList>({
  page: 1,
  data: [],
  keyword: '',
});
const typesList = ref<Array<TypesList>>();

const repoParams = reactive({
  page: 1,
  per_page: 40,
  keyword: '',
  sig: '',
});

// 表单数据
const issueData: IssueData = reactive({
  title: decodeURI(getUrlParam('title')) || '',
  issue_type_id: '',
  sig: '',
  repo: getUrlParam('repo') || defaultIssueRepo,
  email: '',
  code: '',
  description: '',
  privacy: [],
  isGiteeUser: true,
});

function getSigValue(val: string) {
  if (issueData.sig && issueData.sig === val) {
    isMenuShown.value = false;
    return false;
  }
  issueData.sig = val;
  isMenuShown.value = false;
  repoParams.sig = val;
  repoParams.page = 1;
  repoParams.keyword = '';
  reposList.value.keyword = '';
  reposList.value.data = [];
  issueData.repo = '';
}

function getRepoBySigName() {
  getReposData(repoParams).then((res) => {
    if (res.data) {
      reposList.value.total = res.total;
      reposList.value.data = [...reposList.value.data, ...res.data];
    } else if (!res.total && !repoParams.keyword) {
      ElMessage({
        message: t('quickIssue.EMPTY_REPO'),
        type: 'warning',
        duration: 10000,
      });
      issueData.repo = defaultIssueRepo;
    }
  });
}

// 刷新验证码
function queryGetReq() {
  reqGet().then((res) => {
    veriflyData.value = res.data;
  });
}

function changeEmail() {
  if (totalTime.value !== 60) {
    window.clearInterval(clock.value);
    content.value = t('quickIssue.SEND_CODE');
    totalTime.value = 60;
  }
}
async function getCodeByEmail(verify: FormInstance | undefined) {
  if (!verify) {
    return;
  }
  rules.code = [];
  rules.privacy = privacyRules;
  rules.email = emailRules;
  verify.clearValidate('code');
  verify.validate(async (res: boolean) => {
    if (totalTime.value === 60 && res) {
      isVerifyShown.value = true;
      queryGetReq();
    }
  });
}

function sendVerifyEmail() {
  clock.value = window.setInterval(function () {
    totalTime.value--;
    content.value = t('quickIssue.RESEND1', [`${totalTime.value}s`]);
    if (totalTime.value < 0) {
      //当倒计时小于0时清除定时器
      window.clearInterval(clock.value);
      content.value = t('quickIssue.RESEND');
      totalTime.value = 60;
    }
  }, 1000);
  ElMessage({
    message: t('quickIssue.SUCCESS_SEND_MAIL'),
    type: 'success',
  });
}

const issueTypeId = computed(() =>
  Number(issueData.issue_type_id?.toString().split('__').at(-1))
);

async function goGitee(verify: FormInstance | undefined) {
  if (!verify) {
    return;
  }
  rules.email = [];
  rules.code = [];
  rules.privacy = [];
  verify.validate(async (res: boolean) => {
    if (res) {
      const url = `${giteeUrl}/${issueData.repo}/issues/new?title=${
        issueData.title
      }&issue%5Bissue_type_id%5D=${
        issueTypeId.value
      }&issue%5Bdescription%5D=${encodeURIComponent(issueData.description)}`;
      oaReport('toGiteeCreateIssue', {
        $utm_source: 'quick_issue',
        jump_url: url,
      });
      window.open(url);
    }
  });
}

async function submitForm(
  verify: FormInstance | undefined,
  isGoGitee: boolean
) {
  if (!verify) {
    return;
  }
  rules.privacy = privacyRules;
  rules.email = emailRules;
  rules.code = codeRules;
  verify.validate(async (res: boolean) => {
    if (res) {
      const parmes = {
        title: issueData.title,
        issue_type_id: issueTypeId.value,
        email: issueData.email,
        code: issueData.code,
        repo: issueData.repo,
        description: issueData.description,
        privacy:
          Array.isArray(issueData.privacy) && issueData.privacy.length
            ? true
            : false,
      };
      handelCreatIssue(parmes, isGoGitee, verify);
    } else {
      verify.scrollToField('title');
    }
  });
}

function handelCreatIssue(
  parmes: IssueData,
  isGoGitee: boolean,
  verify: FormInstance
) {
  createIssue(parmes).then(async (res) => {
    if (res.code === 200) {
      const jump_url = `${giteeUrl}/${issueData.repo}/issues/${res.data.number}`;
      oaReport('noGiteeCreateIssue', {
        $utm_source: 'quick_issue',
        jump_url,
        quick_issue_email: parmes.email,
      });
      if (isGoGitee) {
        window.open(jump_url);
      }
      // 重置表单
      resetForm(verify);
      ElMessage({
        message: t('quickIssue.SUCCESS_CREATED'),
        type: 'success',
      });
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  });
}

function resetForm(verify: FormInstance) {
  verify.resetFields();
  repoParams.sig = '';
  issueData.privacy = [];
  issueData.description = '';
  issueData.repo = defaultIssueRepo;
  challenge.value = '';
  verify.scrollToField('title');
}

function sigValueChange(val: string) {
  repoParams.sig = val;
  repoParams.page = 1;
  reposList.value.page = 1;
  reposList.value.keyword = '';
  reposList.value.data = [];
  issueData.repo = '';
}

function getNextPage() {
  if (reposList.value.total) {
    reposList.value.total > repoParams.page * repoParams.per_page
      ? repoParams.page++
      : '';
  }
}
function changeState(stash: boolean) {
  if (!stash) {
    repoParams.page = 1;
    repoParams.keyword = '';
  } else {
    if (reposList.value.keyword) {
      reposList.value.data = [];
      repoParams.keyword = reposList.value.keyword;
    }
  }
}
function scrollClick(tab: TabsPaneContext) {
  document.querySelector(`#${tab.props.name}`)?.scrollIntoView({
    behavior: 'smooth',
  });
}
function handleTypeChange(val: number) {
  issueData.description =
    typesList.value?.find((item) => item.id === val)?.template || '';
}

const debounceEvent = debounce(
  (val: string) => {
    if (val === undefined) {
      return false;
    }
    if (val !== repoParams.keyword) {
      reposList.value.page = 1;
      reposList.value.data = [];
      repoParams.page = 1;
      repoParams.keyword = val;
    }
  },
  500,
  {
    trailing: true,
  }
);

onMounted(async () => {
  getRepoBySigName();
  try {
    if (getUrlParam('sig')) {
      issueData.sig = getUrlParam('sig');
      repoParams.sig = issueData.sig;
    }
    await getIssueSelectOption('types', null).then((res) => {
      // 手动筛选，只留两个场景 【开发|使用openEuler】
      const sceneDescMap: Record<string, string> = {
        '开发openEuler': '如构建场景/测试场景/发布场景/分析场景/其他场景',
        '使用openEuler': '如下载场景/使用文档场景/安装及迁移场景/其他场景',
      };
      typesList.value = res.data
        .filter((v: TypesList) => !!sceneDescMap[v.name])
        .map((v: TypesList) => {
          return {
            ...v,
            id: `${v.name}__${v.id}`,
            desc: sceneDescMap[v.name] || '',
          };
        });
    });
    // 根据url中的type获取对应的模板
    if (getUrlParam('type')) {
      const targetType = typesList.value?.find((item) => {
        return item.name === decodeURI(getUrlParam('type'));
      });
      issueData.issue_type_id = targetType?.id;
      issueData.description = targetType?.template || '';
    }
    landscapeInfo.value = await getSigLandscape(lang.value);
  } catch (err) {}
});
watch(
  () => repoParams,
  () => {
    getRepoBySigName();
  },
  {
    deep: true,
  }
);
</script>
<template>
  <AppContent class="submit-issue">
    <div class="inline-box">
      <h1 id="create-issue">{{ t('quickIssue.ISSUE_TITLE') }}</h1>
      <el-form
        ref="formRef"
        :model="issueData"
        :rules="rules"
        label-position="left"
        class="issue-form"
        :class="lang === 'en' ? 'en-form' : ''"
      >
        <div class="form-liner is-gitee-user-radio">
          <el-form-item
            :label="t('quickIssue.IS_GITEE_USER')"
            prop="isGiteeUser"
            required
          >
            <ORadioGroup v-model="issueData.isGiteeUser">
              <ORadio :value="true">{{ t('quickIssue.YES') }}</ORadio>
              <ORadio :value="false">{{ t('quickIssue.NO') }}</ORadio>
            </ORadioGroup>
          </el-form-item>
        </div>
        <div class="form-liner">
          <el-form-item
            :label="t('quickIssue.TITLE')"
            prop="title"
            class="left-form-item"
          >
            <OInput
              v-model="issueData.title"
              :placeholder="t('quickIssue.INPUT')"
            ></OInput>
          </el-form-item>
          <el-form-item
            :label="t('quickIssue.SCENARIO')"
            prop="issue_type_id"
            class="right-form-item"
          >
            <OSelect
              v-model.string="issueData.issue_type_id"
              :placeholder="t('quickIssue.SELECT')"
              placement="bottom-end"
              @change="handleTypeChange"
            >
              <ElOption
                v-for="item in typesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <div class="scene-item">
                  <span class="scene-name">{{ item.name }}</span>
                  <span v-if="item.desc" class="scene-desc"
                    >({{ item.desc }})</span
                  >
                </div>
              </ElOption>
            </OSelect>
          </el-form-item>
        </div>
        <div class="form-liner">
          <el-form-item label="SIG" prop="sig" class="left-form-item">
            <OInput
              v-model="issueData.sig"
              :placeholder="t('quickIssue.INPUT')"
              @change="sigValueChange"
            ></OInput>
            <OButton
              class="select-sig-btn"
              type="primary"
              size="small"
              @click="isMenuShown = true"
              >{{ t('quickIssue.SELECT_SIG') }}</OButton
            >
          </el-form-item>
          <!-- 仓库查询 -->
          <el-form-item
            :label="t('quickIssue.REPO_NAME')"
            prop="repo"
            class="right-form-item"
          >
            <OSelect
              v-model="issueData.repo"
              :listener-scorll="true"
              :placeholder="t('quickIssue.SELECT')"
              @scorll-bottom="getNextPage()"
              @visible-change="changeState"
            >
              <template #prefix>
                <OIcon><IconSearch /></OIcon>
              </template>
              <div class="search-box">
                <OSearch
                  v-model="reposList.keyword"
                  :placeholder="t('quickIssue.SEARCH_PLACEHOLDER')"
                  style="padding: 0 8px"
                  @input="debounceEvent"
                ></OSearch>
              </div>
              <el-scrollbar>
                <ElOption
                  v-if="!reposList.data.length"
                  label=""
                  value=""
                  :disabled="true"
                  style="text-align: center"
                >
                  <span>no data</span>
                </ElOption>
                <ElOption
                  v-for="item in reposList.data"
                  :key="item.repo"
                  :label="item.repo"
                  :value="item.repo"
                />
              </el-scrollbar>
            </OSelect>
          </el-form-item>
        </div>
        <transition-group name="fadeHeight">
          <div v-if="issueData.isGiteeUser" class="gitee-user">
            <OButton size="small" @click="goGitee(formRef)">
              <template #prefixIcon>
                <OIcon>
                  <IconGitee />
                </OIcon>
              </template>
              {{ t('quickIssue.GITTE_USER') }}
            </OButton>
          </div>
          <div v-else class="not-gitee-user">
            <div class="form-liner editor">
              <el-form-item
                :label="t('quickIssue.DESCRIPTIVE')"
                class="fill-width"
              >
                <AppEditor
                  v-model="issueData.description"
                  @upload-image="handleUploadImage"
                >
                </AppEditor>
              </el-form-item>
            </div>
            <div class="form-liner verify-email">
              <el-form-item
                :label="t('quickIssue.EMAIL')"
                prop="email"
                required
                class="left-form-item email"
              >
                <OInput
                  v-model="issueData.email"
                  :placeholder="t('quickIssue.INPUT')"
                  @input="changeEmail()"
                ></OInput>
              </el-form-item>
              <el-form-item
                :label="t('quickIssue.CODE')"
                prop="code"
                class="verify-code-form"
              >
                <OInput
                  v-model="issueData.code"
                  :placeholder="t('quickIssue.INPUT')"
                ></OInput>
                <OButton
                  class="select-sig-btn"
                  type="primary"
                  size="small"
                  :disabled="totalTime !== 60"
                  @click="getCodeByEmail(formRef)"
                  >{{ content }}</OButton
                >
              </el-form-item>
            </div>
            <div class="form-liner form-radio">
              <el-form-item prop="privacy">
                <OCheckboxGroup v-model="issueData.privacy">
                  <OCheckbox value="true">
                    {{ t('quickIssue.PRIVACY_TEXT') }}
                    <a
                      :href="`https://www.openeuler.org/${lang}/other/privacy/`"
                      target="_blank"
                      >{{ t('quickIssue.PRIVACY') }}</a
                    >
                  </OCheckbox>
                </OCheckboxGroup>
              </el-form-item>
            </div>
            <div class="obuton-box">
              <OButton
                size="small"
                type="primary"
                @click="submitForm(formRef, true)"
                >{{ t('quickIssue.CREATE') }}</OButton
              >
              <OButton
                size="small"
                class="center-button"
                @click="submitForm(formRef, false)"
                >{{ t('quickIssue.CONTINUE') }}</OButton
              >
              <RouterLink :to="`/${lang}/issues/`">
                <OButton size="small">{{ t('quickIssue.CANCEL') }}</OButton>
              </RouterLink>
            </div>
          </div>
        </transition-group>
      </el-form>
    </div>
  </AppContent>
  <!-- -------------landscape-------------------- -->
  <div class="mo-content"></div>
  <ODialog v-model="isMenuShown" class="menu-dialog" :show-close="true">
    <h1 id="tech"></h1>
    <OTabs v-model="tabType" @tab-click="scrollClick">
      <OTab-pane
        v-for="item in titleList"
        :key="item.key"
        :label="item.value"
        :name="item.key"
      >
      </OTab-pane>
      <div
        v-for="(group, index) in landscapeInfo"
        :key="group.groupName"
        class="landscape-group"
      >
        <h1 :id="titleList[index].key"></h1>
        <SigLandscapeFeature
          :info="group?.features"
          @sig-click="getSigValue"
        ></SigLandscapeFeature>
      </div>
    </OTabs>
  </ODialog>
  <!-- ------- 邮件发送验证-------------- -->
  <AppVerify
    v-model="isVerifyShown"
    :challenge="challenge"
    :src="veriflyData.src"
    @change-verify-code="queryGetReq"
    @verify-email="verifyEmail"
    @update:challenge="(val) => (challenge = val)"
    @close-dlg="isVerifyShown = false"
  />
</template>

<style lang="scss">
.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.5s;
  max-height: 6000px;
}
.fadeHeight-enter,
.fadeHeight-leave-to {
  opacity: 0;
  max-height: 0px;
}
.submit-issue {
  color: var(--o-color-text1);
  .inline-box {
    background-color: var(--o-color-bg2);
    padding: 40px;
  }
  .el-input__suffix {
    height: 34px;
  }
  .o-select {
    .el-input__wrapper {
      min-width: 250px;
      box-shadow: 0 0 0 1px var(--o-color-border1) inset;
      &:hover {
        box-shadow: 0 0 0 1px var(--o-color-border1) inset;
      }
      .o-icon {
        font-size: var(--o-font-size-h7);
      }
    }
  }
  h1 {
    font-size: var(--o-font-size-h4);
    font-weight: 300;
  }
  .issue-form {
    margin-top: var(--o-spacing-h2);
    .form-liner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--o-spacing-h4);
      .el-form-item {
        display: flex;
        margin: 0;
        flex-wrap: nowrap;
        align-items: center;
        &.is-error {
          .el-input__wrapper {
            box-shadow: 0 0 0 1px var(--o-color-error1) inset;
            .el-icon {
              color: var(--o-color-error1);
            }
          }
        }
        .el-form-item__content {
          display: flex;
          flex-wrap: nowrap;
          min-width: 208px;
          .el-form-item__error {
            padding-top: var(--o-spacing-h9);
          }
          .o-select {
            width: 100%;
            .o-icon {
              padding: 0;
              color: inherit;
              font-size: var(--o-font-size-h7);
            }
          }
          .select-sig-btn {
            position: relative;
            flex-shrink: 0;
            margin-left: -1px;
            padding: 7px 34px;
            color: #fff;
            z-index: 1;
          }
          .o-icon {
            cursor: pointer;
            padding-left: var(--o-spacing-h5);
            font-size: 32px;
            color: var(--o-color-brand1);
          }
          .upload-file {
            display: flex;
            .o-icon {
              padding: 0;
              font-size: 24px;
              color: var(--o-color-text1);
            }
          }
        }
        .el-form-item__label {
          width: 64px;
          text-align: right;
          color: var(--o-color-text1);
          font-size: var(--o-font-size-h7);
          flex-shrink: 0;
          padding-right: var(--o-spacing-h5);
        }
        &:not(.is-required) {
          .el-form-item__label {
            padding-left: 11px;
          }
        }
      }
      .fill-width {
        margin-right: var(--o-spacing-h2);
        width: 100%;
      }
      .left-form-item {
        margin-right: var(--o-spacing-h2);
        width: 53%;
        &.email {
          width: auto;
        }
      }

      .right-form-item {
        width: 44%;
      }

      &.is-gitee-user-radio {
        .el-form-item__label {
          width: 161px;
        }
        .o-radio-label {
          font-size: 16px;
        }
      }
    }

    .verify-email {
      margin: var(--o-spacing-h2) 0;
      justify-content: flex-start;
      .upload-item {
        width: 100%;
      }
      .verify-code-form {
        .el-form-item__label {
          width: 88px;
        }
      }
    }
    .form-radio {
      margin: var(--o-spacing-h2);
      justify-content: center;
      .o-checkbox-group {
        .o-checkbox-label {
          font-size: 16px;
        }
      }
    }
    .editor {
      margin-top: var(--o-spacing-h3);
      .fill-width {
        margin: 0;
        align-items: flex-start;
      }
    }
    .obuton-box {
      display: flex;
      justify-content: center;
      .o-button-type-primary {
        color: #fff;
      }
      .center-button {
        margin: 0 var(--o-spacing-h4);
      }
    }
    .gitee-user {
      margin-top: var(--o-spacing-h2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .is-gitee-user {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: var(--o-spacing-h2);
      .o-button {
        min-width: 200px;
        padding: 6px 0;
        align-items: center;
        justify-content: center;
      }
      .gitee-user {
        position: relative;
        padding: 1px;
        overflow: hidden;
        .o-button {
          position: relative;
          border: none;
          background-color: var(--o-color-bg2);
        }
        &::before {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: 300%;
          height: 100%;
          background: linear-gradient(
            115deg,
            #fc756cff,
            #a767e5,
            #002fa7ff,
            rgb(232, 169, 164),
            #fc756cff
          );
          background-size: 50% 100%;
          animation: rainbowSlide 6s linear infinite;

          @keyframes rainbowSlide {
            100% {
              background-position: -400% 0;
            }
          }
        }
      }
      .unregistered {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: var(--o-spacing-h4);
        color: var(--o-color-brand1);
        &:hover {
          color: var(--o-color-brand2);
        }
      }
      .icon-arrow {
        transition: all 0.3s;
        margin-top: var(--o-spacing-h6);
      }
      .reversal {
        transform: rotate(180deg);
      }
    }
  }
  .en-form {
    .form-liner {
      .el-form-item {
        .el-form-item__label {
          width: 120px;
        }
      }
      &.is-gitee-user-radio {
        .el-form-item__label {
          width: 246px;
        }
        .o-radio-label {
          font-size: 16px;
        }
      }
    }
    .verify-email {
      .verify-code-form {
        .el-form-item__label {
          width: 180px;
        }
      }
    }
  }
}
.menu-dialog {
  margin-top: 10vh;
  max-width: 1430px;
  width: 100%;
  .el-tabs__header {
    padding-top: 40px;
    position: sticky;
    top: 0;
    background-color: var(--o-color-bg2);
    z-index: 1;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
  .el-dialog__headerbtn {
    top: var(--o-spacing-h2);
    right: var(--o-spacing-h2);
    font-size: var(--o-font-size-h5);
    width: fit-content;
    height: fit-content;
    z-index: 10;
    .el-dialog__close {
      color: var(--o-color-text1);
    }
  }
  .el-dialog__body {
    padding: var(--o-spacing-h2);
    padding-top: 0;
    max-height: 80vh;
    overflow-y: scroll;
    background-color: var(--o-color-bg2);
    &::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: var(--o-color-bg2);
    }

    &::-webkit-scrollbar {
      width: 6px;
      background-color: var(--o-color-bg2);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: var(--o-color-division1);
    }
  }
  .landscape-group {
    margin-top: var(--o-spacing-h2);
    overflow: hidden;
    h1 {
      &::before {
        content: '';
        display: block;
        height: 80px;
        margin-top: -80px;
        visibility: hidden;
      }
    }
  }
}
.slide-dialog {
  margin-top: 30vh;
  width: fit-content;
  .el-dialog__header {
    padding: 12px 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
.scene-item {
  .scene-name {
    margin-right: 10px;
    font-size: 14px;
    line-height: 22px;
  }
  .scene-desc {
    color: #999;
    font-size: 12px;
    line-height: 22px;
  }
}
.selected {
  .scene-desc {
    color: inherit;
  }
}
</style>
