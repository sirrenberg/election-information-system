import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { BarElement } from "chart.js";
import { chartData, chartOptions } from "../helper/types";

ChartJS.register(BarElement);

function ScatterChart({ chartData }: { chartData: chartData }) {
  const chartOptions: chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Scatter data={chartData} options={chartOptions} />;
}

export default ScatterChart;
