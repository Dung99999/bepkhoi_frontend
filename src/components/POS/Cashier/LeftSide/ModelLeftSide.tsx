import React, { useEffect, useState } from "react";
import POSRoomTableList from "./POSRoomTableList";
import POSMenuList from "./POSMenuList";
import POSSearchBarLeftSide from "./POSSearchBarLeftSide";
import { PlusSquareOutlined } from "@ant-design/icons";

interface ModelLeftSideProps {
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
  selectedOrder: number | null;
  setSelectedOrder: (orderId: number | null) => void;
  isReloadAfterAddProduct: boolean;
  setIsReloadAfterAddProduct: (isReload: boolean) => void;  
}

const ModelLeftSide: React.FC<ModelLeftSideProps> = ({
  selectedTable,
  setSelectedTable,
  selectedOrder,
  setSelectedOrder,
  isReloadAfterAddProduct,
  setIsReloadAfterAddProduct
}) => {
  const [activeTab, setActiveTab] = useState<"room" | "menu">("room");

  // When loading page
  useEffect(() => {
    setSelectedTable(1);
  }, []);

  return (
    <div className="p-3 bg-[#FFFFFF] rounded-lg h-[calc(100vh-2rem)] flex flex-col">
      {/* Tabs & Search */}
      <div className="flex items-center border-b border-gray-300 pb-2">
        <div className="flex">
          <button
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "room"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("room")}
          >
            <PlusSquareOutlined /> Phòng bàn
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold transition ${
              activeTab === "menu"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            🍽️ Thực đơn
          </button>
        </div>

        <div className="ml-5 mr-5">
          <POSSearchBarLeftSide />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
        {activeTab === "room" ? (
          <POSRoomTableList
            selectedTable={selectedTable}
            setSelectedTable={(tableId) => {
              setSelectedTable(tableId);
            }}
            setActiveTab={setActiveTab}
          />
        ) : (
          <POSMenuList 
          selectedTable={selectedTable} 
          selectedOrder={selectedOrder}
          isReloadAfterAddProduct={isReloadAfterAddProduct}
          setIsReloadAfterAddProduct={setIsReloadAfterAddProduct}
          />
        )}
      </div>
    </div>
  );
};

export default ModelLeftSide;
