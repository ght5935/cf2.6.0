/**
 * Created by Jason on 2018/4/4.
 */

import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Upload, Button, Icon, Progress, Select, DatePicker, InputNumber, message } from 'antd';
import SystemLayout from '../system/SystemLayout';
import ModalFaceView from '../../components/common/ModalFaceView';
import ExpandImgModal from '../../components/common/ExpandImgModal';
import { API_PREFIX } from '../../utils/constant';
import icon from '../../assets/icon.png';
import styles from './IndexPage.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Dragger = Upload.Dragger;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'search/cameraList'
    });
    this.props.dispatch({
      type: 'search/success',
      payload: {
        selectImg: '',
        cameraList: [],
        oriImg: '',
        clipImgs: [],
        selected: [],
        matchFt: [],
        btnloading: false,
        matchFtParams: {
          facetrackId: '',
          srcIds: '',
          startTime: '',
          endTime: '',
          threshold: 60
        }
      }
    });
  }

  handleChange1 = info => {
    this.props.dispatch({
      type: 'search/success',
      payload: {
        oriImg: '',
        clipImgs: [],
        selected: [],

      }

    });
    this.setState({
      loading: true
    });
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(info.file);
      this.setState({
        loading: false
      });
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        this.props.dispatch({
          type: 'search/success',
          payload: {
            oriImg: imageUrl
          }
        });
      }
      );
      const dst = info.file.response.result.dst;
      const selected = [];
      selected.push(dst[0]);
      this.props.dispatch({
        type: 'search/success',
        payload: {
          clipImgs: dst,
          selected
        }
      });
    } else if (info.file.status === 'error') {
      this.setState({
        loading: false
      });
      message.error(`${info.file.name}上传失败.`);
    }
  };
  onImgSelect = v => {
    const selected = [];

    selected.push(v);
    console.log(v.path);
    this.props.dispatch({
      type: 'search/success',
      payload: {
        selected
      }
    });
  };
  isSelected = path => {
    const sl = this.props.search.selected;
  
    if (sl.length <= 0) {
      return '';
    }
    if (sl[0].path === path) {
      console.log(path);
      return styles.active;
    }
    return '';
  };
  isCheckedIconShow = (path) =>{
    const sl = this.props.search.selected;

    if (sl.length <= 0) {
      return '';
    }
    if (sl[0].path === path) {
    
      return styles.cheacked;
    }
    return '';
  }
  onSubmit = () => {
    if (!this.props.search.selected || this.props.search.selected.length <= 0) {
      alert('至少上传一张人脸照片！');
      return;
    }
    this.props.dispatch({
      type: 'search/success',
      payload: {
        btnloading: true,
        matchFt: []
      }
    });

    const faceCount = this.props.search.selected.length;
    const imgNames = this.props.search.selected.map((value, i) => {
      const key = `img_path_${i + 1}`;
      const path = value.path;
      return { key, path };
    });
    const payload = {
      faceCount
    };
    imgNames.map((value, i) => payload[`${value.key}`] = value.path);

    this.props.dispatch({
      type: 'search/createFaceTrack',
      payload
    });
  };
  onCameraChange = v => {
    const matchFtParams = this.props.search.matchFtParams;
    this.props.dispatch({
      type: 'search/success',
      payload: {
        matchFtParams: {
          ...matchFtParams,
          srcIds: v
        }
      }
    });
  };
  onDateChange = (date, dateString) => {
    const matchFtParams = this.props.search.matchFtParams;
    console.log(date)
    let startTime = '';
    let endTime = '';
    if(date.length !== 0){
      startTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    this.props.dispatch({
      type: 'search/success',
      payload: {
        matchFtParams: {
          ...matchFtParams,
          startTime,
          endTime
        }
      }
    });
  };
  onThresholdChange = v => {
    const matchFtParams = this.props.search.matchFtParams;
    this.props.dispatch({
      type: 'search/success',
      payload: {
        matchFtParams: {
          ...matchFtParams,
          threshold: v
        }
      }
    });
  };
  onFaceCardClick = value => {
    console.log(value)
    this.props.dispatch({
      type: 'search/showModalFace',
      payload: {
        modalFaceData: value
      }
    });
  };
  closeModalFace = () => {
    this.props.dispatch({
      type: 'search/closeModalFace'
    });
  };
  showExpand = (value) => {
    this.props.dispatch({
      type:'search/success',
        payload: {
        expandModalVisiable: true,
            expandModalData: value,
            modalFaceVisible: false
        }
    })
  }
  onExpandCancel = () =>{
    this.props.dispatch({
        type:'search/success',
        payload: {
            expandModalVisiable: false,
            modalFaceVisible: true
        }
    })
}

  render() {
    return (
      <SystemLayout location={this.props.location} dispatch={this.props.dispatch}>
        <div className={styles.wrapper}>
          <div className={styles.background}>
            <div className={styles.searchTop}>
              <div className={styles.uploadArea}>
                <div className={styles.dragger}>
                  <Dragger
                      action={`${API_PREFIX}` + '/poi/uploadFace.do'}
                      name="image_1"
                      accept="image/jpeg"
                      showUploadList={false}
                      onChange={this.handleChange1}
                    >
                      <div className={styles.antUploadText}>
                        {this.props.search.oriImg ?
                          <img className={styles.oriImg} src={this.props.search.oriImg} alt=""/> :
                          <Icon type={this.state.loading ? 'loading' : 'plus'} className={styles.uploadIcon}/>}
                      </div>
                    </Dragger>
                  </div>
                
                <div className={styles.imgList}>
                  {this.props.search.clipImgs.length > 0 ? this.props.search.clipImgs.map((v, i) => {
                    if (i < 5) {
                      return <div className={styles.clipImgWapper}>
                      <img onClick={this.onImgSelect.bind(this, v)} className={`${styles.clipImg} ${this.isSelected(v.path)}`} src={v.url} alt=""/>
                      <i className={this.isCheckedIconShow(v.path)}></i>
                      </div>;
                    }
                  }) : ''}

                </div>
              </div>
              <div className={styles.search}>
                <div className={styles.searchExpress}>
                  <span className={styles.label}>摄像头名称：</span>
                  <Select style={{ width: '30%' }} value={this.props.search.matchFtParams.srcIds} onChange={this.onCameraChange}>
                    <Option value={''}>全部</Option>
                    {this.props.search.cameraList.length > 0 ? this.props.search.cameraList.map(v => <Option value={v.srcId}>{v.name}</Option>) : ''}
                  </Select>
                </div>
                <div className={styles.searchExpress}>
                  <span className={styles.label}>抓拍时间：</span>
                  <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime onChange={this.onDateChange} style={{ width: '50%' }}/>
                </div>
                <div className={styles.searchExpress}>
                  <span className={styles.label}>相似度：</span>
                  <InputNumber style={{ width: '30%', marginRight: '35%' }} value={this.props.search.matchFtParams.threshold} onChange={this.onThresholdChange}/>
                  <Button className={styles.searchBtn} type="primary" size="large" loading={this.props.search.btnloading} onClick={this.onSubmit}>查找</Button>
                </div>

              </div>
            </div>
            <div className={styles.matchList}>
              {this.props.search.matchFt.length > 0 ? this.props.search.matchFt.map(v => <div className={styles.matchItem} >
                <div className={styles.matchCard} onClick={this.onFaceCardClick.bind(this, v.ftInfoData)}>
                  <div className={styles.imgCard}>
                    <img src={v.ftInfoData.imgs.length > 0 ? v.ftInfoData.imgs[0] : ''} alt=""/>
                  </div>
                  <div>
                    <p>{v.ftInfoData.srcName}</p>
                    <p>{v.ftInfoData.captureTime}</p>
                    <Progress width="90%" percent={(v.percentValue * 100).toFixed(2)}/>
              
                  </div>
                </div>
              </div>) : ''}
            </div>
          </div>
          <ModalFaceView
          visible={this.props.search.modalFaceVisible} key={this.props.search.modalFaceData.id}
          data={this.props.search.modalFaceData} onClosed={this.closeModalFace} showExpand={this.showExpand}
        />
        <ExpandImgModal
                onCancel={this.onExpandCancel}
                visible={this.props.search.expandModalVisiable}
                data={this.props.search.expandModalData} />
        </div>

        

      </SystemLayout>
    );
  }


}
function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps)(IndexPage);
