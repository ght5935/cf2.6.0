/**
 * Created by Jason on 2018/4/8.
 */
import { createFacetrackByImg, matchFaceToFace, match2images } from '../services/face';
import { message } from 'antd';

export default {
  namespace: 'contrast',
  state: {
    facetrackId1: '',
    facetrackId2: '',
    btnLoading: false,
    match2ImageParams: {
      img_path_1:'',
      img_path_2:''
    }
  },
  effects: {
    * createFtByImg({ payload }, { put, call }) {
      const { data } = yield call(createFacetrackByImg, { faceCount: payload.faceCount, img_path_1: payload.img_path_1 });
      if (data && data.status == 0) {
        switch (payload.flag) {
          case 1:
            yield put({
              type: 'success',
              payload: {
                facetrackId1: data.result
              }

            });
            break;
          case 2:
            yield put({
              type: 'success',
              payload: {
                facetrackId2: data.result
              }

            });
            break;
        }
      }
    },
    * matchFaceToFace({ payload }, { put, call, select }) {
      const facetrackId1 = yield select(store => store.contrast.facetrackId1);
      const facetrackId2 = yield select(store => store.contrast.facetrackId2);
      const params = {
        facetrackId1,
        facetrackId2
      };
      if (!facetrackId1 || !facetrackId2) {
        message.error('请确认已选择两张人脸！');
        yield put({
          type: 'success',
          payload: {
            btnLoading: false
          }
        });
      }
      const { data } = yield call(matchFaceToFace, params);
      if (data && data.status == 0) {
        yield put({
          type: 'success',
          payload: {
            percent: data.result.percent,
            btnLoading: false
          }
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            btnLoading: false
          }
        });
        message.error('人脸比对失败！');
      }
    },
    * matchTwoImages ({payload}, {put, call, select}){
      const params = yield select(store => store.contrast.match2ImageParams);
      if (!params.img_path_1 || !params.img_path_2) {
        message.error('请确认已选择两张人脸！');
        yield put({
          type: 'success',
          payload: {
            btnLoading: false
          }
        });
      }
      const {data} = yield call(match2images, params);
      if(data && data.status === 0){
        yield put({
          type: 'success',
          payload: {
            percent: data.result.percent,
            btnLoading: false
          }
        });
      }else {
        yield put({
          type: 'success',
          payload: {
            btnLoading: false
          }
        });
        message.error('人脸比对失败！');
      }
    }
  },
  reducers: {
    success(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
