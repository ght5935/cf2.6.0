/**
 * Created by Riky on 2017/3/3.
 */
import React from 'react';
import {connect} from 'dva';

import {Button, DatePicker, Row, Col, Select, InputNumber} from 'antd';

const {RangePicker} = DatePicker;
import ModalPersonTableView from './ModalPersonTableView';


import styles from './SearchBarView.css';


/**
 *
 *
 * props 传入的属性
 *
 * className
 * showModalCameraTree
 * closeModalCameraTree
 * showModalPersonTable
 * closeModalPersonTable
 * modalCameraTreeVisible
 * modalPersonTableVisible
 *
 *
 */


class SearchBarView extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchBtnClick = this.onSearchBtnClick.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onCameraClick = this.onCameraClick.bind(this);
    this.onGroupClick = this.onGroupClick.bind(this);
    this.state = {
      startPercent: 0,
      endPercent: 1
    }

  }
   onSearchBtnClick() {
    // let payload;
    // if (this.state) {
    //   payload = {
    //     srcId: this.state.srcId ? this.state.srcId : '',
    //     startTime: this.state.startTime ? this.state.startTime : '',
    //     endTime: this.state.endTime ? this.state.endTime : '',
    //     startPercent: this.state.startPercent,
    //     endPercent: this.state.endPercent,
    //     groupId: this.state.groupId ? this.state.groupId : ''
    //   }
    // } else {
    //   payload = {};
    // }
    this.props.onSubmit();
  }

  onTimeChange = (date, dateString) => {
    const getFaceListParams = this.props.face.getFaceListParams;
    this.props.dispatch({
      type:'face/success',
      payload: {
        getFaceListParams: {
          ...getFaceListParams,
          startTime: date[0],
          endTime: date[1]
        }
    }
    })
    // this.setState({
    //   startTime: dateString[0],
    //   endTime: dateString[1]
    // });
  };

  onCameraClick = (value) => {
    // this.setState({
    //   srcId: value
    // });
    if(value == undefined){
      value = ''
    }
    const getFaceListParams = this.props.face.getFaceListParams;
    this.props.dispatch({
      type:'face/success',
      payload: {
        getFaceListParams: {
          ...getFaceListParams,
          srcId: value
        }
    }
    })
  };
  onGroupClick = (value) => {
    const getFaceListParams = this.props.face.getFaceListParams;
    this.props.dispatch({
      type:'face/success',
      payload: {
        getFaceListParams: {
          ...getFaceListParams,
          groupId: value
        }
    }
    })
    // this.setState({
    //   groupId: value
    // });
  };

  onStartPercentChange = (value) => {
    const getFaceListParams = this.props.face.getFaceListParams;
    console.log(value);
    if(value === undefined){
      console.log('..........')
    }

    this.props.dispatch({
      type:'face/success',
      payload: {
        getFaceListParams: {
          ...getFaceListParams,
          startPercent: value
        }
    }
    })
    // this.setState({
    //   startPercent: parseFloat(value / 100)
    // });
  };

  onEndPercentChange = (value) => {
    const getFaceListParams = this.props.face.getFaceListParams;
    this.props.dispatch({
      type:'face/success',
      payload: {
        getFaceListParams: {
          ...getFaceListParams,
          endPercent: value
        }
    }
    })
    // this.setState({
    //   endPercent: parseFloat(value / 100)
    // });
  };


  renderThreshold = () => {

    return (<Col span={6} className={styles.condition}>
      <div className={styles.conditionTitle}>识别率:</div>
      <InputNumber className={styles.inputNumber} value={this.props.face.getFaceListParams.startPercent} size="large" min={0} max={99} onChange={this.onStartPercentChange}/>
      <span className={styles.split}>~</span>
      <InputNumber className={styles.inputNumber} value={this.props.face.getFaceListParams.endPercent}  size="large" min={1} max={100} onChange={this.onEndPercentChange}/>
    </Col>)
  };

  renderGrouping = () => {
    return (
      <Col span={6} className={styles.condition}>
        <div className={styles.conditionTitle}>人员分组:</div>
        <Select className={styles.prefixInput} size="large" allowClear onChange={this.onGroupClick}>
          { this.props.groupList ? this.props.groupList.map((value, i) => <Select.Option key={i}
                                                                                         value={value.id + ''}>{value.name}</Select.Option>) : null}
        </Select>
      </Col>

    )
  };

  render() {

    return (
      <Row className={this.props.className ? `${this.props.className} ${styles.main}` : styles.main}>

        <Col span={6} className={styles.condition}>
          <div className={styles.conditionTitle}>摄像头:</div>
          <Select className={styles.prefixInput} size="large" value={this.props.face.getFaceListParams.srcId} allowClear onChange={this.onCameraClick}>
            { this.props.cameraList ? this.props.cameraList.map((value, i) => <Select.Option key={i}
                                                                                             value={value.srcId + ''}>{value.name}</Select.Option>) : null}
          </Select>
        </Col>

        <Col span={6} className={styles.condition}>
          <div className={styles.conditionTitle}>时间:</div>
            <RangePicker className={styles.prefixInput}
                         showTime 
                         value={[this.props.face.getFaceListParams.startTime, this.props.face.getFaceListParams.endTime]} 
                         format="YYYY-MM-DD HH:mm:ss" 
                         size="large"
                         style={{width: 342}}
                         onChange={this.onTimeChange}/>
        </Col>

        {this.props.showThreshold ? this.renderThreshold() : null}

        <Col span={5} className={styles.condition}>
          <Button onClick={this.onSearchBtnClick}>查询</Button>
        </Col>


        {/* <ModalPersonTableView modalVisible={this.props.modalPersonTableVisible}
         onCancel={this.onModalCanceled} onSelect={this.onModalSelected}/>*/}

      </Row>
    )

  }
}

function mapStateToProps({face}){
  return {face}
}

export default connect(mapStateToProps)(SearchBarView);






