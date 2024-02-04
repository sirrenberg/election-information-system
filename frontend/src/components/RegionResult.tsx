import BarChart from "./BarChart";
import PieChart from "./PieChart";
import "../styles/RegionResult.css";
import { chartData } from "../helper/types";
import { data } from "../data";
import { useEffect, useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { stimmen } from "../helper/types";

function RegionResult({ id }: { id: string }) {
  const { sendRequest } = useAPI();

  const [wahlkreisName, setWahlkreisName] = useState<string>(""); // data[id]
  const [wahlkreisStimmen, setWahlkreisStimmen] = useState<{
    [key: string]: stimmen[];
  }>();

  useEffect(() => {
    sendRequest(`/wahlkreisuebersicht?id=${id}`, "GET").then((data) => {
      console.log(data);

      setWahlkreisName(data.wahlkreisname);

      const erststimmen: stimmen[] = data.erststimmen.map((elem: any) => ({
        parteiname: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        parteiFarbe: elem.farbe,
      }));

      const zweitstimmen: stimmen[] = data.zweitstimmen.map((elem: any) => ({
        parteiname: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        parteiFarbe: elem.farbe,
      }));

      const gesamtstimmen: stimmen[] = data.gesamtstimmen.map((elem: any) => ({
        parteiname: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        parteiFarbe: elem.farbe,
      }));

      setWahlkreisStimmen({
        erststimmen: erststimmen,
        zweitstimmen: zweitstimmen,
        gesamtstimmen: gesamtstimmen,
      });
    });
  }, [id]);

  function getChartData(s: stimmen[]): chartData {
    const chartData: chartData = {
      labels: s!
        .filter((elem) => elem.anzahlStimmen !== 0)
        .map((elem) => elem.parteiname),
      datasets: [
        {
          label: "Stimmen",
          data: s!.map((elem) => elem.anzahlStimmen),
          backgroundColor: s!.map((elem) => elem.parteiFarbe),
        },
      ],
    };
    return chartData;
  }

  if (!wahlkreisStimmen || !wahlkreisName) return <div>Loading...</div>;
  return (
    <div className="region-res-container">
      <h1 className="region-title">{id} - {wahlkreisName}</h1>
      <div className="region-res-charts">
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Erststimmen</h2>
          <div className="chart-container">
            <PieChart chartData={getChartData(wahlkreisStimmen.erststimmen)} />
          </div>
        </div>
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Zweitstimmen</h2>
          <div className="chart-container">
            <PieChart chartData={getChartData(wahlkreisStimmen.zweitstimmen)} />
          </div>
        </div>
        <div className="region-res-section">
          <h2 className="region-res-subtitle">Gesamtstimmen</h2>
          <div className="chart-container">
            <PieChart
              chartData={getChartData(wahlkreisStimmen.gesamtstimmen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegionResult;
