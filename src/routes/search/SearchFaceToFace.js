/**
 * Created by Jason on 2018/4/10.
 */

import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Select, Progress } from 'antd';
import MayLayout from '../../components/common/MainLayout';
import ModalFaceView from '../../components/common/ModalFaceView';
import styles from './IndexPage.css';
import title from '../../style/common/title.css';

const Option = Select.Option;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }
  goBack = () => {
    this.props.dispatch(routerRedux.goBack());
  };
  showDetail = v => {
    this.props.dispatch({
      type: 'search/success',
      payload: {
        modalFaceVisible: true,
        modalFaceData: v
      }
    });
  };
  closeModalFace = () => {
    this.props.dispatch({
      type: 'search/closeModalFace'
    });
  };
  showExpand = value => {
    this.props.dispatch({
      type: 'search/success',
      payload: {
        expandModalVisiable: true,
        expandModalData: value,
        modalFaceVisible: false
      }
    });
  };

  render() {
    return (
      <MayLayout location={this.props.location}>
        <div className={styles.wrapper}>
          <div className={styles.contain}>
            <div className={title.container}>
              <span className={title.text}>人脸筛查详情</span>
            </div>
            <div className={styles.match}>
              <div className={styles.matchtop}>
                <img
                  src={this.props.search.selectImg.url}
                  className={styles.backImg}
                  title="返回上一页"
                  onClick={this.goBack}
                  alt=""
                />
                <div className={styles.searchBar}>
                  <span className={styles.searchbarLabel}>摄像头名称：</span>
                  <Select style={{ width: 220 }}>
                    {this.props.search.cameraList.length > 0 ?
                                                    this.props.search.cameraList.map(v =>
                                                      <Option value={v.srcId}>{v.srcName}</Option>) : ''}
                  </Select>
                </div>
              </div>
              <div className={styles.matchDown}>
                <div className={title.container}>
                  <span className={title.text}>筛查结果</span>
                </div>
                <div className={styles.matchList}>
                  {this.props.search.matchFt.length > 0 ? this.props.search.matchFt.map(v => (
                    <div className={styles.matchItem} >
                        <div className={styles.matchCard} onClick={this.showDetail.bind(this, v)}>
                            <div className={styles.imgCard}>
                                    <img src={v.ftInfoData.imgs ? v.ftInfoData.imgs[0] : ''} alt=""/>
                                  </div>
                            <div>
                                    <p>{v.ftInfoData.srcName ? v.ftInfoData.srcName : ''}</p>
                                    <p>{v.ftInfoData.captureTime ? v.ftInfoData.captureTime : ''}</p>
                                    <p><Progress percent={(v.matchValue * 100).toFixed(2)}/></p>
                                  </div>
                          </div>
                      </div>
                                                )) : ''}
                </div>
              </div>
            </div>
          </div>

        </div>
        <ModalFaceView
          visible={this.props.search.modalFaceVisible} key={this.props.search.modalFaceData.id}
          data={this.props.search.modalFaceData && this.props.search.modalFaceData.ftInfoData ?
                                    this.props.search.modalFaceData.ftInfoData : ''} onClosed={this.closeModalFace} showExpand={this.showExpand}
        />
      </MayLayout>
    );
  }


}
function mapStateToProps({ search }) {
  return { search };
}

export default connect(mapStateToProps)(IndexPage);

