import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { chartData, chartOptions } from "../helper/types";

// used this to remove typescript warning
ChartJS.defaults.font.size = 16;

function PieChart({ chartData }: { chartData: chartData }) {
  const chartOptions: chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Pie data={chartData} options={chartOptions} />;
}

export default PieChart;
