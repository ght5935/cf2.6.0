/**
 * Created by Jason on 2017/7/20.
 */

import React from 'react';
import { connect } from 'dva';
import { StyleSheet, css } from 'aphrodite';
import { Radio } from 'antd';
import ReactEcharts from 'echarts-for-react';
import AnalysisLayout from './AnalysisLayout';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;



const styles = StyleSheet.create({
  select:{
    marginBottom: '80px',
    marginLeft: '40px'
  },
  statistics: {
    float: 'left'
  },
  statisticsTwo: {
    float: 'right'
  }

});


class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
    this.props.dispatch({
      type: 'analysis/allTrafficStatistics',
      payload: {
        type: 0
      }
    })
  }
  onChange = (e) => {
  console.log(e.target.value);
  this.props.dispatch({
    type: 'analysis/allTrafficStatistics',
    payload: {
      type: e.target.value
    }
  })
}
  getTrafficStatistics = () => ({
    title: {
      text: '流量统计',
      textStyle: {
        color: '#fff'
      }

    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      data: this.props.analysis.trafficStatisticsData ? this.props.analysis.trafficStatisticsData.facetrackCount.map((item) => item.date) : null
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      }
    },

    textStyle: {
      color: '#fff'
    },
    series: {
      name: '流量统计',
      type: 'bar',
      itemStyle: {
        normal: {
          color: "rgba(145,199,174,1)"
        }
      },

      data: this.props.analysis.trafficStatisticsData ? this.props.analysis.trafficStatisticsData.facetrackCount.map((item) => item.count) : null,
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      }

    }
  })
  getAlarmStatistics = () => ({
    title: {
      text: '报警统计',
      textStyle: {
        color: '#fff'
      }

    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      data: this.props.analysis.trafficStatisticsData ? this.props.analysis.trafficStatisticsData.alarmCount.map((item) => item.date) : null
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      }
    },

    textStyle: {
      color: '#fff'
    },
    series: {
      name: '报警统计',
      type: 'bar',
      data: this.props.analysis.trafficStatisticsData ? this.props.analysis.trafficStatisticsData.alarmCount.map((item) => item.count) : null,
      itemStyle: {
        normal: {
          color: "rgba(214,95,97,1) "
        }
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      }
    }
  })

  render() {
    return (


      <AnalysisLayout location={this.props.location} dispatch={this.props.dispatch}>
        <div className={css(styles.select)}>
          <RadioGroup onChange={this.onChange} defaultValue="0" >
            <RadioButton value="0">周统计</RadioButton>
            <RadioButton value="1">月统计</RadioButton>
            <RadioButton value="2">年统计</RadioButton>
          </RadioGroup>
        </div>
        {/* 表格一*/}
        <div className={css(styles.statistics)}>
          <ReactEcharts
            option={this.getTrafficStatistics()}
            style={{ width: 800, height: 500 }}
            notMerge
            lazyUpdate
          />
        </div>
        {/* 表格二*/}
        <div className={css(styles.statisticsTwo)}>
          <ReactEcharts
            option={this.getAlarmStatistics()}
            style={{ width: 800, height: 500 }}
            notMerge
            lazyUpdate
          />
        </div>

      </AnalysisLayout>
    );
  }
}
function mapStateToProps({analysis}) {
  return {analysis}
}

export  default connect(mapStateToProps)(IndexPage);
