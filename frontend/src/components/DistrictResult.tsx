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
    sendRequest("/stimmkreisuebersicht", "GET").then((data) => {
      console.log(data);

      const elem = data.direktkandidat[0];
      const stimmkreisuebersicht: stimmkreisuebersicht = {
        beteiligung: Number(elem.beteiligung),
        kandidatenname: elem.kandidatennamen,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmenFürKandidat: Number(elem.anzahlstimmen),
        anzahlWaehlerStimmkreis: Number(elem.anzahlwaehler),
        anzahlStimmberechtigteStimmkreis: Number(elem.anzahlstimmberechtigte),
      };
      setStimmkreisuebersicht(stimmkreisuebersicht);
      console.log(stimmkreisuebersicht.kurzbezeichnung);

      const stimmkreisParteiErgebnisse: stimmkreisParteiErgebnis[] = data.stimmen.map((elem: any) => ({
        parteiname: elem.parteiname,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        anzahlStimmenRelativ: Number(elem.prozentualstimmen),
        parteiFarbe: elem.farbe,
      }));
      setStimmkreisParteiErgebnisse(stimmkreisParteiErgebnisse);
    });
  }, []);

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
          <h2 className="table-title">Wahlbeteiligung</h2>
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
