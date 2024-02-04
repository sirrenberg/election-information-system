import { useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { useEffect } from "react";
import { analysisData, chartOptions } from "../helper/types";
import { Scatter } from "react-chartjs-2";

function AdditionalResearch() {
  const userChartOptions : chartOptions= {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const { sendRequest } = useAPI();
  const [additionalAnalysis, setAdditionalAnalysis] = useState<analysisData[]>();

  useEffect(() => {
    sendRequest("/additional_queries", "GET").then((data) => {
      const tmpAdditionalAnalysis: analysisData[] = data.map((elem: any) => ({
        partei: elem.kurzbezeichnung,
        anteilStimmen: Number(elem.anzahlstimmen),
        anteilstudentenproeinwohner: Number(elem.anteilstudentenproeinwohner),
        schuldendienstproeinwohner: Number(elem.schuldendienstproeinwohner),
      }));
      setAdditionalAnalysis(tmpAdditionalAnalysis);
    });
  }, []);


  function getComparisonAfdDept(){
    const chartData = {
      datasets: [
        {
          label: "AfD",
          data: additionalAnalysis!.filter(item => item.partei === 'AfD')
          .map(item => ({ x: item.schuldendienstproeinwohner, y: item.anteilStimmen})),
          backgroundColor: additionalAnalysis!.map(_ => 'rgba(0,0,128,1)'),
          borderColor: 'rgba(0,0,128,1)',
        },
      ],
    }
    return chartData;
  }

  function getComparisonGreenStudents(){
    const chartData = {
      datasets: [
        {
          label: "GRÜNE",
          data: additionalAnalysis!.filter(item => item.partei === 'GRÜNE')
          .map(item => ({ x: item.anteilstudentenproeinwohner, y: item.anteilStimmen })),
          backgroundColor: additionalAnalysis!.map(_ => 'rgba(0,0,128,1)'),
          borderColor: 'rgba(0,0,128,1)',
        },
      ],
    }
    return chartData;
  }

  if (!additionalAnalysis)
  return <div>Loading...</div>;
  return (
    <div className="close-winners-container overview-section">


      <div className="scatter-charts-container">
        <h3>Anteil an AfD Wählern in Prozent (y-Achse), in Relation zum Schuldendienst des Regierungsbezirks pro Einwohner in € (x-Achse).</h3>
        <div className="chart-container">
          <Scatter data={getComparisonAfdDept()} options={userChartOptions} />
        </div>
        <h3>Anteil der Grünen-Wähler in Prozent (y-Achse), in Relation zum Anteil der Universitäts- und Hochschulstudenten pro Einwohner (x-Achse).</h3>
        <div className="chart-container">
          <Scatter data={getComparisonGreenStudents()} options={userChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default AdditionalResearch;
