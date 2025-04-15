import React, { useState, useEffect } from "react";
import { Radio, Spin, Button } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios để gọi API
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://localhost:7257/api/product-categories/get-all-categories",
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle radio change
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

  return (
    <div className="category-filter-wrapper">
      <div className="category-filter-header">
        <label className="block font-semibold m-0">Loại hàng</label>
        <div className="toggle-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      </div>

      {isOpen && (
        <div>
          {loading ? (
            <Spin />
          ) : (
            <>
              <Radio.Group
                value={getCheckedValues()}
                onChange={handleChange}
                className="custom-radio-group"
              >
                <Radio value="all">Tất cả</Radio>
                {(showAll ? categories : categories.slice(0, 3)).map((cat) => (
                  <Radio
                    key={cat.productCategoryId}
                    value={cat.productCategoryId.toString()}
                  >
                    {cat.productCategoryTitle}
                  </Radio>
                ))}
              </Radio.Group>
              {categories.length > 3 && (
                <Button
                  type="link"
                  onClick={() => setShowAll(!showAll)}
                  className="font-semibold"
                  style={{ color: "#FBBF24" }}
                >
                  {showAll ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCategoryFilter;
