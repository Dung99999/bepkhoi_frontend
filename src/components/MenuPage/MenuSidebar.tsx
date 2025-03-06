import React, {useState} from "react";
import styles from "./../../style/MenuPage/menuSidebar.module.scss";
import MenuSearch from "./MenuSearch.tsx";


const MenuSidebar = ({ selectedFilters, onFilterChange }) => {
  const categories = [
    { title: "Loại thực đơn", items: ["Đồ ăn", "Đồ uống", "Khác"] },
    { title: "Lựa chọn hiển thị", items: ["Hàng đang kinh doanh", "Hàng ngừng kinh doanh"] },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckboxChange = (category: string) => {
    let updatedFilters = selectedFilters.includes(category)
      ? selectedFilters.filter((f) => f !== category)
      : [...selectedFilters, category];
    onFilterChange(updatedFilters);
  };

  return (
    <div className={styles.sidebar}>
      <MenuSearch />

      {categories.map((group, index) => (
        <div key={index} className={styles["category-group"]}>
          <h3>{group.title}</h3>
          {group.items.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={selectedFilters.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuSidebar;
