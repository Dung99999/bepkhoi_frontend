import React, { useState } from "react";
import { Radio } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./MenuFilterCommon.css";

interface Props {
  status: string;
  setStatus: (value: string) => void;
}

const options = [
  { label: "Tất cả", value: "all" },
  { label: "Đang kinh doanh", value: "1" },
  { label: "Ngừng kinh doanh", value: "0" },
];

const MenuStatusFilter: React.FC<Props> = ({ status, setStatus }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e: any) => {
    setStatus(e.target.value);
  };

  return (
    <div className="filter-wrapper p-[1vw] border border-solid border-gray-200 rounded-[0.5vw] mb-[1vw]">
      <div className="filter-header flex justify-between items-center mb-[0.8vw]">
        <label className="block font-semibold m-0 text-[0.95vw]">
          Hiển thị
        </label>
        <div
          className="toggle-icon-wrapper text-[0.9vw] cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <CaretUpOutlined className="text-[0.9vw]" />
          ) : (
            <CaretDownOutlined className="text-[0.9vw]" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="pl-[0.5vw]">
          <Radio.Group
            value={status}
            onChange={handleChange}
            className="custom-radio-group flex flex-col gap-[0.8vw]"
          >
            {options.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                className="radio-item text-[0.9vw] m-0 hover:text-blue-500"
              >
                <span className="text-[0.9vw]">{opt.label}</span>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      )}
    </div>
  );
};

export default MenuStatusFilter;
