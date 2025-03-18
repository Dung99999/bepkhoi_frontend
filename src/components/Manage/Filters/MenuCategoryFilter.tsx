import React, { useState } from "react";
import { Radio } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"; 
import "./MenuFilterCommon.css";

interface Props {
  category: string[]; 
  setCategory: (value: string[]) => void;
}

const options = [
  { label: "Tất cả", value: "all" }, 
  { label: "Đồ ăn", value: "1" },
  { label: "Đồ ăn nhanh", value: "2" },
  { label: "Đồ uống", value: "3" },
];

const MenuCategoryFilter: React.FC<Props> = ({ category, setCategory }) => {
  const [isOpen, setIsOpen] = useState(true);

  // choose radio
  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value === "all") 
    {
      setCategory([]);
    }
    else 
    {
      setCategory([value]);
    }
  };

  const getCheckedValues = () => {
    if (category.length === 0) return "all";
    return category[0];
  };

  return (
    <div className="category-filter-wrapper">
      <div className="category-filter-header">
        <label className="block font-semibold m-0">Loại hàng</label>
        <div className="toggle-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />} 
        </div>
      </div>

      {isOpen && (
        <Radio.Group
          value={getCheckedValues()}
          onChange={handleChange}
          className="custom-radio-group"
        >
          {options.map((opt) => (
            <Radio key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Radio.Group>
      )}
    </div>
  );
};

export default MenuCategoryFilter;
