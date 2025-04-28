import React, { useState, useEffect, useRef } from "react";
import { Input, List, Avatar, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { useAuth } from "../../../../context/AuthContext"; // Import AuthContext
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedOrder: number | null;
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
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const jsonResponse = await response.json();
    if (!jsonResponse.success) {
      throw new Error(jsonResponse.message || "Failed to fetch menu");
    }

    const menuItems = jsonResponse.data;
    if (!Array.isArray(menuItems)) {
      throw new Error("Unexpected API response format: data is not an array");
    }

    return menuItems
      .filter((item) => item.isAvailable === true)
      .map((item) => ({
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

const POSSearchBarLeftSide: React.FC<Props> = ({ selectedOrder }) => {
  const { authInfo, clearAuthInfo } = useAuth(); // Sử dụng AuthContext
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<menuItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<menuItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const loadData = async () => {
      const menu = await fetchMenu(authInfo?.token || "", clearAuthInfo);
      setAllProducts(menu);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "F3") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectProduct = async (item: menuItem) => {
    if (selectedOrder != null) {
      try {
        const result = await fetchAddProductToOrder(
          selectedOrder,
          item.productId,
          authInfo?.token || "",
          clearAuthInfo
        );
        console.log("Product added:", result.message);
      } catch (error: any) {
        console.error("Failed to add product:", error.message);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const normalizeString = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedValue = normalizeString(value);
    if (normalizedValue.trim() === "") {
      setFilteredProducts([]);
    } else {
      setFilteredProducts(
        allProducts.filter((product) => {
          const normalizedName = normalizeString(product.productName);
          const normalizedId = product.productId.toString();
          return (
            normalizedName.includes(normalizedValue) ||
            normalizedId.includes(normalizedValue)
          );
        })
      );
      setIsFocused(true);
    }
  };

  return (
    <div ref={searchRef} className="absolute w-[20vw] translate-y-[-1vw] z-50">
      <Input
        ref={inputRef}
        placeholder="Tìm món ăn(F3)"
        className="w-full rounded-full transition-all duration-200"
        style={{
          width: "350px",
          border: `2px solid ${isFocused ? "#FFE4B5" : "#d9d9d9"}`,
          boxShadow: isFocused
            ? "0px 0px 5px rgba(255, 228, 181, 0.7)"
            : "none",
        }}
        prefix={<SearchOutlined className="opacity-50" />}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {isFocused && searchTerm && filteredProducts.length > 0 && (
        <div
          style={{ width: "380px" }}
          className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-50 max-h-60 overflow-y-auto"
        >
          <List
            itemLayout="horizontal"
            dataSource={filteredProducts}
            renderItem={(product) => (
              <List.Item
                onClick={() => handleSelectProduct(product)}
                className="hover:bg-[#faedd7] cursor-pointer transition-colors duration-200 z-100 px-4 py-2 flex items-center"
              >
                <Avatar
                  style={{ marginLeft: "10px" }}
                  src={product.productImageUrl}
                  size={50}
                  className="mr-2"
                />
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-black">
                    {product.productName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Mã sản phẩm: {product.productId}
                  </div>
                </div>
                <div className="ml-auto text-right mr-3">
                  <div className="text-blue-500 font-medium">
                    <span style={{ color: "black", fontWeight: "lighter" }}>
                      Giá:
                    </span>{" "}
                    {product.salePrice.toLocaleString()} VND
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default POSSearchBarLeftSide;