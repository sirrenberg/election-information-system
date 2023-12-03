import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { chartData, chartOptions } from "../helper/types";

function PieChart({
  chartData,
  chartOptions,
}: {
  chartData: any;
  chartOptions: any;
}) {
  return <Pie data={chartData} options={chartOptions} />;
}

export default PieChart;
