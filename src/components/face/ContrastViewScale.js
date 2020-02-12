/**
 * Created by Jason on 2018/3/21.
 */
/**
 * Created by Riky on 2017/3/22.
 */

import React from 'react';

import { StyleSheet, css } from 'aphrodite';
import ImgView from '../common/ImgView';

import { Row, Card, Progress, Modal } from 'antd';
import { Link } from 'dva/router';

const styles = StyleSheet.create({
  modalBody: {
    '>div': {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      border: '1px solid #3d515d',
      background: '#232c31'
    }
  },
  container: {
    width: 855,
    height: 513,
    border: '1px solid #36464F',
    background: '#151a20',
    position: 'relative',
    padding: 21
  },
  faceCard: {
    fontSize: 15,
    width: 328.5,
    height: 444,
    float: 'left',
    background: '#33444e',
    color: '#ffffff',
    border: 0,
    marginTop: 13.5
  },
  faceDate: {
    fontFamily: 'Arial Bold',
    position: 'absolute',
    bottom: 2
  },
  img: {
    width: '100%',
    margin: '0 auto'
  },
  percent: {
    width: 150,
    float: 'left',
    height: 444,
    background: '#151a20',
    marginTop: 13.5,
    position: 'relative'
  },
  circle: {
    position: 'relative',
    left: 40,
    top: 120
  },
  text: {
    position: 'relative',
    fontFamily: 'SimHei',
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    top: 150
  },
  photoContrast: {
    width: 78,
    height: 36,
    position: 'absolute',
    fontFamily: 'SimHei',
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    bottom: 0,
    left: 12,
    background: '#339a99',
    border: '1px solid #339a99',
    borderRadius: 6
  }

});


const ContrastViewScale = ({ face, className, style, visible, onCancel }) => {
  function contrastPerson(face) {
    if (face.judgePerson) {
      return (
        <Card className={css(styles.faceCard)} bodyStyle={{ padding: 5 }}>
          {face && face.judgePerson ? <ImgView src={face.judgePerson} className={css(styles.img)}/> : null}
          <div>
            <p>{face && face.judgePerson && face.judgePerson.name ? face.judgePerson.name : null}</p>
            <p className={css(styles.faceDate)}>{face && face.judgePerson && face.judgePerson.identityCard ? face.judgePerson.identityCard : face.judgePerson.gmtCreate}</p>
          </div>
        </Card>
      );
    } else if (face.mostPerson) {
      return (
        <Card className={css(styles.faceCard)} bodyStyle={{ padding: 5 }}>
          {face && face.mostPerson ? <ImgView src={face.mostPerson} className={css(styles.img)}/> : null}
          <div>
            <p>{face && face.mostPerson && face.mostPerson.name ? face.mostPerson.name : null}</p>
            <p className={css(styles.faceDate)}>{face && face.mostPerson && face.mostPerson.identityCard ? face.mostPerson.identityCard : face.mostPerson.gmtCreate}</p>
          </div>
        </Card>
      );
    }
    return (
      <Card className={css(styles.faceCard)} bodyStyle={{ padding: 5 }}>
        <div>
          <p />
          <p />
        </div>
      </Card>
    );
  }


  return (
    <Modal
      visible={visible}
      title=""
      footer=""
      closable={false}
      onOk={() => onClosed()}
      onCancel={() => onCancel()}
      width={855}
      className={css(styles.modalBody)}
    >
      <Row className={className ? `${className} ${css(styles.container)}` : css(styles.container)} style={style}>
        <Card className={css(styles.faceCard)} bodyStyle={{ padding: 5 }}>
          <ImgView src={face} className={css(styles.img)}/>
          <div>
            <p>{face.name ? face.name : face.srcName}</p>
            <p className={css(styles.faceDate)}>{face.offsetTime ? face.offsetTime : face.captureTime}</p>
          </div>
        </Card>

        <div className={css(styles.percent)}>
          <Progress
            type="circle" format={percent => `${percent}%`} status="exception"
            percent={face && face.percent ? parseFloat((face.percent * 100).toFixed(2)) : 0}
            width={80} className={css(styles.circle)}
          />
          <div className={css(styles.text)}>相似度</div>
        </div>
        {face ? contrastPerson(face) : null}
      </Row>
    </Modal>
  );
};


export default ContrastViewScale;

