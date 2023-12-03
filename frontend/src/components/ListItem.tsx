// ListItemWithButton.js
import { useState } from "react";

function ListItem({ item }: { item: any }) {
  const [isSublistOpen, setIsSublistOpen] = useState(false);

  const toggleSublist = () => {
    setIsSublistOpen(!isSublistOpen);
  };

  return (
    <div className="hm-list-item">
      <div className="hm-list-item-content">
        <p
          className="hm-list-item-text"
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          {item.title}
        </p>
        <div className="arrow-container" onClick={toggleSublist}>
          <i className={`arrow ${isSublistOpen ? "up" : "down"}`}></i>
        </div>
      </div>

      <ul style={{ display: isSublistOpen ? "block" : "none" }}>
        {item.sublist.map((subitem, index) => (
          <li className="hm-list-subitem" key={index}>
            {subitem}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListItem;
