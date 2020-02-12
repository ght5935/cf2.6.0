/**
 * Created by Riky on 2017/2/24.
 */

import React from 'react';
import { connect } from 'dva';


import MayLayout from '../../components/common/MainLayout';
import ContrastPhotoView from '../../components/common/ContrastPhotoView';
import ExpandImgModal from '../../components/common/ExpandImgModal';

const ContrastPage = ({ dispatch, face, index, location }) => {
  const ContrastPhotoViewProps = {
    selectRow(value) {
      dispatch({
        type: 'face/contrastRowSelect',
        payload: value
      });
    },
    pageTranslate(value) {
      dispatch({
        type: 'face/contrastPageTranslate',
        payload: value
      });
    },
    onClosed() {
      dispatch({
        type: 'face/contrastClosed'
      });
    },
    snapClick(value) {
      console.log(value);
      dispatch({
        type: 'index/success',
        payload: {
          expandModalVisiable: true,
          expandModalData: value
        }
      });
    }
  };
  function onExpandCancel() {
    dispatch({
      type: 'index/success',
      payload: {
        expandModalVisiable: false
      }
    });
  }
  return (
    <MayLayout location={location}>
      {face.contrast ? <ContrastPhotoView data={face.contrast} {...ContrastPhotoViewProps}/> : null}
      <ExpandImgModal
        onCancel={onExpandCancel}
        visible={index.expandModalVisiable}
        data={index.expandModalData}
      />
    </MayLayout>
  );
};

function mapStateToProps({ face, index }) {
  return { face, index };
}

export default connect(mapStateToProps)(ContrastPage);

