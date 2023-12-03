import "../styles/RegionResult.css";
import { data } from "../data";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { chartData } from "../helper/types";
import { useState } from "react";

function RegionResult() {
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
      <h1 className="region-title">Stimmkreis Name</h1>
      <div className="winner-table-container">
        <h2 className="winner-title">Gewählte/r Direktkandidat/in</h2>
        <table className="winner-table">
          <thead>
            <tr>
              <th>Partei</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSU</td>
              <td>Max Mustermann</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="region-res-charts">
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <BarChart chartData={userData} />
          </div>
        </div>
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Anteil</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
      </div>

      <div className="region-res-comparison region-res-section">
        <h2 className="region-res-subtitle">Vergleich zu letzter Wahl</h2>
        <div className="chart-container">
          <BarChart chartData={userData} />
        </div>
      </div>
    </div>
  );
}

export default RegionResult;
