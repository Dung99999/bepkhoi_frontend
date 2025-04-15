import React, { useState } from "react";
import { Radio } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./MenuFilterCommon.css";

interface Props {
  status: string;
  setStatus: (value: string) => void;
}

const options = [
  { label: "Đang sử dụng", value: "1" },
  { label: "Đã xóa", value: "0" },
];

const RoomStatusFilter: React.FC<Props> = ({ status, setStatus }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e: any) => {
    setStatus(e.target.value);
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
        <Radio.Group
          value={status}
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

export default RoomStatusFilter;
