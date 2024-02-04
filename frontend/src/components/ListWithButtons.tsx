// ListWithButtons.js
import ListItem from "./ListItem";
import { menuEntry } from "../helper/types";

function ListWithButtons({ data }: { data: menuEntry[] }) {
  return (
    <ul className="hm-list">
      {data.map((item, index) => (
        <li key={index}>
          <ListItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default ListWithButtons;
