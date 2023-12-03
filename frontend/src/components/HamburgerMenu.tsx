import { useState } from "react";
import "../styles/HamburgerMenu.css";
import ListWithButtons from "./ListWithButtons";
import { menuEntry } from "../helper/types";

function HamburgerMenu(data: menuEntry[]) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hamburger-container">
      <div className="hamburger-btn">
        <button
          id="toggle-button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          HM
        </button>
      </div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ListWithButtons data={data} />
      </div>
    </div>
  );
}

export default HamburgerMenu;
