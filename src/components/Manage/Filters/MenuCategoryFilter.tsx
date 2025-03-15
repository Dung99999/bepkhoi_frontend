import React, { useState } from "react";
import { Checkbox } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"; // ✅ Đổi icon
import "./MenuFilterCommon.css";

interface Props {
  category: string[]; // Cho phép chọn nhiều
  setCategory: (value: string[]) => void;
}

const options = [
  { label: "Tất cả", value: "all" }, // Option tất cả
  { label: "Đồ ăn", value: "food" },
  { label: "Đồ uống", value: "drink" },
  { label: "Khác", value: "other" },
];

const allOptionValues = options.slice(1).map((opt) => opt.value); // ["food", "drink", "other"]

const MenuCategoryFilter: React.FC<Props> = ({ category, setCategory }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (checkedValues: (string | number)[]) => {
    if (checkedValues.includes("all")) {
      // Toggle "Tất cả"
      if (category.length === allOptionValues.length) {
        setCategory([]); // Bỏ chọn tất cả
      } else {
        setCategory(allOptionValues); // Chọn tất cả
      }
    } else {
      const filteredValues = (checkedValues as string[]).filter((val) => val !== "all");
      setCategory(filteredValues);
    }
  };

  const getCheckedValues = () => {
    if (category.length === allOptionValues.length) {
      return ["all", ...allOptionValues];
    }
    return category;
  };

  return (
    <div className="category-filter-wrapper">
      <div className="category-filter-header">
        <label className="block font-semibold m-0">Loại hàng</label>
        <div className="toggle-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />} {/* ✅ Dùng Caret icon */}
        </div>
      </div>

      {isOpen && (
        <Checkbox.Group
          value={getCheckedValues()}
          onChange={handleChange}
          className="custom-checkbox-group"
        >
          {options.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )}
    </div>
  );
};

export default MenuCategoryFilter;
