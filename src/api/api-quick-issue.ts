import { request } from '@/shared/axios';
import type { AxiosResponse } from '@/shared/axios';
import { IssueQueryData } from '@/shared/@types/type-quick-issue';

/**
 * 获取issue 数据
 * @name getRepoIssue
 * @return {Array}
 */
export function getRepoIssue(params: IssueQueryData) {
  const url = '/api-issues/issues/';
  params = JSON.parse(JSON.stringify(params));
  if (
    typeof params.label === 'object' &&
    typeof params.issue_state === 'object' &&
    typeof params.exclusion === 'object' &&
    typeof params.milestone === 'object'
  ) {
    params.exclusion = params.exclusion.join(',');
    params.label = params.label.join(',');
    params.issue_state = params.issue_state.join(',');
    params.milestone = params.milestone.join(',');
  }
  return request
    .get(url, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * 获取筛选条件
 * @name getRepoIssue
 * @return {Array}
 */
export function getIssueSelectOption(type: string, params: object | null) {
  type === 'exLabels' ? (type = 'labels') : '';
  const url = `/api-issues/issues/${type}`;
  return request
    .get(url, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}

/**
 * 上传 issue 图片
 * @name uploadIssueImage
 * @return {String}
 */
export function uploadIssueImage(params: object) {
  const url = '/api-issues/image/';
  return request
    .post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}

/**
 * issue 提交邮箱验证
 * @name getRepoIssue
 * @return {String}
 */
export function verifySubmitterEmail(params: object) {
  const url = '/api-issues/verify/';
  return request
    .post(url, params)
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * sig仓库查找
 * @name getRepoIssue
 * @return {String}
 */
export function getReposData(params: object) {
  const url = `/api-issues/repos/`;
  return request
    .get(url, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * 创建issue
 * @name getRepoIssue
 * @return {String}
 */
export function createIssue(params: object) {
  const url = `/api-issues/issues/`;
  return request
    .post(url, params)
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}

/**
 * 上传 文件
 * @name uploadFile
 * @return {String}
 */
export function uploadIssueFile(params: object) {
  const url = '/api-issues/attachment/';
  return request
    .post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * 获取pull 数据
 * @name getLabelColors
 * @return {Array}
 */
export function getLabelColors() {
  const url = '/api-issues/colors';
  return request
    .get(url)
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * 获取pull 数据
 * @name getRepoPull
 * @return {Array}
 */
export function getRepoPull(params: any) {
  const url = '/api-issues/pulls';
  params = JSON.parse(JSON.stringify(params));
  if (typeof params.label === 'object' && typeof params.state === 'object') {
    params.label = params.label.join(',');
    params.state = params.state.join(',');
    params.exclusion = params.exclusion.join(',');
  }
  return request
    .get(url, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
/**
 * 获取筛选条件
 * @name getPrSelectOption
 * @return {Array}
 */
export function getPrSelectOption(type: string, params: object | null) {
  type === 'exLabels' ? (type = 'labels') : '';
  const url = `/api-issues/pulls/${type}`;
  return request
    .get(url, { params })
    .then((res: AxiosResponse) => res.data)
    .catch((e: any) => {
      throw new Error(e);
    });
}
