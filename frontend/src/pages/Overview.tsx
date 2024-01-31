import "../styles/Overview.css";
import { useState } from "react";
import ScatterChart from "../components/ScatterChart";
import { chartData, ueberhangData, knappsteSiegerData } from "../helper/types";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";
import { groupBy } from 'lodash';

function Overview() {
  const { sendRequest } = useAPI();

  const [ueberhangData, setUeberhangData] = useState<ueberhangData[]>([]);
  const [knappsteSiegerData, setKnappsteSiegerData] = useState<knappsteSiegerData[]>([]);
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [openTables, setOpenTables] = useState<string[]>([]);

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

  useEffect(() => {
    sendRequest("/knappste-sieger-und-zweite", "GET").then((data) => {
      console.log(data);
      const knappsteSiegerData: knappsteSiegerData[] = data.map((elem: any) => ({
        partei: elem.betrachtepartei,
        stimmkreis: `${elem.stimmkreisname} (${elem.stimmkreisid})`,
        differenz: Number(elem.differenz),
        sieger: `${elem.siegername} (${elem.siegerparteikurz})`,
        zweiter: `${elem.zweitername} (${elem.zweiterparteikurz})`,
      }));

      setKnappsteSiegerData(knappsteSiegerData);
      setGroupedData(groupBy(knappsteSiegerData, 'partei'));
    });
  }, []);

  return (
    <div className="overview-container content-page">
      <h1 className="page-title">Overview</h1>

      <div className="close-winners-container overview-section">
        <h2 className="overview-section-title">Knappste Sieger</h2>
        {Object.entries(groupedData).map(([partei, data]) => {
          return(
            <div key={partei} className="table-container">
              <h2 onClick={() => openTables.includes(partei) ? setOpenTables(openTables.filter((elem) => elem !== partei)): setOpenTables([...openTables, partei])}>{partei}</h2>
                {openTables.includes(partei) && (<table className="info-table overview-table">
                  <thead>
                    <tr>
                      <th>Partei</th>
                      <th>Stimmkreis</th>
                      <th>Differenz</th>
                      <th>Sieger</th>
                      <th>Zweiter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((elem) => (
                      <tr key={elem.partei + elem.stimmkreis}>
                        <td>{elem.partei}</td>
                        <td>{elem.stimmkreis}</td>
                        <td>{elem.differenz}</td>
                        <td>{elem.sieger}</td>
                        <td>{elem.zweiter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>)}
            </div>
          )
        })
      }
        <table className="info-table overview-table">
          <thead>
            <tr>
              <th>Partei</th>
              <th>Stimmkreis</th>
              <th>Differenz</th>
              <th>Sieger</th>
              <th>Zweiter</th>
            </tr>
          </thead>
          <tbody>
            {knappsteSiegerData.map((elem) => (
              <tr key={elem.partei + elem.stimmkreis}>
                <td>{elem.partei}</td>
                <td>{elem.stimmkreis}</td>
                <td>{elem.differenz}</td>
                <td>{elem.sieger}</td>
                <td>{elem.zweiter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <p className="overview-section-subtitle">*es werden nur Parteien angezeigt, die im neu gewählten Landtag vertreten sind. Alle anderen Parteien haben weder Direkt- noch Überhang-oder Ausgleichmandate erzielt.</p>
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
