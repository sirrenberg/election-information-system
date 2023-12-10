import BarChart from "./BarChart";
import PieChart from "./PieChart";
import "../styles/RegionResult.css";
import { chartData } from "../helper/types";
import { data } from "../data";
import { useState } from "react";

function RegionResult({ id }: { id: string }) {
  const [userData, _] = useState({
    labels: data.map((elem) => elem.party),
    datasets: [
      {
        label: "Seats",
        data: data.map((elem) => elem.seats),
        backgroundColor: data.map((elem) => elem.color),
      },
    ],
  } as chartData);

  return (
    <div className="region-res-container">
      <h1 className="region-title">{id} - Wahlkreis Name</h1>
      <div className="region-res-charts">
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Erststimmen</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Zweitstimmen</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegionResult;
