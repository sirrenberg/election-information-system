import "../styles/LandingPage.css";
import { useState } from "react";
import { data } from "../data";
import { chartData, chartOptions, seatData, candidateData } from "../helper/types";

import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import "../styles/SeatDistribution.css";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";

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
    <div className="lp-container content-page">
      <div className="title-container">
        <h1 className="main-title">
          Das Bayerische Landtagswahl Informationssystem
        </h1>

        <div className="map-container">
          <img src="./bayern-map.png" alt="Bayern map" className="bayern-map" />
        </div>
      </div>

      <div className="info-container">
        <h2 className="info-title">Wahlergebnisse</h2>
        <div className="charts-container">
          <div className="chart-container">
            <BarChart chartData={getTotalVotesChartData()} />
          </div>
          <div className="chart-container">
            {<PieChart chartData={getSeatsChartData()} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
