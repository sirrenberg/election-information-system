// ListItemWithButton.js
import { useState } from "react";
import { Link } from "react-router-dom";
import { menuEntry } from "../helper/types";

function ListItem({ item }: { item: menuEntry }) {
  const [isSublistOpen, setIsSublistOpen] = useState(false);

  const toggleSublist = () => {
    setIsSublistOpen(!isSublistOpen);
  };

  return (
    <div className="hm-list-item">
      <div className="hm-list-item-content">
        <Link to={`/results/${item.main_link}`}>
          <p
            className="hm-list-item-text"
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            {item.title}
          </p>
        </Link>
        <div className="arrow-container" onClick={toggleSublist}>
          <i className={`arrow ${isSublistOpen ? "up" : "down"}`}></i>
        </div>
      </div>

      <ul style={{ display: isSublistOpen ? "block" : "none" }}>
        {item.sublist.map((subitem, index) => (
          <li className="hm-list-subitem" key={index}>
            <Link to={`/results/${subitem.link}`}>
              <p className="hm-list-item-text">{subitem.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListItem;
