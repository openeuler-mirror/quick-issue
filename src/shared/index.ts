import { Base64 } from 'js-base64';
import { ElMessage } from 'element-plus';

import { uploadIssueImage } from '@/api/api-quick-issue';

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
