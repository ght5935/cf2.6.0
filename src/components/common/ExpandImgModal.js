/**
 * Created by Riky on 2017/4/25.
 */
import React from 'react';
import { Modal } from 'antd';
import ImgView from '../common/ImgView';
import { StyleSheet, css } from 'aphrodite/no-important';
import modalFaceView from './ModalFaceView.css';

const styles = StyleSheet.create({
  modalBody: {
    overflow: 'hidden',
    position: 'relative',
    '>div': {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      border: '1px solid #3d515d',
      background: '#232c31'
    }
  },
  body: {
    zIndex: '9000',
    top: 94
  },
  imgBox: {
    position: 'absolute',
    boxSizing: 'border-box',
    padding: '10px',
    backgroundColor: '#fff',
    overflow: 'hidden',
    width: 1100,
    height: 620

  },
  iframe: {
    position: 'absolute',
    visibility: 'inherit',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: -1
  }
});
const ExpandImgModal = ({ visible, data, onCancel }) => {
  // const scale = 1;
  // function imgScroll(event) {
  //   const imgNode = document.getElementById('img');
  //   const delta = event.deltaY ? event.deltaY > 0 : false;
  //   let ratioL = (event.clientX - imgNode.offsetLeft) / imgNode.offsetWidth,
  //     ratioT = (event.clientY - imgNode.offsetTop) / imgNode.offsetHeight,
  //     ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
  //     w = parseInt(imgNode.offsetWidth * ratioDelta),
  //     h = parseInt(imgNode.offsetHeight * ratioDelta),
  //     l = Math.round(event.clientX - (w * ratioL)),
  //     t = Math.round(event.clientY - (h * ratioT));
  //   if (w <= 1080) {
  //     w = 1080;
  //     l = 10;
  //   }
  //   if (h <= 600) {
  //     h = 600;
  //     t = 10;
  //   }
  //   imgNode.style.width = `${w}px`;
  //   imgNode.style.height = `${h}px`;
  //   imgNode.style.left = `${l}px`;
  //   imgNode.style.top = `${t}px`;
  // }
  function imgScroll(e) {
    const imgNode = document.getElementById('img');
    const event = e || window.event;
    const width = parseFloat(imgNode.style.width);// 图片初始宽高
    const height = parseFloat(imgNode.style.height);
    const scale = width / height; // 图片原始比例
    const delta = event.deltaY ? event.deltaY > 0 : false;
    const clientX = event.clientX; // 鼠标相对于浏览器窗口的位置坐标；
    const clientY = event.clientY;
    const imgL = imgNode.getBoundingClientRect().left; //  图片相对于视口的位置坐标；
    const imgT = imgNode.getBoundingClientRect().top;
    const L = clientX - imgL;//  鼠标在图片的位置坐标
    const T = clientY - imgT;
    const offsetL = width / L;
    const offsetT = height / T;
    // 重新计算鼠标滚动后图片宽高
    let w = !delta ? width*1.2 : width/1.2;
    let h = w / scale;
    // 重新计算鼠鼠标滚动后图片的位置
        // 重新计算鼠标在图片上的位置
    let l = w / offsetL;
    let t = h / offsetT;
    l = L - l;
    l = imgNode.offsetLeft + l;
    t = T - t;
    t = imgNode.offsetTop + t;
    if (w <= 1080) {
      w = 1080;
      l = 10;
    }
    if (h <= 600) {
      h = 600;
      t = 10;
    }
    if(w >= 1920){
      return false
    }
    imgNode.style.width = `${w}px`;
    imgNode.style.height = `${h}px`;
    imgNode.style.left = `${l}px`;
    imgNode.style.top = `${t}px`;
  }
  function imgClick(e) {
    console.log(e.clientX);
  }
  function onDragEnd(e) {
    console.log(e.clientX);
  }
  function onDragOver(e) {
    console.log(e.clientX);
  }
  return (
    <Modal
      visible={visible}
      title=""
      footer=""
      closable={false}
      onOk={() => onClosed()}
      onCancel={() => onCancel()}
      width={1100}
      height={620}
      className={css(styles.modalBody)}
    >
      <div className={css(styles.imgBox)}>
        <img
          id="img" src={data}
          draggable="true"
          style={{ position: 'absolute', width: '1080', height: '600', top: '10', left: '10' }}
          onWheel={imgScroll}
          onDragStart={imgClick}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          alt=""
        />

        <iframe
          src="about:blank" frameBorder="0" filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=1)"
          className={css(styles.iframe)}
        />
      </div>
    </Modal>
  );
};


export default ExpandImgModal;
