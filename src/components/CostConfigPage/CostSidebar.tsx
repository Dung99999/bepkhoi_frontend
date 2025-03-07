import React, {useState} from "react";
import styles from "./../../style/CostConfigPage/costSidebar.module.css";
import MenuSearch from "./CostSearch.tsx";


const CostSidebar = ({ selectedFilters, onFilterChange }) => {
  const categories = [
    { title: "Nhóm hàng", items: ["Đồ ăn", "Đồ uống", "Khác"] },
  ];

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

export default CostSidebar;
