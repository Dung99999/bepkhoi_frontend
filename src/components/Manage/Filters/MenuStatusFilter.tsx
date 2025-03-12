import React, { useState } from "react";
import { Checkbox } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./MenuFilterCommon.css"; // ✅ Dùng file CSS chung

interface Props {
  status: string[]; // ✅ Cho phép chọn nhiều trạng thái
  setStatus: (value: string[]) => void;
}

const options = [
  { label: "Tất cả", value: "all" }, // Option tất cả
  { label: "Đang hiển thị", value: "visible" },
  { label: "Không hiển thị", value: "hidden" },
];

const allOptionValues = options.slice(1).map((opt) => opt.value); // ["visible", "hidden"]

const MenuStatusFilter: React.FC<Props> = ({ status, setStatus }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (checkedValues: (string | number)[]) => {
    if (checkedValues.includes("all")) {
      if (status.length === allOptionValues.length) {
        setStatus([]); // Bỏ chọn tất cả
      } else {
        setStatus(allOptionValues); // Chọn tất cả
      }
    } else {
      const filteredValues = (checkedValues as string[]).filter((val) => val !== "all");
      setStatus(filteredValues);
    }
  };

  const getCheckedValues = () => {
    if (status.length === allOptionValues.length) {
      return ["all", ...allOptionValues];
    }
    return status;
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-header">
        <label className="block font-semibold m-0">Hiển thị</label>
        <div className="toggle-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
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

export default MenuStatusFilter;
