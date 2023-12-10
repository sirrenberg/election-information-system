import "../styles/Overview.css";
import { useState } from "react";
import ScatterChart from "../components/ScatterChart";
import { chartData, ueberhangData } from "../helper/types";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";

function Overview() {
  const { sendRequest } = useAPI();

  const [ueberhangData, setUeberhangData] = useState<ueberhangData[]>([]);

  useEffect(() => {
    sendRequest("/ueberhang_mandate", "GET").then((data) => {
      console.log(data);
      const ueberhangData: ueberhangData[] = data.map((elem: any) => ({
        wahlkreis: elem.wahlkreis,
        partei: elem.partei,
        direktmandate: Number(elem.raw_seats),
        ueberhangmandate: Number(elem.difference),
        totalmandate: Number(elem.final_seats),
      }));

      setUeberhangData(ueberhangData);
    });
  }, []);

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

      <div className="close-winners-container overview-section">
        <h2 className="overview-section-title">Überhang-/Ausgleichmandate</h2>
        <table className="info-table overview-table">
          <thead>
            <tr>
              <th>Wahlkreis</th>
              <th>Partei</th>
              <th>Direkt</th>
              <th>Überhang-/Ausgleichmandate</th>
              <th>Insgesamt</th>
            </tr>
          </thead>
          <tbody>
            {ueberhangData.map((elem) => (
              <tr key={elem.wahlkreis + elem.partei}>
                <td>{elem.wahlkreis}</td>
                <td>{elem.partei}</td>
                <td>{elem.direktmandate}</td>
                <td>{elem.ueberhangmandate}</td>
                <td>{elem.totalmandate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="student-stats-container overview-section">
        <h2 className="overview-section-title">Student Stats</h2>
        <ScatterChart chartData={userData} />
      </div>

      <div className="debt-stats-container overview-section">
        <h2 className="overview-section-title">Debt Stats</h2>
        <ScatterChart chartData={userData} />
      </div> */}
    </div>
  );
}

export default Overview;
