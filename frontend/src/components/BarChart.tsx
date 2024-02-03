import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { BarElement } from "chart.js";
import { chartData, chartOptions } from "../helper/types";

ChartJS.register(BarElement);

function BarChart({ chartData }: { chartData: chartData }) {
  const chartOptions: chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}

export default BarChart;
