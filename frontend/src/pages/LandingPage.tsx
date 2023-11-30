import "../styles/LandingPage.css";
import BarChart from "../components/BarChart";
import PieActiveArc from "../components/PieChart";

function LandingPage() {
  // const data = [
  //   { name: "Category A", value: 30 },
  //   { name: "Category B", value: 45 },
  //   { name: "Category C", value: 28 },
  //   // Add more data points as needed
  // ];

  return (
    <div className="lp-container ">
      <div className="title-container content-page">
        <h1 className="main-title">
          Das Bayerische Landtagswahl Informationssystem
        </h1>

        <div className="map-container">
          <img src="./bayern-map.png" alt="Bayern map" className="bayern-map" />
        </div>
      </div>

      <div className="info-container content-page">
        <div className="charts-container">
          <div className="chart-container">{<BarChart />}</div>
          <div className="chart-container">{<PieActiveArc />}</div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
