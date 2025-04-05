import React, { useState, useEffect } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png";

interface HeaderShopProps {
  setActiveTab: (tab: string) => void;
}

const HeaderShop: React.FC<HeaderShopProps> = ({ setActiveTab }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleCartClick = () => {
    setActiveTab("cart");
    navigate("/shop/cart");
  };

  return (
    <header className="bg-[#FCE9D2] py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3 pl-2">
        <img src={logoBepKhoi} alt="Logo Bếp Khói" className="w-14 h-14 object-contain" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-gray-800">Nhà hàng Bếp Khói</div>
          <div className="text-xs italic text-gray-500 -mt-1">Nâng niu văn hóa ẩm thực Việt</div>
        </div>
      </div>

      <div className="relative pr-2" onClick={handleCartClick}>
        <div id="cart-icon" className="bg-gray-200 rounded-full p-3 flex items-center justify-center shadow-md relative cursor-pointer">
          <ShoppingCartOutlined className="text-2xl text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderShop;
