import { request } from '@/shared/axios';

export interface FeedBackQueryT {
  feedbackPageUrl: string;
  feedbackText: string;
  feedbackValue: number;
}

/**
 * 文档中心满意度评分
 * @param {FeedBackQueryT} params
 * @returns {Promise<ResponseT>}
 */
export function postFeedback(params: FeedBackQueryT): Promise<{
  code: number;
  data: string;
  msg: string;
  update_at: string;
}> {
  return request
    .post('/query/nps?community=openeuler', params, {
      baseURL: '/api-dsapi',
    });
}
