import "../styles/LandingPage.css";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { useState } from "react";
import { data } from "../data";
import { chartData } from "../helper/types";

function LandingPage() {
  const [userData, setUserData] = useState({
    labels: data.map((elem) => elem.party),
    datasets: [
      {
        label: "Seats",
        data: data.map((elem) => elem.seats),
        backgroundColor: data.map((elem) => elem.color),
      },
    ],
  } as chartData);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

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
        <h2 className="info-title">Wahlergebnisse</h2>
        <div className="charts-container">
          <div className="chart-container">
            <BarChart chartData={userData} chartOptions={chartOptions} />
          </div>
          <div className="chart-container">
            {<PieChart chartData={userData} chartOptions={chartOptions} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
