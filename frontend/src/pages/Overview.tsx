import "../styles/Overview.css";
import { useState } from "react";
import ScatterChart from "../components/ScatterChart";
import { chartData } from "../helper/types";
import { data } from "../data";

function Overview() {
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
    <div className="overview-container content-page">
      <h1 className="page-title">Overview</h1>

      <div className="close-winners-container overview-section">
        <h2 className="overview-section-title">Closest Winners</h2>
        <table className="info-table overview-table">
          <thead>
            <tr>
              <th>Wahlkreis</th>
              <th>Partei</th>
              <th>Differenz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Wahlkreis 1</td>
              <td>CSU</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Wahlkreis 2</td>
              <td>CSU</td>
              <td>100</td>
            </tr>
            <tr>
              <td>Wahlkreis 3</td>
              <td>CSU</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="student-stats-container overview-section">
        <h2 className="overview-section-title">Student Stats</h2>
        <ScatterChart chartData={userData} />
      </div>

      <div className="debt-stats-container overview-section">
        <h2 className="overview-section-title">Debt Stats</h2>
        <ScatterChart chartData={userData} />
      </div>
    </div>
  );
}

export default Overview;
