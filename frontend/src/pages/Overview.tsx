import "../styles/Overview.css";
import { useState } from "react";
import { ueberhangData } from "../helper/types";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";
import ClosestWinners from "../components/ClosestWinners";
import AdditionalResearch from "../components/AdditionalResearch";

function Overview() {
  const { sendRequest } = useAPI();

  const [ueberhangData, setUeberhangData] = useState<ueberhangData[]>([]);

  useEffect(() => {
    sendRequest("/ueberhang_mandate", "GET").then((data) => {
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
      <AdditionalResearch />
      <ClosestWinners />
      <div className="close-winners-container overview-section">
        <h2 className="overview-section-title">Überhang-/Ausgleichmandate*</h2>
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
        <p className="overview-section-subtitle">
          *es werden nur Parteien angezeigt, die im neu gewählten Landtag
          vertreten sind. Alle anderen Parteien haben weder Direkt- noch
          Überhang-oder Ausgleichmandate erzielt.
        </p>
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
