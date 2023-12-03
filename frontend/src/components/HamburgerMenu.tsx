import { useState } from "react";
import "../styles/HamburgerMenu.css";
import ListWithButtons from "./ListWithButtons";

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
