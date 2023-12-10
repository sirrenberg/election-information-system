import { useState } from "react";
import "../styles/HamburgerMenu.css";
import ListWithButtons from "./ListWithButtons";
import { menuEntry } from "../helper/types";

function HamburgerMenu({ data }: { data: menuEntry[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hamburger-container">
      <label className="hamburger-menu">
        <input
          type="checkbox"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
      </label>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ListWithButtons data={data} />
      </div>
    </div>
  );
}

export default HamburgerMenu;
