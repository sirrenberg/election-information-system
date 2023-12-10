import "../styles/DistrictResult.css";
import { data } from "../data";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { chartData } from "../helper/types";
import { useState } from "react";

function DistrictResult({ id }: { id: string }) {
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
    <div className="district-res-container">
      <h1 className="district-title">{id} - Stimmkreis Name</h1>
      <div className="district-info-tables">
        <div className="district-table-container">
          <h2 className="table-title">Gewählte/r Direktkandidat/in</h2>
          <table className="district-table info-table">
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
        <div className="district-table-container">
          <h2 className="table-title">Wahlbeteiligung</h2>
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Wahlberechtigte</th>
                <th>Wähler</th>
                <th>Wahlbeteiligung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1000</td>
                <td>800</td>
                <td>80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="district-res-charts">
        <div className="district-res-section">
          <h2 className="district-res-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <BarChart chartData={userData} />
          </div>
        </div>
        <div className="district-res-section">
          <h2 className="district-res-subtitle">Vergleich zu letzer Wahl</h2>
          <div className="chart-container">
            <BarChart chartData={userData} />
          </div>
        </div>
      </div>

      <div className="district-res-comparison district-res-section">
        <h2 className="district-res-subtitle">Anteil</h2>
        <div className="chart-container">
          <PieChart chartData={userData} />
        </div>
      </div>
    </div>
  );
}

export default DistrictResult;
