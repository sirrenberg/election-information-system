import "../styles/DistrictResult.css";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { chartData } from "../helper/types";
import { useEffect, useState } from "react";
import { useAPI } from "../hooks/useAPI";
import {
  stimmkreisuebersicht,
  stimmkreisParteiErgebnis,
  stimmkreisSieger,
} from "../helper/types";

function DistrictResultFromSingleVotes({ id }: { id: string }) {
  const date_current_election = "2023-10-08";
  const date_prev_election = "2018-10-14";

  const { sendRequest } = useAPI();
  const [stimmkreisuebersicht, setStimmkreisuebersicht] =
    useState<stimmkreisuebersicht>();
  const [stimmkreisParteiErgebnisse, setStimmkreisParteiErgebnisse] =
    useState<stimmkreisParteiErgebnis[]>();
  const [stimmkreisSieger, setStimmkreisSieger] = useState<stimmkreisSieger>();

  useEffect(() => {
    sendRequest(
      `/stimmkreisuebersicht/single_votes?date_current_election=${date_current_election}&date_prev_election=${date_prev_election}&id=${id}`,
      "GET"
    ).then((data) => {
      const elem = data.direktkandidat[0];
      const stimmkreisuebersicht: stimmkreisuebersicht = {
        beteiligung: Number(elem.beteiligung),
        kandidatenname: elem.kandidatennamen,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmenFürKandidat: Number(elem.anzahlstimmen),
        anzahlWaehlerStimmkreis: Number(elem.anzahlwaehler),
        anzahlStimmberechtigteStimmkreis: Number(elem.anzahlstimmberechtigte),
        stimmkreisname: elem.stimmkreisname,
        diffBeteiligung: Number(elem.diffbeteiligung),
        letzterDirektkandidat: elem.letzterdirektkandidat,
        parteiLetzterDirektkandidat: elem.parteiletzterdirektkandidat,
        diffStimmen: Number(elem.diffstimmen),
        diffWaehler: Number(elem.diffwaehler),
        diffStimmberechtigte: Number(elem.diffstimmberechtigte),
      };
      setStimmkreisuebersicht(stimmkreisuebersicht);

      const spe: stimmkreisParteiErgebnis[] = data.stimmen.map((elem: any) => ({
        parteiname: elem.parteiname,
        kurzbezeichnung: elem.kurzbezeichnung,
        anzahlStimmen: Number(elem.anzahlstimmen),
        anzahlStimmenRelativ: Number(elem.prozentualstimmen),
        parteiFarbe: elem.farbe,
        diffstimmenabsolut: Number(elem.diffstimmenabsolut),
        diffstimmenrel: Number(elem.diffstimmenrel),
      }));
      setStimmkreisParteiErgebnisse(spe);

      const sieger = data.stimmkreissieger[0];
      const sks: stimmkreisSieger = {
        erststimmensieger: sieger.erststimmensiegerpartei,
        erststimmensiegerstimmen: Number(sieger.erststimmensiegerstimmen),
        zweitstimmensieger: sieger.zweitstimmensiegerpartei,
        zweitstimmensiegerstimmen: Number(sieger.zweitstimmensiegerstimmen),
        gesamtstimmensieger: sieger.gesamtstimmensiegerpartei,
        gesamtstimmensiegerstimmen: Number(sieger.gesamtstimmensiegerstimmen),
      };
      setStimmkreisSieger(sks);
    });
  }, [id]);

  function getTotalVotesChartData(): chartData {
    const chartData: chartData = {
      labels: stimmkreisParteiErgebnisse!
        .filter((elem) => elem.anzahlStimmen !== 0)
        .map((elem) => elem.kurzbezeichnung),
      datasets: [
        {
          label: "Stimmen",
          data: stimmkreisParteiErgebnisse!.map((elem) => elem.anzahlStimmen),
          backgroundColor: stimmkreisParteiErgebnisse!.map(
            (elem) => elem.parteiFarbe
          ),
        },
      ],
    };
    return chartData;
  }

  function getTotalVotesDiffChartData(): chartData {
    const chartData: chartData = {
      labels: stimmkreisParteiErgebnisse!.map((elem) => elem.kurzbezeichnung),
      datasets: [
        {
          label: "Stimmen",
          data: stimmkreisParteiErgebnisse!.map(
            (elem) => elem.diffstimmenabsolut
          ),
          backgroundColor: stimmkreisParteiErgebnisse!.map(
            (elem) => elem.parteiFarbe
          ),
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
          data: stimmkreisParteiErgebnisse!.map((elem) =>
            (elem.anzahlStimmenRelativ * 100).toFixed(1)
          ),
          backgroundColor: stimmkreisParteiErgebnisse!.map(
            (elem) => elem.parteiFarbe
          ),
        },
      ],
    };
    return chartData;
  }

  function getRelativeVotesDiffChartData(): chartData {
    const chartData: chartData = {
      labels: stimmkreisParteiErgebnisse!.map((elem) => elem.kurzbezeichnung),
      datasets: [
        {
          label: "Stimmen in Prozent",
          data: stimmkreisParteiErgebnisse!.map((elem) =>
            (Number(elem.diffstimmenrel) * 100).toFixed(1)
          ),
          backgroundColor: stimmkreisParteiErgebnisse!.map(
            (elem) => elem.parteiFarbe
          ),
        },
      ],
    };
    return chartData;
  }

  if (!stimmkreisuebersicht || !stimmkreisParteiErgebnisse)
    return <div>Loading...</div>;
  return (
    <div className="district-res-container">
      <h1 className="district-title">
        {id} - {stimmkreisuebersicht?.stimmkreisname}
      </h1>
      <div className="district-info-tables">
        <div className="district-table-container">
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>gewählter Direktkandidat</th>
                <th>Anzahl Stimmen*</th>
                <th>Sieger vorherige Wahl</th>
                <th>Anzahl Stimmberechtigte*</th>
                <th>Abgegebene Stimmen*</th>
                <th>Wahlbeteiligung*</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {stimmkreisuebersicht?.kandidatenname} (
                  {stimmkreisuebersicht?.kurzbezeichnung})
                </td>
                <td>
                  {stimmkreisuebersicht?.anzahlStimmenFürKandidat + " "}(
                  {stimmkreisuebersicht?.diffStimmen >= 0 ? "+" : ""}
                  {stimmkreisuebersicht?.diffStimmen})
                </td>
                <td>
                  {stimmkreisuebersicht?.letzterDirektkandidat} (
                  {stimmkreisuebersicht?.parteiLetzterDirektkandidat})
                </td>
                <td>
                  {stimmkreisuebersicht?.anzahlStimmberechtigteStimmkreis + " "}
                  ({stimmkreisuebersicht?.diffStimmberechtigte >= 0 ? "+" : ""}
                  {stimmkreisuebersicht?.diffStimmberechtigte})
                </td>
                <td>
                  {stimmkreisuebersicht?.anzahlWaehlerStimmkreis + " "}(
                  {stimmkreisuebersicht?.diffWaehler >= 0 ? "+" : ""}
                  {stimmkreisuebersicht?.diffWaehler})
                </td>
                <td>
                  {(stimmkreisuebersicht?.beteiligung * 100).toFixed(2)}% (
                  {stimmkreisuebersicht?.diffBeteiligung >= 0 ? "+" : ""}
                  {(stimmkreisuebersicht?.diffBeteiligung * 100).toFixed(2)}%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p>* In Klammern sind jeweils die Änderungen zum Vorjahr angegeben.</p>

      <div className="district-info-tables">
        <div className="district-table-container">
          <table className="district-table info-table">
            <thead>
              <tr>
                <th>Siegerpartei Erststimmen**</th>
                <th>Siegerpartei Zweitstimmen**</th>
                <th>Siegerpartei Gesamtstimmen**</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {stimmkreisSieger?.erststimmensieger} (
                  {stimmkreisSieger?.erststimmensiegerstimmen})
                </td>
                <td>
                  {stimmkreisSieger?.zweitstimmensieger} (
                  {stimmkreisSieger?.zweitstimmensiegerstimmen})
                </td>
                <td>
                  {stimmkreisSieger?.gesamtstimmensieger} (
                  {stimmkreisSieger?.gesamtstimmensiegerstimmen})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p>
        ** In Klammern ist jeweils die Anzahl der Erst-, Zweit- und
        Gesamtstimmen angegeben.
      </p>

      <div className="district-res-charts">
        <div className="district-res-section">
          <h2 className="district-res-subtitle">
            Anzahl der Gesamtstimmen (absolut)
          </h2>
          <div className="chart-container">
            <BarChart chartData={getTotalVotesChartData()} />
          </div>
        </div>
        <div className="district-res-section">
          <h2 className="district-res-subtitle">
            Gesamtstimmendifferenz zur vorherigen Wahl (absolut)
          </h2>
          <div className="chart-container">
            <BarChart
              chartData={
                stimmkreisParteiErgebnisse && getTotalVotesDiffChartData()
              }
            />
          </div>
        </div>
      </div>

      <div className="district-res-charts">
        <div className="district-res-section">
          <h2 className="district-res-subtitle">
            Anzahl der Stimmen (relativ)
          </h2>
          <div className="chart-container">
            <PieChart chartData={getRelativeVotesChartData()} />
          </div>
        </div>
        <div className="district-res-section">
          <h2 className="district-res-subtitle">
            Stimmendifferenz zur vorherigen Wahl (relativ)
          </h2>
          <div className="chart-container">
            <BarChart chartData={getRelativeVotesDiffChartData()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictResult;
