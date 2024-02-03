import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { chartData, seatData, candidateData } from "../helper/types";
import { useState } from "react";
import "../styles/SeatDistribution.css";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";

function SeatDistribution() {
  const { sendRequest } = useAPI();

  const [seatData, setSeatData] = useState<seatData[]>([]);
  const [candidateData, setCandidateData] = useState<candidateData[]>([]);

  useEffect(() => {
    sendRequest("/seats", "GET").then((data) => {
      const seatData: seatData[] = data.map((elem: any) => ({
        party: elem.kurzbezeichnung,
        seats: Number(elem.sitzezusammen),
        color: elem.farbe,
        votes: Number(elem.stimmen),
      }));

      // sort by seats descending
      seatData.sort((a, b) => b.seats - a.seats);

      console.log(seatData);

      setSeatData(seatData);
    });

    sendRequest("/MitgliederDesLandtages", "GET").then((data) => {
      console.log(data);
      const candidateData: candidateData[] = data.map((elem: any) => ({
        party: elem.kurzbezeichnung,
        wahlkreis: elem.wahlkreisname,
        name: elem.kandidatennamen,
        stimmkreis: elem.stimmkreisid + " " + elem.stimmkreisname,
      }));

      setCandidateData(candidateData);
    });
  }, []);

  function getTotalVotesChartData(): chartData {
    const chartData: chartData = {
      labels: seatData.map((elem) => elem.party),
      datasets: [
        {
          label: "Stimmen",
          data: seatData.map((elem) => elem.votes),
          backgroundColor: seatData.map((elem) => elem.color),
        },
      ],
    };

    return chartData;
  }

  function getSeatsChartData(): chartData {
    const chartData: chartData = {
      labels: seatData.map((elem) => elem.party),
      datasets: [
        {
          label: "Sitze",
          data: seatData.map((elem) => elem.seats),
          backgroundColor: seatData.map((elem) => elem.color),
        },
      ],
    };

    return chartData;
  }

  return (
    <div className="seat-dist-container content-page">
      <div className="seat-dist-content seat-dist-main-charts">
        <div className="seat-dist-section">
          <h2 className="seat-dist-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <BarChart chartData={getTotalVotesChartData()} />
          </div>
        </div>
        <div className="seat-dist-section">
          <h2 className="seat-dist-subtitle">Sitzverteilung</h2>
          <div className="chart-container">
            <PieChart chartData={getSeatsChartData()} />
          </div>
        </div>
      </div>
      <div className="seat-dist-content">
        <h2 className="seat-dist-subtitle">Results</h2>
        <table className="info-table">
          <thead>
            <tr>
              <th>Partei</th>
              <th>Sitze</th>
              <th>Stimmen</th>
            </tr>
          </thead>
          <tbody>
            {seatData.map((elem) => (
              <tr key={elem.party}>
                <td>{elem.party}</td>
                <td>{elem.seats}</td>
                <td>{elem.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="seat-dist-content">
        <h2 className="seat-dist-subtitle">Mitglieder des Landtags</h2>
        <table className="info-table">
          <thead>
            <tr>
              <th>Partei</th>
              <th>Wahlkreis</th>
              <th>Name</th>
              <th>Stimmkreis</th>
            </tr>
          </thead>
          <tbody>
            {candidateData.map((elem) => (
              <tr key={elem.party}>
                <td>{elem.party}</td>
                <td>{elem.wahlkreis}</td>
                <td>{elem.name}</td>
                <td>{elem.stimmkreis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeatDistribution;
