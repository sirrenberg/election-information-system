import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { data } from "../data";
import { chartData } from "../helper/types";
import { useState } from "react";
import "../styles/SeatDistribution.css";

function SeatDistribution() {
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
    <div className="seat-dist-container">
      <h1 className="seat-dist-title">Sitzverteilung</h1>
      <div className="seat-dist-content">
        <div className="seat-dist-section">
          <h2 className="seat-dist-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <BarChart chartData={userData} />
          </div>
        </div>
        <div className="seat-dist-section">
          <h2 className="seat-dist-subtitle">Sitzverteilung</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatDistribution;
