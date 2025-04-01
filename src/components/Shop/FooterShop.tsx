import React, { useEffect, useState } from "react";
import { HomeFilled, ShoppingCartOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface FooterShopProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const FooterShop: React.FC<FooterShopProps> = ({ activeTab, setActiveTab }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    navigate(tab === "home" ? "/shop/menu" : tab === "cart" ? "/shop/cart" : "/shop/others");
  };

  return (
    <footer className="bg-[#FCE9D2] py-3 px-6 flex justify-around items-center shadow-t-md">
      <div
        className={`flex flex-col items-center space-y-1 cursor-pointer ${activeTab === "home" ? "text-yellow-500" : "text-gray-700"}`}
        onClick={() => handleClick("home")}
      >
        <HomeFilled className="text-3xl" />
        <div className="text-sm font-semibold">Trang chủ</div>
      </div>

      <div
        className={`relative flex flex-col items-center space-y-1 cursor-pointer ${activeTab === "cart" ? "text-yellow-500" : "text-gray-700"}`}
        onClick={() => handleClick("cart")}
      >
        <div className="relative">
          <ShoppingCartOutlined className="text-3xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cartCount}
            </span>
          )}
        </div>
        <div className="text-sm font-semibold">Giỏ hàng</div>
      </div>

      <div
        className={`flex flex-col items-center space-y-1 cursor-pointer ${activeTab === "others" ? "text-yellow-500" : "text-gray-700"}`}
        onClick={() => handleClick("others")}
      >
        <AppstoreOutlined className="text-3xl" />
        <div className="text-sm font-semibold">Khác</div>
      </div>
    </footer>
  );
};

export default FooterShop;
