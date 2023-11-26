import { BarChart } from "@mui/x-charts/BarChart";

export default function SimpleBarChart() {
  function getBarHeight() {
    // get bar height depending on screen size
    const width = window.innerWidth;

    return width < 600 ? 300 : 400;
  }

  function getBarWidth() {
    // get bar width depending on screen size
    const width = window.innerWidth;

    return width < 600 ? 400 : 400;
  }

  return (
    <BarChart
      xAxis={[
        {
          id: "barCategories",
          data: ["bar A", "bar B", "bar C"],
          scaleType: "band",
        },
      ]}
      series={[
        {
          data: [2, 5, 3],
        },
      ]}
      width={getBarWidth()}
      height={getBarHeight()}
    />
  );
}
