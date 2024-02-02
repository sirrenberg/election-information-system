import "../styles/DistrictResult.css";
import { data } from "../data";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { chartData } from "../helper/types";
import { useEffect, useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { stimmkreisuebersicht, stimmkreisParteiErgebnis } from "../helper/types";

function DistrictResult({ id }: { id: string }) {
  const {sendRequest} = useAPI();
  const [stimmkreisuebersicht, setStimmkreisuebersicht] = useState<stimmkreisuebersicht>();
  const [stimmkreisParteiErgebnisse, setStimmkreisParteiErgebnisse] = useState<stimmkreisParteiErgebnis[]>();
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

  useEffect(() => {
    sendRequest(`/stimmkreisuebersicht`, "GET").then((data) => {
      console.log(data);

      const elem = data.direktkandidat[0];
      const stimmkreisuebersicht: stimmkreisuebersicht = {
        beteiligung: Number(elem.beteiligung),
        kandidatenname: elem.kandidatennamen,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmenFürKandidat: Number(elem.anzahlstimmen),
        anzahlWaehlerStimmkreis: Number(elem.anzahlwaehler),
        anzahlStimmberechtigteStimmkreis: Number(elem.anzahlstimmberechtigte),
        stimmkreisname: elem.stimmkreisname,
      };
      setStimmkreisuebersicht(stimmkreisuebersicht);

      const stimmkreisParteiErgebnisse: stimmkreisParteiErgebnis[] = data.stimmen.map((elem: any) => ({
        parteiname: elem.parteiname,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        anzahlStimmenRelativ: Number(elem.prozentualstimmen),
        parteiFarbe: elem.farbe,
      }));
      console.log("Parteiergebnisse: " + stimmkreisParteiErgebnisse[0].parteiname + " " + stimmkreisParteiErgebnisse[0].anzahlStimmen + " " + stimmkreisParteiErgebnisse[0].parteiFarbe);
      setStimmkreisParteiErgebnisse(stimmkreisParteiErgebnisse);
    });
  }, []);

  function getTotalVotesChartData(): chartData {
    const chartData: chartData = {
      labels: stimmkreisParteiErgebnisse!.map((elem) => elem.kurzbezeichnung),
      datasets: [
        {
          label: "Stimmen",
          data: stimmkreisParteiErgebnisse!.map((elem) => elem.anzahlStimmen),
          backgroundColor: stimmkreisParteiErgebnisse!.map((elem) => elem.parteiFarbe),
        },
      ],
    };
  
    return chartData;
  }

  function getRelativeVotesChartData(): chartData {
    const chartData: chartData = {
      labels: stimmkreisParteiErgebnisse!.map((elem) => elem.kurzbezeichnung),
      datasets: [
        {
          label: "Stimmen in Prozent",
          data: stimmkreisParteiErgebnisse!.map((elem) => (elem.anzahlStimmenRelativ*100).toFixed(1)),
          backgroundColor: stimmkreisParteiErgebnisse!.map((elem) => elem.parteiFarbe),
        },
      ],
    };

    return chartData;
  }

  if(!stimmkreisuebersicht || !stimmkreisParteiErgebnisse) return (<div>Loading... xD</div>);
  return (
    <div className="district-res-container">
      <h1 className="district-title">{id} - {stimmkreisuebersicht?.stimmkreisname}</h1>
      <div className="district-info-tables">
        <div className="district-table-container">
          <h2 className="table-title">Gewählte/r Direktkandidat/in 2023</h2>
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Partei</th>
                <th>Name</th>
                <th>Anzahl Stimmen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stimmkreisuebersicht?.kurzbezeichnung}</td>
                <td>{stimmkreisuebersicht?.kandidatenname}</td>
                <td>{stimmkreisuebersicht?.anzahlStimmenFürKandidat}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="district-table-container">
          <h2 className="table-title">Gewählte/r Direktkandidat/in 2018</h2>
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Anzahl Stimmberechtigte</th>
                <th>Wähler</th>
                <th>Wahlbeteiligung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stimmkreisuebersicht?.anzahlStimmberechtigteStimmkreis}</td>
                <td>{stimmkreisuebersicht?.anzahlWaehlerStimmkreis}</td>
                <td>{(stimmkreisuebersicht?.beteiligung*100).toFixed(3)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="district-info-tables">
        <div className="district-table-container">
          <h2 className="table-title">Wahlbeteiligung 2023</h2>
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Partei</th>
                <th>Name</th>
                <th>Anzahl Stimmen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stimmkreisuebersicht?.kurzbezeichnung}</td>
                <td>{stimmkreisuebersicht?.kandidatenname}</td>
                <td>{stimmkreisuebersicht?.anzahlStimmenFürKandidat}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="district-table-container">
          <h2 className="table-title">Wahlbeteiligung 2018</h2>
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Anzahl Stimmberechtigte</th>
                <th>Wähler</th>
                <th>Wahlbeteiligung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stimmkreisuebersicht?.anzahlStimmberechtigteStimmkreis}</td>
                <td>{stimmkreisuebersicht?.anzahlWaehlerStimmkreis}</td>
                <td>{(stimmkreisuebersicht?.beteiligung*100).toFixed(3)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="district-res-charts">
        <div className="district-res-section">
          <h2 className="district-res-subtitle">absolute Stimmanzahl 2023</h2>
          <div className="chart-container">
            <BarChart chartData={stimmkreisParteiErgebnisse &&getTotalVotesChartData()} />
          </div>
        </div>
        <div className="district-res-section">
          <h2 className="district-res-subtitle">absolute Stimmanzahl 2018</h2>
          <div className="chart-container">
            <BarChart chartData={userData} />
          </div>
        </div>
      </div>

      <div className="district-res-charts">
        <div className="district-res-section">
          <h2 className="district-res-subtitle">relative Stimmanzahl 2023</h2>
          <div className="chart-container">
            <PieChart chartData={getRelativeVotesChartData()} />
          </div>
        </div>
        <div className="district-res-section">
          <h2 className="district-res-subtitle">relative Stimmanzahl 2018</h2>
          <div className="chart-container">
            <PieChart chartData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictResult;
