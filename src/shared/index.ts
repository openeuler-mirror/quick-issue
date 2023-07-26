import { Base64 } from 'js-base64';
import { ElMessage } from 'element-plus';
import i18n from '@/i18n';
import { reactive } from 'vue';

import { uploadIssueImage } from '@/api/api-quick-issue';

// 提交issue相关

const { t } = i18n.global;

export function getUrlParam(paraName: string) {
  const url = document.location.toString();
  const arrObj = url.split('?');
  if (arrObj.length > 1) {
    const arrPara = Base64.decode(arrObj[1]).split('&');
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');
      if (arr !== null && arr[0] === paraName) {
        return arr[1];
      }
    }
    return '';
  } else {
    return '';
  }
}
export async function handleUploadImage(
  event: Event,
  insertImage: any,
  files: [File]
) {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const file = files[0];
  if (file.size / 1024 / 1024 > 2) {
    ElMessage({
      message: '不支持2MB以上图片上传',
      type: 'error',
    });
    return;
  }

  const formData = new FormData();
  let url = '';
  formData.append('file', file);
  await uploadIssueImage(formData).then((res) => {
    if (res.code === 200 && res.data?.url) {
      url = res.data?.url;
      insertImage({
        url: url,
        desc: '输入图片说明',
      });
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      });
    }
  });
}

export function statisticalPoint(jump_url: string, quick_issue_email: string) {
  const sensors = (window as any)['sensorsDataAnalytic201505'];
  sensors?.setProfile({
    profileType: 'noGiteeCreateIssue',
    ...((window as any)['sensorsCustomBuriedData'] || {}),
    $utm_source: 'quick_issue',
    jump_url,
    quick_issue_email,
  });
}

//
export const rules: any = reactive({
  title: [
    {
      required: true,
      message: t('quickIssue.MANDATORY1'),
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: t('quickIssue.TITLE_LIMIT'),
      trigger: 'blur',
    },
  ],
  issue_type_id: [
    {
      required: true,
      message: t('quickIssue.MANDATORY1'),
      trigger: 'change',
    },
  ],
  repo: [
    {
      required: true,
      message: t('quickIssue.MANDATORY1'),
      trigger: 'change',
    },
  ],
  privacy: [],
  email: [],
  code: [],
});
export const privacyRules = [
  {
    required: true,
    message: t('quickIssue.MANDATORY1'),
    trigger: 'change',
  },
];
export const emailRules = [
  {
    required: true,
    message: t('quickIssue.EMAIL_ADRESS'),
    trigger: 'change',
  },
  {
    pattern: new RegExp(
      '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
    ),
    message: t('quickIssue.RIGHT_EMAIL_ADRESS'),
    trigger: 'change',
  },
];
export const codeRules = [
  {
    required: true,
    message: t('quickIssue.VER_CODE'),
    trigger: 'blur',
  },
  {
    pattern: /^\d{6}$/,
    message: t('quickIssue.VER_CODE1'),
    trigger: 'blur',
  },
];
