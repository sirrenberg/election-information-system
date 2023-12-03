import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { BarElement } from "chart.js";
import { chartData } from "../helper/types";

ChartJS.register(BarElement);

function BarChart({
  chartData,
  chartOptions,
}: {
  chartData: chartData;
  chartOptions: any;
}) {
  return <Bar data={chartData} options={chartOptions} />;
}

export default BarChart;
