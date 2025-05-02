import { AppstoreOutlined, HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../CustomHook/useCart";

const FooterShop: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleClick = (tab: string) => {
    const tabRoutes: Record<string, string> = {
      home: "/shop/menu",
      cart: "/shop/cart",
      others: "/shop/others",
    };

    navigate(tabRoutes[tab] || "/shop/menu");
  };

  const getActiveTab = (): string => {
    const path = location.pathname;

    if (["/shop/cart", "/shop/status", "/shop/payment"].some(p => path.startsWith(p))) {
      return "cart";
    }
    if (["/shop/menu", "/shop/category"].some(p => path.startsWith(p))) {
      return "home";
    }
    return "others";
  };

  const activeTab = getActiveTab();

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