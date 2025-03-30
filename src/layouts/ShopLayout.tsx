import React, { useState } from "react";
import HeaderShop from "../components/Shop/HeaderShop";
import FooterShop from "../components/Shop/FooterShop";
import { Outlet } from "react-router-dom";

interface ShopLayoutProps {
  modelMode: string;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ modelMode }) => {
  const [activeTab, setActiveTab] = useState("home");
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="sticky top-0 z-50 w-full">
        <HeaderShop setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>

      <div className="sticky bottom-0 z-50 w-full">
        <FooterShop activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default ShopLayout;
