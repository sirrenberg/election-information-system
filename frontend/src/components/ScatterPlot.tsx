import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { chartData, chartOptions } from '../helper/types';

ChartJS.defaults.font.size = 16;

function ScatterPlot({ chartData }: { chartData: chartData }) {
  const chartOptions: chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Scatter data={chartData} options={chartOptions} />;
}

export default Scatter;