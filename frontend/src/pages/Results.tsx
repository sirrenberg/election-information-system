import "../styles/Results.css";
import HamburgerMenu from "../components/HamburgerMenu";
import RegionResult from "../components/RegionResult";
import { useState } from "react";
import { menuEntry } from "../helper/types";

function Results() {
  const [menuData, setMenuData] = useState<menuEntry[]>([]);
  fetch("http://localhost:3000/stimmkreise")
    .then((response) => response.json())
    .then((data) => console.log(data));

  const data = [
    {
      title: "Button 1",
      sublist: ["Subitem 1.1", "Subitem 1.2", "Subitem 1.3"],
    },
    {
      title: "Button 2",
      sublist: ["Subitem 2.1", "Subitem 2.2", "Subitem 2.3"],
    },
    // Add more items as needed
  ];

  return (
    <div className="results-container ">
      <HamburgerMenu data={menuData} />
      <RegionResult />
    </div>
  );
}

export default Results;
