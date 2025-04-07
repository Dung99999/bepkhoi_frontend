import React, { createContext, useState } from "react";
import HeaderShop from "../components/Shop/HeaderShop";
import FooterShop from "../components/Shop/FooterShop";
import { Outlet } from "react-router-dom";
import { ModelModeContext } from "../context/ModelModeContext";

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

      <ModelModeContext.Provider value={modelMode}>
        <div className="min-h-screen w-full bg-gray-100 flex flex-col">
          <Outlet />
        </div>
      </ModelModeContext.Provider>

      <div className="sticky bottom-0 z-50 w-full">
        <FooterShop />
      </div>
    </div>
  );
};

export default ShopLayout;
