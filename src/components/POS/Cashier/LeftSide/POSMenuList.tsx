import React, { useState, useEffect } from "react";
import { message, Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import notFoundImage from "../../../../styles/ErrorProductImage/image-not-found.png";
import { useAuth } from "../../../../context/AuthContext"; // Import AuthContext
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedTable: number | null;
  selectedOrder: number | null;
}
const ITEMS_PER_PAGE = 8;
interface categoryOption {
  label: string;
  value: number | null;
}
interface menuItem {
  productId: number;
  productName: string;
  productCategoryId: number;
  costPrice: number;
  sellPrice: number;
  salePrice: number;
  productVat: number;
  description: string;
  unitId: number;
  isAvailable: boolean;
  status: boolean;
  productImageUrl: string;
  isDelete: boolean;
}
interface CategoryOption {
  label: string;
  value: number | null;
}
interface isAvailableOption {
  label: string;
  value: boolean | null;
}

async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/product-categories/get-all-categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: {
      productCategoryId: number | null;
      productCategoryTitle: string;
    }[] = await response.json();

    let options = data.map((item) => ({
      label: item.productCategoryTitle,
      value: item.productCategoryId,
    }));

    options.splice(0, 0, { label: "Tất Cả", value: null });

    return options;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchMenu(token: string, clearAuthInfo: () => void): Promise<menuItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Menu/get-menu-pos`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      return[];
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.success) {
      return [];
    }

    const menuItems = jsonResponse.data;

    if (!Array.isArray(menuItems)) {
      throw new Error("Unexpected API response format: data is not an array");
    }

    return menuItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productCategoryId: item.productCategoryId,
      costPrice: item.costPrice ?? 0,
      sellPrice: item.sellPrice,
      salePrice: item.salePrice ?? item.sellPrice,
      productVat: item.productVat,
      description: item.description ?? "",
      unitId: item.unitId,
      isAvailable: item.isAvailable,
      status: item.status,
      productImageUrl: item.productImageUrl ?? "",
      isDelete: item.isDelete ?? false,
    }));
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

async function fetchCategoryFilter(
  selectedCategory: number | null,
  choosedIsAvailable: boolean | null,
  token: string,
  clearAuthInfo: () => void
): Promise<menuItem[]> {
  try {
    const query = new URLSearchParams();

    if (selectedCategory !== null) {
      query.append("categoryId", selectedCategory.toString());
    }
    if (choosedIsAvailable !== null) {
      query.append("isAvailable", choosedIsAvailable.toString());
    }

    const response = await fetch(`${API_BASE_URL}api/Menu/filter-menu-pos?${query.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: menuItem[] = await response.json();

    return data.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productCategoryId: item.productCategoryId,
      costPrice: item.costPrice ?? 0,
      sellPrice: item.sellPrice,
      salePrice: item.salePrice ?? item.sellPrice,
      productVat: item.productVat,
      description: item.description ?? "",
      unitId: item.unitId,
      isAvailable: item.isAvailable,
      status: item.status,
      productImageUrl: item.productImageUrl ?? "",
      isDelete: item.isDelete ?? false,
    }));
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

async function fetchAddProductToOrder(
  orderId: number,
  productId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<{ message: string; data: any }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}api/orders/add-product-to-order`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({ orderId, productId }),
      }
    );

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product to order");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error adding product to order:", error.message);
    throw error;
  }
}

const POSMenuList: React.FC<Props> = ({
  selectedTable,
  selectedOrder,
}) => {
  const { authInfo, clearAuthInfo } = useAuth(); // Sử dụng AuthContext
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryOptionList, setCategoryOptionList] = useState<
    categoryOption[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [menu, setMenu] = useState<menuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<menuItem | null>(null);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = menu.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [choosedIsAvailable, setChoosedIsAvailable] = useState<boolean | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isAvailableFilterList: isAvailableOption[] = [
    { label: "Tất cả", value: null },
    { label: "Còn hàng", value: true },
    { label: "Hết hàng", value: false },
  ];

  async function getCategory() {
    const categories = await fetchCategories();
    setCategoryOptionList(categories);
  }
  async function getMenu() {
    const menu = await fetchMenu(authInfo?.token || "", clearAuthInfo);
    setMenu(menu);
  }
  async function getCategoryFilter() {
    const menu = await fetchCategoryFilter(
      selectedCategory,
      choosedIsAvailable,
      authInfo?.token || "",
      clearAuthInfo
    );
    setMenu(menu);
  }
  useEffect(() => {
    getCategory();
    getMenu();
  }, []); 

  useEffect(() => {
    getCategoryFilter();
  }, [selectedCategory, choosedIsAvailable]);

  const handleSelectItem = async (item: menuItem) => {
    setSelectedProduct(item);
    if (selectedOrder != null) {
      if(item.isAvailable === true){
        try {
          const result = await fetchAddProductToOrder(
            selectedOrder,
            item.productId,
            authInfo?.token || "",
            clearAuthInfo
          );
        } catch (error: any) {
          console.error("Failed to add product:", error.message);
        }
      }else{
        message.warning("Sản phẩm này đã hết hàng!");
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-4">
        <Radio.Group
          options={categoryOptionList}
          defaultValue={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        />
      </div>
      <div className="p-4 flex gap-4">
        <Radio.Group
          options={isAvailableFilterList}
          defaultValue={choosedIsAvailable}
          onChange={(e) => {
            setChoosedIsAvailable(e.target.value);
          }}
        />
      </div>
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 grid-rows-2 overflow-y-auto">
        {currentItems.map((item) => (
          <div
            key={item.productId}
            className={`rounded-lg  overflow-hidden pt-1 flex flex-col  w-full h-[11vw] items-center transition-colors duration-200 shadow-md
                ${(() => {
                  if (item.productId === selectedProduct?.productId) {
                    return "bg-blue-300";
                  } else if (item.productId === hoveredId) {
                    return "bg-[#FAEDD7]";
                  } else {
                    return "bg-[#fffbf5]";
                  }
                })()}
              `}
            onMouseEnter={() => setHoveredId(item.productId)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelectItem(item)}
          >
            <div className="relative flex flex-col items-center w-full gap-1">
              <img
                src={
                  item.productImageUrl ? item.productImageUrl : notFoundImage
                }
                alt="Not Found"
                className="absolute w-[72%] h-auto rounded-md z-0 shadow-md"
              />
              <div className="absolute justify-center rounded-lg p-1 flex flex-col items-center">
                <div className="w-[5vw] rounded-lg"></div>
                <div className="absolute w-[90%] text-[1vw] text-center translate-y-[6vw] bg-white text-black font-bold z-10 rounded-lg">
                  {item.salePrice}đ
                </div>
              </div>
            </div>

            <div className="relative translate-y-[7.5vw] text-[1vw] flex justify-center overflow-hidden text-center text-black font-bold w-[80%] h-[3vw] whitespace-nowrap">
              <div className="absolute w-[90%] flex justify-center">
                {item.productName}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-end gap-2 flex-shrink-0 bg-white sticky bottom-0 shadow-md">
        <LeftOutlined
          className={`cursor-pointer ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} / {Math.ceil(menu.length / ITEMS_PER_PAGE)}
        </span>
        <RightOutlined
          className={`cursor-pointer ${
            startIndex + ITEMS_PER_PAGE >= menu.length
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={() =>
            startIndex + ITEMS_PER_PAGE < menu.length &&
            setCurrentPage(currentPage + 1)
          }
        />
      </div>
    </div>
  );
};

export default POSMenuList;