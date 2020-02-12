/**
 * Created by Riky on 2017/4/7.
 */

import {
  poiList,
  poiDetail,
  bindFaceTrack,
  bindFaceTracks,
  addByUpload,
  addByFaceTrack,
  faceDetail,
  matchFacetrack2Person,
  matchPerson2Facetrack,
  getMatchedFacetrackByTransId,
  getMatchedPersonByTransId,
  MatchLocus
} from '../services/system';
import { cameraListAll } from '../services/camera';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { SEARCH_FACE_PAGE_SIZE, SEARCH_POI_PAGE_SIZE } from '../utils/constant';
import { groupList, faceList, getFaceToFaceResult, matchFacetrackToFacetrack, createFacetrackByImg } from '../services/face';

export default {
  namespace: 'search',
  state: {
    loading: true,
    errorMsg: '',
    confirmModalVisible: false,
    matchFaceProcessed: false,
    matchPoiProcessed: false,
    remindControl: 'none',
    matchFtParams: {
      facetrackId: '',
      srcIds: '',
      startTime: '',
      endTime: '',
      threshold: 60
    },
    getFtResultParams: {
      transId: '',
      facetrackId: ''
    },
    uploadImgs: [],
    dstArr: [],
    ftImgs: [],
    ftProcessed: false,
    btnloading: false,
    matchFt: [],
    expandModalVisiable: false,
    expandModalData: {},
    modalFaceVisible: false,
    modalFaceData: {},
    selectImg: '',
    cameraList: [],
    oriImg: '',
    clipImgs: [],
    selected: [],
    modalFaceVisible: false
  },
  subscriptions: {},
  effects: {
    * groupList({ payload }, { put, call }) {
      const { data } = yield call(groupList);
      if (data && data.status == 0) {
        yield put({
          type: 'success',
          payload: {
            groupList: data.result
          }
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * addByUpload({ payload }, { put, call }) {
      const { data } = yield call(addByUpload, payload);
      if (data && data.status == 0) {
        const router = `/search/new/person2face/${data.result}`;
        yield put(routerRedux.push(router));
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * faceList({ payload }, { put, call }) {
      const { pageNo, pageSize, srcId, startTime, endTime, personId } = payload;
      const { data } = yield call(faceList, {
        pageSize: pageSize || SEARCH_FACE_PAGE_SIZE,
        pageNo: pageNo || 1,
        srcId: srcId || '',
        startTime: startTime || '',
        endTime: endTime || '',
        personId: personId || ''
      });

      if (data && data.status == 0) {
        yield put({
          type: 'success',
          payload: {
            faceList: {
              list: data.result.list,
              page: data.result.page
            },
            loading: false,
            remindControl: data.result.list ? 'none' : 'block'
          }
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * poi({ payload }, { put, call }) {
      const { data } = yield call(poiDetail, payload);
      if (data && data.status == 0) {
        yield put({
          type: 'success',
          payload: {
            poi: data.result
          }
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * matchPerson2Facetrack({ payload }, { put, call, select }) {
      console.log('matchPerson2Facetrack');
      yield put({
        type: 'success',
        payload: {
          remindControl: 'block'
        }
      });

      const { data } = yield call(matchPerson2Facetrack, payload);
      if (data && data.status == 0) {
        const delay = timeout => new Promise(resolve => {
          setTimeout(resolve, timeout);
        });
        const transactionId = data.result;
        yield call(delay, 2000);
        let search = yield select(state => state.search);
        let processed = search.matchFaceProcessed;

        let entend = false;

        while ((!processed) && (!entend)) {
          yield call(delay, 1000);
          const matchResult = yield call(getMatchedFacetrackByTransId, { transactionId, personId: payload.personId });

          if (matchResult.data && matchResult.data.status == 0) {
            const loading = !matchResult.data.result.processed;

            if (matchResult.data.result.processed) {
              processed = matchResult.data.result.processed;
              yield put({
                type: 'success',
                payload: {
                  matchedFaceList: matchResult.data.result.list,
                  loading: false,
                  matchFaceProcessed: processed,
                  remindControl: matchResult.data.result.list && matchResult.data.result.list.length > 0 ? 'none' : 'block'
                }
              });
              if (matchResult.data.result.list) {
                yield put({
                  type: 'success',
                  payload: {
                    remindControl: matchResult.data.result.list && matchResult.data.result.list.length > 0 ? 'none' : 'block'
                  }
                });
              }
            } else {
              yield call(delay, 1500);
              search = yield select(state => state.search);
              processed = search.matchFaceProcessed;
            }
          } else {
            yield put({
              type: 'success',
              payload: {
                matchedFaceList: '',
                loading: false,
                matchFaceProcessed: true
              }
            });
            entend = true;
          }
        }
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },

    * closedConfirmModal({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          confirmModalVisible: false
        }
      });
    },
    * showConfirmModal({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          confirmModalVisible: true
        }
      });
    },
    * poiList({ payload }, { put, call }) {
      const { pageNo, pageSize, groupId, name, gender, startTime, endTime, identityCard } = payload;
      const { data } = yield call(poiList, {
        pageSize: pageSize || SEARCH_POI_PAGE_SIZE,
        pageNo: pageNo || 1,
        groupId: groupId || '',
        name: name || '',
        gender: gender || '',
        startTime: startTime || '',
        endTime: endTime || '',
        identityCard: identityCard || ''
      });
      if (data && data.status == 0) {
        yield put({
          type: 'success',
          payload: {
            poiList: {
              list: data.result.list,
              page: data.result.page
            },
            loading: false,
            remindControl: data.result.list ? 'none' : 'block'
          }
        });
      }
    },
    * relateFace({ payload }, { put, call }) {
      const { data } = yield call(bindFaceTracks, payload);
      yield put({
        type: 'success',
        payload: {
          confirmModalVisible: false,
          loading: true,
          matchedFaceList: null
        }
      });
      if (data && data.status == 0) {
        const transactionResult = yield call(matchPerson2Facetrack, payload);

        if (transactionResult.data && transactionResult.data.status == 0) {
          const transactionId = transactionResult.data.result;
          let processed = false;
          let error = false;
          const delay = timeout => new Promise(resolve => {
            setTimeout(resolve, timeout);
          });

          while (!processed && (!error)) {
            yield call(delay, 1000);
            const matchResult = yield call(getMatchedFacetrackByTransId, { transactionId, personId: payload.personId });
            if (matchResult.data && matchResult.data.status == 0) {
              processed = matchResult.data.result.processed;
              yield put({
                type: 'success',
                payload: {
                  matchedFaceList: matchResult.data.result.list,
                  // confirmModalVisible: false,
                  loading: !processed
                }
              });
              if (matchResult.data.result.list) {
                yield put({
                  type: 'success',
                  payload: {
                    remindControl: matchResult.data.result.list && matchResult.data.result.list.length > 0 ? 'none' : 'block'
                  }
                });
              } else {
                // 不作处理,继续轮询
              }
            } else {
              error = true;
              yield put({
                type: 'success',
                payload: {
                  errorMsg: data.message,
                  confirmModalVisible: false,
                  loading: false
                }
              });
            }
          }
        } else {
          yield put({
            type: 'success',
            payload: {
              errorMsg: data.message,
              confirmModalVisible: false,
              loading: false
            }
          });
        }
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message,
            confirmModalVisible: false
          }
        });
      }
    },
    * matchFaceTrack2Person({ payload }, { put, call, select }) {
      const { data } = yield call(matchFacetrack2Person, payload);
      console.log('matchFaceTrack2Person');
      if (data && data.status == 0) {
        const delay = timeout => new Promise(resolve => {
          setTimeout(resolve, timeout);
        });

        const transactionId = data.result;
        yield call(delay, 1500);
        let search = yield select(state => state.search);
        let processed = search.matchPoiProcessed;
        let entend = false;

        while ((!processed) && (!entend)) {
          yield call(delay, 1000);
          const matchResult = yield call(getMatchedPersonByTransId, { transactionId, facetrackId: payload.facetrackId });

          if (matchResult.data && matchResult.data.status == 0) {
            const loading = !matchResult.data.result.processed;

            if (matchResult.data.result.processed) {
              processed = matchResult.data.result.processed;
              yield put({
                type: 'success',
                payload: {
                  matchedPoiList: matchResult.data.result.list,
                  loading: false,
                  matchPoiProcessed: processed
                }
              });
              if (matchResult.data.result.list) {
                yield put({
                  type: 'success',
                  payload: {
                    remindControl: matchResult.data.result.list && matchResult.data.result.list.length > 0 ? 'none' : 'block'
                  }
                });
              } else {
                // 不作处理,继续轮询
              }
            } else {
              yield call(delay, 1500);
              search = yield select(state => state.search);
              processed = search.matchPoiProcessed;
            }
          } else {
            yield put({
              type: 'success',
              payload: {
                matchedPoiList: '',
                loading: false,
                matchPoiProcessed: true,
                errorMsg: data.message
              }
            });
            entend = true;
          }
          // entend = true;
        }
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message,
            loading: false
          }
        });
      }
    },
    * face({ payload }, { put, call }) {
      const { data } = yield call(faceDetail, payload);
      if (data && data.status == 0) {
        const { result } = data;
        yield put({
          type: 'success',
          payload: {
            faceDetail: result.ftInfoData
          }
        });
        if (result.bind) {
          yield put(routerRedux.push(`/search/face/person2face/${result.personId}`));
        }
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * bindFaceTrack({ payload }, { put, call }) {
      const { data } = yield call(bindFaceTrack, payload);
      if (data && data.status == 0) {
        yield put(routerRedux.push(`/search/face/person2face/${payload.personId}`));
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * addByFaceTrack({ payload }, { put, call }) {
      const { data } = yield call(addByFaceTrack, payload);
      if (data && data.status == 0) {
        const { result } = data;
        yield put(routerRedux.push(`/search/face/person2face/${result}`));
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data.message
          }
        });
      }
    },
    * cameraList({ payload }, { put, call }) {
      const { data } = yield call(cameraListAll, payload);
      if (data && data.status == 0) {
        const { result } = data;
        if (result && result.length > 0) {
          const cameraList = result;
          yield put({
            type: 'success',
            payload: {
              cameraList
            }
          });
        }
      }
    },
    * spinLoading({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          loading: true
        }
      });
    },
    * clearMatch({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          matchedPoiList: '',
          matchedFaceList: ''
        }
      });
    },
    * clearErrorMsg({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          errorMsg: ''
        }
      });
    },
    * cleanFaceList({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          faceList: ''
        }
      });
    },
    * cancelMatch({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          matchFaceProcessed: true,
          matchPoiProcessed: true
        }
      });
    },
    * resetMatch({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          matchFaceProcessed: false,
          matchPoiProcessed: false
        }
      });
    },
    * personMatchLocus({ payload }, { put, call }) {
      // const {data} = yield call(MatchLocus, payload);
      // if (data && data.status == 0) {
        // const {result} = data;
        // if (result && result.length > 0) {
        //   let cameraList = result;
        //   yield put({
        //     type: 'success',
        //     payload: {
        //       cameraList
        //     }
        //   })
        //
        // }
      // }
      const data = {
        status: 0,
        message: 'success',
        result: {
          longitude: '121',
          latitude: '35',
          map: [
            {
              'title': '123',
              'content': '11111111',
              'point': '121|35',
              isOpen: 0,
              icon: {
                'w': 28,
                'h': 34,
                'l': 0,
                't': 0,
                'x': 6,
                'lb': 5
              }
            },
            {
              'title': '234',
              'content': '222',
              'point': '121.22|35.33',
              isOpen: 0,
              icon: {
                'w': 28,
                'h': 34,
                'l': 0,
                't': 0,
                'x': 6,
                'lb': 5
              }
            },
            {
              'title': '345',
              'content': '333',
              'point': '121.32|35.43',
              isOpen: 0,
              icon: {
                'w': 28,
                'h': 34,
                'l': 0,
                't': 0,
                'x': 6,
                'lb': 5
              }
            }
          ]
        }
      };

      if (data && data.status == 0) {
       // const {result} = data;
        yield put({
          type: 'success',
          payload: {
            locusList: data.result
          }
        });
      }
    },
    * getFaceToFaceResult({ payload }, { put, call, select }) {
      // params {transId, facetrackId}
      const delay = timeout => new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
      const params = yield select(store => store.search.getFtResultParams);
      let ftProcessed = yield select(store => store.search.ftProcessed);

      while (!ftProcessed) {
        ftProcessed = yield select(store => store.search.ftProcessed);
        console.log(ftProcessed);
        yield call(delay, 1000);
        const { data } = yield call(getFaceToFaceResult, params);
        if (data && data.status === 0) {
          const { result } = data;
          console.log(result);
          yield put({
            type: 'success',
            payload: {
              ftProcessed: result.processed,
              matchFt: result.list ? result.list : []
            }
          });
        } else {
          yield put({
            type: 'success',
            payload: {
              ftProcessed: true,
              btnloading: false
            }
          });
        }
      }
      yield put({
        type: 'success',
        payload: {
          btnloading: false
        }
      });
      const matchFt = yield select(store => store.search.matchFt);
      if( !matchFt || matchFt.length <= 0 ){
        yield put({
          type: 'success',
          payload: {
            matchFt: []
          }
        })
        message.error('无匹配结果！');
      }
      // if (matchFt.length > 0) {
      //   const cameraList = yield select(store => store.search.cameraList);
      //   matchFt.map(v => {
      //     if (cameraList.indexOf({ srcId: v.ftInfoData.srcId, srcName: v.ftInfoData.srcName }) === -1) {
      //       cameraList.push({ srcId: v.ftInfoData.srcId, srcName: v.ftInfoData.srcName });
      //     }
      //   });
      //   yield put({
      //     type: 'success',
      //     payload: {
      //       cameraList
      //     }
      //   });
      // } else {
      //   message.error('无匹配结果！');
      // }
    },
    * matchFacetrackToFacetrack({ payload }, { put, call, select }) {
          // params {facetrackId:"",srcIds:"",startTime:"",endTime:"" ,threshold:60}
      const params = yield select(store => store.search.matchFtParams);
      const getFtResultParams = yield select(store => store.search.getFtResultParams);
      const { data } = yield call(matchFacetrackToFacetrack, params);
      if (data && data.status === 0) {
        const { result } = data;
        yield put({
          type: 'success',
          payload: {
            getFtResultParams: {
              ...getFtResultParams,
              transId: result,
              facetrackId: params.facetrackId
            }
          }
        });
        yield put({
          type: 'getFaceToFaceResult'
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            ftProcessed: false,
            btnloading: false
          }
        });
      }
    },
    * createFaceTrack({ payload }, { put, call, select }) {
      const matchFtParams = yield select(store => store.search.matchFtParams);
      yield put({
        type: 'success',
        payload: {
          ftProcessed: false,
          btnloading: true
        }
      });
      const { data } = yield call(createFacetrackByImg, payload);
      if (data && data.status == 0) {
        const { result } = data;
        yield put({
          type: 'success',
          payload: {
            matchFtParams: {
              ...matchFtParams,
              facetrackId: result
            }
          }
        });
        yield put({
          type: 'matchFacetrackToFacetrack'
        });
      } else {
        yield put({
          type: 'success',
          payload: {
            errorMsg: data ? data.message : ''
          }
        });
      }
    },
    * closeModalFace({ payload }, { put }) {
      yield put({
        type: 'success',
        payload: {
          modalFaceVisible: false,
          modalFaceData: {}
        }
      });
    },
    * showModalFace({ payload }, { put }) {
    const { modalFaceData } = payload;
    const snapImg = modalFaceData.snapImg;
    yield put({
      type: 'success',
      payload: {
        modalFaceVisible: true,
        modalFaceData,
        snapImg
      }
    });
  },
  },
  reducers: {
    success(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
