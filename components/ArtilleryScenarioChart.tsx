import React from 'react';
import ReactECharts from 'echarts-for-react';

type Pause = { pause: number };
type Ramp = {
  duration: number;
  arrivalRate: number;
  rampTo?: number;
};

type Props = {
  phases: Array<Ramp | Pause>;
};

const isRamp = (arg: any): arg is Ramp => arg.duration !== undefined;

const ArtilleryScenarioChart: React.FC<Props> = ({ phases }) => {
  const options = {
    title: {
      text: 'arrival rate',
    },
    xAxis: {
      type: 'value',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show: true,
      left: 'center',
      itemSize: 20,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
        dataZoom: {
          yAxisIndex: 'none',
        },
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        name: 'arrivalRate',
        type: 'line',
        // symbol: 'circle',
        symbolSize: 1,
        itemStyle: {
          color: '#F2597F',
          width: 1,
        },
        data: [] as any[],
      },
    ],
  };

  let sec = 0;
  let nowRamp = 0;
  phases.map((phase) => {
    if (isRamp(phase)) {
      const gradient = phase.rampTo ? (phase.rampTo - nowRamp) / phase.duration : 0;

      for (let i = sec; i < sec + phase.duration; i++) {
        phase.arrivalRate += gradient;
        options.series[0].data.push([i, phase.arrivalRate]);
      }
      phase.arrivalRate -= phase.rampTo ? phase.rampTo - nowRamp : 0;
      sec += phase.duration;
      nowRamp = phase.arrivalRate;
    } else {
      for (let i = sec; i < sec + phase.pause; i++) {
        options.series[0].data.push([i, 0]);
      }
      sec += phase.pause;
    }
  });

  return <ReactECharts option={options} />;
};
export default ArtilleryScenarioChart;
