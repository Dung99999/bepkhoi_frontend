import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./MenuFilterCommon.css";

interface Props {
  category: string[];
  setCategory: (value: string[]) => void;
}

interface Category {
  productCategoryId: number;
  productCategoryTitle: string;
}

const MenuCategoryFilter: React.FC<Props> = ({ category, setCategory }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const token = localStorage.getItem("Token");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7257/api/product-categories/get-all-categories",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // choose radio
  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value === "all") {
      setCategory([]);
    } else {
      setCategory([value]);
    }
  };

  const getCheckedValues = () => {
    if (category.length === 0) return "all";
    return category[0];
  };

  // Prepare options with "Tất cả" and categories
  const allOptions = [
    { value: "all", label: "Tất cả" },
    ...categories.map((cat) => ({
      value: cat.productCategoryId.toString(),
      label: cat.productCategoryTitle,
    })),
  ];

  // Display only first 3 items or all items based on showAll state
  const displayedOptions = showAll ? allOptions : allOptions.slice(0, 4); // 4 because we include "Tất cả"

  return (
    <div className="category-filter-wrapper p-4 border border-solid border-gray-200 rounded-[0.5vw] mb-[0.5vw]">
      <div className="category-filter-header flex justify-between items-center mb-[0.5vw]">
        <label className="block font-semibold text-[1vw]">Loại hàng</label>
        <div
          className="toggle-icon-wrapper text-sm cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <CaretUpOutlined className="text-[1vw]" />
          ) : (
            <CaretDownOutlined className="text-[1vw]" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="pl-2">
          <Radio.Group
            value={getCheckedValues()}
            onChange={handleChange}
            className="custom-radio-group flex flex-col gap-[0.75vw]"
          >
            {displayedOptions.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                className="radio-item text-[1vw] m-0 hover:text-blue-500"
              >
                <span className="text-[1vw]">{opt.label}</span>
              </Radio>
            ))}
          </Radio.Group>

          {categories.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-orange-300 hover:text-orange-400 text-[1vw] mt-[0.5vw] ml-[0.5vw]"
            >
              {showAll ? "Thu gọn" : "Xem thêm..."}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCategoryFilter;
