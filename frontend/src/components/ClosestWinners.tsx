import React, { useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";
import { groupBy } from "lodash";
import { chartData, ueberhangData, knappsteSiegerData } from "../helper/types";

function ClosestWinners() {
  const { sendRequest } = useAPI();
  const [selectedParty, setSelectedParty] = useState("");
  const [knappsteSiegerData, setKnappsteSiegerData] = useState<
    knappsteSiegerData[]
  >([]);
  const [groupedData, setGroupedData] = useState<{
    [key: string]: knappsteSiegerData[];
  }>({});

  const handleChange = (event) => {
    setSelectedParty(event.target.value);
  };

  useEffect(() => {
    sendRequest("/knappste-sieger-und-zweite", "GET").then((data) => {
      const knappsteSiegerData: knappsteSiegerData[] = data.map(
        (elem: any) => ({
          partei: elem.betrachteteparteikurz,
          parteiLong: elem.betrachteteparteiname,
          stimmkreis: `${elem.stimmkreisname} (${elem.stimmkreisid})`,
          differenz: Number(elem.differenz),
          sieger: `${elem.siegername} (${elem.siegerparteikurz})`,
          verlierer: `${elem.verlierername} (${elem.verliererparteikurz})`,
          tag: elem.tag,
        })
      );

      setKnappsteSiegerData(knappsteSiegerData);
      setGroupedData(groupBy(knappsteSiegerData, "partei"));
    });
  }, []);

  return (
    <div className="close-winners-container overview-section">
      <h2 className="page-title">Knappste Sieger</h2>
      <p>
        Wählen Sie eine Partei aus, um die zehn knappsten Sieger für diese
        Partei anzuzeigen. Wenn diese Partei keine 10 Direktmandate erzielen
        konnte, werden entsprechend viele knappste Verlierer angezeigt.
      </p>
      <select value={selectedParty} onChange={handleChange}>
        <option value="">Keine Partei ausgewählt.</option>
        {Object.keys(groupedData).map((partei) => (
          <option key={partei} value={partei}>
            {partei}
          </option>
        ))}
      </select>

      {selectedParty &&
        Object.entries(groupedData).map(([partei, data]) => {
          if (partei !== selectedParty) {
            return null;
          }
          return (
            <div key={partei} className="table-container">
              <h2>{data[0].parteiLong}</h2>
              {data.filter((elem) => elem.tag === "knappsteSiegerVsZweiter")
                .length > 0 && (
                <div key={partei} className="table-container">
                  <h3>Knappste Sieger</h3>
                  <table className="info-table overview-table">
                    <thead>
                      <tr>
                        <th>Stimmkreis</th>
                        <th>Differenz</th>
                        <th>Knappste Sieger</th>
                        <th>Zweite</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data
                        .filter(
                          (elem) => elem.tag === "knappsteSiegerVsZweiter"
                        )
                        .map((elem) => (
                          <tr key={elem.partei + elem.stimmkreis}>
                            <td>{elem.stimmkreis}</td>
                            <td>{elem.differenz}</td>
                            <td>{elem.sieger}</td>
                            <td>{elem.verlierer}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {data.filter((elem) => elem.tag === "knappsterVerliererVsSieger")
                .length > 0 && (
                <div key={partei} className="table-container">
                  <h3>Knappste Verlierer</h3>
                  <table className="info-table overview-table">
                    <thead>
                      <tr>
                        <th>Stimmkreis</th>
                        <th>Differenz</th>
                        <th>Knappste Verlierer</th>
                        <th>Sieger</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data
                        .filter(
                          (elem) => elem.tag === "knappsterVerliererVsSieger"
                        )
                        .map((elem) => (
                          <tr key={elem.partei + elem.stimmkreis}>
                            <td>{elem.stimmkreis}</td>
                            <td>{elem.differenz * -1}</td>
                            <td>{elem.verlierer}</td>
                            <td>{elem.sieger}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default ClosestWinners;
