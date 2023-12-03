// ListWithButtons.js
import ListItem from "./ListItem";

const ListWithButtons = ({ data }) => {
  return (
    <ul className="hm-list">
      {data.map((item, index) => (
        <li key={index}>
          <ListItem item={item} />
        </li>
      ))}
    </ul>
  );
};

export default ListWithButtons;
