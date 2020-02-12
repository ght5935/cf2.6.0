/**
 * Created by Jason on 2017/7/20.
 */
import request from '../utils/request';
import {API_PREFIX, toQueryString} from '../utils/constant';

export async function allTrafficStatistics(params) {
  return request(API_PREFIX + '/analysis/count.do?'+toQueryString(params))
}
export async function getCamerCaptureFtCount(params) {
  return request(API_PREFIX + '/analysis/getCamerCaptureFtCount.do?'+toQueryString(params))
}
export async function getCamerCaptureAmCount(params) {
  return request(API_PREFIX + '/analysis/getCamerCaptureAmCount.do?'+toQueryString(params))
}

