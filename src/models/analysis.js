/**
 * Created by Jason on 2017/7/20.
 */
import { allTrafficStatistics, getCamerCaptureFtCount, getCamerCaptureAmCount } from '../services/analysis';

export default {
  namespace: 'analysis',
  state: {
    trafficStatisticsData: {
      facetrackCount: [],
      alarmCount: []
    },

    cameraFaceData: [],
    cameraCameraData: []
  },
  sunscriptions: {},
  effects: {
    * allTrafficStatistics({ payload }, { put, call }) {
      const { data } = yield call(allTrafficStatistics, payload);

      if (data && data.status === 0) {
        const facetrackCount = data.result.facetrackCount;
        const alarmCount = data.result.alarmCount;
        yield put({
          type: 'success',
          payload: {
            trafficStatisticsData: {
              facetrackCount,
              alarmCount
            }
          }
        });
      }
    },

    * getCamerCaptureFtCount({ payload }, { put, call }) {
      const { data } = yield call(getCamerCaptureFtCount, payload);
      if (data && data.status === 0) {
        const { result } = data;
        yield put({
          type: 'success',
          payload: {
            cameraFaceData: result
          }
        });
      }
    },
    * getCamerCaptureAmCount({ payload }, { put, call }) {
      const { data } = yield call(getCamerCaptureAmCount, payload);
      if (data && data.status === 0) {
        const { result } = data;
        yield put({
          type: 'success',
          payload: {
            cameraCameraData: result
          }
        });
      }
    }
  },
  reducers: {
    success(state, action) {
      const data = { ...state, ...action };
      return { ...state, ...action.payload };
    }
  }
};
