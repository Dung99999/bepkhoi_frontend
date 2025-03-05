import React, { useState } from "react";
import styles from "./../../style/MenuPage/menuSearch.module.scss";

const MenuSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={styles.searchBox}>
      <h3>Tìm kiếm</h3>
      <input
        type="text"
        placeholder="Theo mã, tên hàng"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default MenuSearch;
