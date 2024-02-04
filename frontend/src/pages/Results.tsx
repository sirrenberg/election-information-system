import "../styles/Results.css";
import HamburgerMenu from "../components/HamburgerMenu";
import DistrictResult from "../components/DistrictResult";
import RegionResult from "../components/RegionResult";
import { useEffect, useState } from "react";
import { menuEntry, stimmkreis } from "../helper/types";
import { groupBy } from "../helper/misc";
import { useAPI } from "../hooks/useAPI";
import { useParams } from "react-router-dom";

function Results() {
  const { sendRequest } = useAPI();
  const { id } = useParams<{ id: string }>();

  function isStimmkreis(id: string) {
    // Wahlkreisid starts with 9
    if (id.startsWith("9")) {
      return false;
    } else {
      return true;
    }
  }

  const [menuData, setMenuData] = useState<menuEntry[]>([]);

  useEffect(() => {
    sendRequest("/stimmkreise", "GET").then((data: stimmkreis[]) => {
      const groupedData = groupBy(data, (item) => item.wahlkreisid);

      // convert into menuEntry
      const menuData: menuEntry[] = [];
      for (const [key, value] of Object.entries(groupedData)) {
        const entry: menuEntry = {
          title: key,
          main_link: value[0].wahlkreisid,
          sublist: value.map((item: any) => ({
            name: item.name,
            link: item.stimmkreisid,
          })),
        };
        menuData.push(entry);
      }

      setMenuData(menuData);
    });
  }, []);

  return (
    <div className="results-container content-page">
      <HamburgerMenu data={menuData} />
      {!id && <h1>Bitte Wahl-/Stimmkreis auswählen</h1>}
      {id && isStimmkreis(id) && <DistrictResult id={id} />}
      {id && !isStimmkreis(id) && <RegionResult id={id} />}
    </div>
  );
}

export default Results;
