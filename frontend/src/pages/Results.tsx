import "../styles/Results.css";
import HamburgerMenu from "../components/HamburgerMenu";
import RegionResult from "../components/RegionResult";
import { useState } from "react";
import { menuEntry } from "../helper/types";
import { groupBy } from "../helper/misc";

function Results() {
  const [menuData, setMenuData] = useState<menuEntry[]>([]);
  fetch("http://localhost:3000/stimmkreise")
    .then((response) => response.json())
    .then((data) => {
      const groupedData = groupBy(data, "wahlkreisname");

      // convert into menuEntry
      const menuData: menuEntry[] = [];
      for (const [key, value] of Object.entries(groupedData)) {
        const entry: menuEntry = {
          title: key,
          sublist: value.map((item) => item.name),
        };
        menuData.push(entry);
      }

      setMenuData(menuData);
    });

  return (
    <div className="results-container ">
      <HamburgerMenu data={menuData} />
      <RegionResult />
    </div>
  );
}

export default Results;
