/**
 * Created by Riky on 2017/2/21.
 */
import React from 'react';
import { Link } from 'dva/router';
import { Layout, Menu, Icon, Button } from 'antd';

import styles from './MainLayout.css';
import $ from 'jquery';
import pathToRegexp from 'path-to-regexp';

const { Header, Content } = Layout;

const { Item } = Menu;

const MainLayout = (props, fullScreen) => {
  function SelectedKey() {
    const match = pathToRegexp('/:foo/:bar?/:id?/:action?/:more?').exec(props.location.pathname);
    if (!match || match[1] == '') {
      return ['index'];
    }
    return [match[1]];
  }
  const full = () => {
    const full = document.documentElement;
    if (full.requestFullscreen) {
      full.RequestFullscreen();
    } else if (full.msRequestFullscreen) {
      full.msRequestFullscreen();
    } else if (full.mozRequestFullscreen) {
      full.mozRequestFullscreen();
    } else if (full.webkitRequestFullscreen) {
      full.webkitRequestFullscreen();
    } else {

    }
  };

  const handleClick = e => {
    alert(e.key);
  };

  const toggleFaceCard = () => {
    if (props.location.pathname === '/alarm') {
      return (
        <Link to="/alarm/actual" >
          <Icon type="desktop" className={styles.screen} style={{ fontSize: 30 }} />
        </Link>
      );
    }
    return (
      <div onClick={full}>
        <Link to="/shadow" >
          <Icon type="desktop" className={styles.screen} style={{ fontSize: 30 }} />
        </Link>
      </div>
    );
  };
  return (
    <Layout className={styles.normal}>
      <Header className={styles.header}>
        <div className={styles.logo} />
        <Menu
          mode="horizontal"
          selectedKeys={SelectedKey()}
          className={styles.menu}
          theme="dark"
        >
          <Item key="index"> <Link to="/">实时抓拍</Link></Item>
          <Item key="face"><Link to="/face">人脸记录</Link></Item>
          <Item key="alarm"><Link to="/alarm">报警记录</Link></Item>
          <Item key="search"><Link to="/search">人脸筛查</Link></Item>
          {/* <Item key="contrast"><Link to="/contrast">人脸比对</Link></Item> */}
          <Item key="analysis"><Link to="/analysis">统计分析</Link></Item>
          <Item key="system"><Link to="/system">系统配置</Link></Item>
        </Menu>

        {/* <div className={styles.logout}></div> */}

        {/* <div className={styles.linker}><a href="http://10.1.205.171:8090/cfAdmin/bk.do">车辆系统</a></div> */}
        {/* <div className={styles.linker}><a href="http://10.1.205.171:8090/cfAdmin/bk.do">喀什大学</a></div> */}

        {toggleFaceCard()}
      </Header>

      <Content className={styles.content}>
        {props.children}
      </Content>

    </Layout>
  );
};

export default MainLayout;

