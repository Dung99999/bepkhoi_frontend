import React, { useEffect, useState } from "react";
import POSRoomTableList from "./POSRoomTableList";
import POSMenuList from "./POSMenuList";
import POSSearchBarLeftSide from "./POSSearchBarLeftSide";
import POSShipperList from "./POSShipperList"

interface ModelLeftSideProps {
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
  selectedOrder: number | null;
  setSelectedOrder: (orderId: number | null) => void;
  selectedShipper: number | null;
  setSelectedShipper: (shipperId: number | null) => void;
  orderType: number | null;
  setOrderType: (shipperId: number | null) => void;
}
const ModelLeftSide: React.FC<ModelLeftSideProps> = ({
  selectedTable,
  setSelectedTable,
  selectedOrder,
  setSelectedOrder,
  selectedShipper,
  setSelectedShipper,
  orderType,
  setOrderType
}) => {
  const [activeTab, setActiveTab] = useState<"room" | "menu" | "shiper">("room");

  function handleChangeTab(tab: "room" | "menu" | "shiper") {
    setActiveTab(tab);
  }

  return (
    <div className="p-3 bg-[#FFFFFF] rounded-lg h-[calc(100vh-2rem)] flex flex-col">
      {/* Tabs & Search */}
      <div className="flex items-center border-b border-gray-300 pb-2">
        <div className="flex space-x-[1vw]">
        <button
            className={` py-[1vw] font-semibold transition ${
              activeTab === "shiper"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => {handleChangeTab("shiper")}}
          >
            Giao đi
          </button>
          <button
            className={` font-semibold transition ${
              activeTab === "room"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => {handleChangeTab("room")}}
          >
            Phòng bàn
          </button>
          <button
            className={` py-[1vw] font-semibold transition ${
              activeTab === "menu"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => {handleChangeTab("menu")}}
          >
            Thực đơn
          </button>
        </div>

        <div className="ml-[3vw] mr-[3vw]">
          <POSSearchBarLeftSide 
          selectedOrder={selectedOrder}
          />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
      {activeTab === "shiper" && (
          <POSShipperList
            selectedShipper={selectedShipper}
            setSelectedShipper={setSelectedShipper}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            orderType={orderType}
            setOrderType={setOrderType}
          />
        )}
        {activeTab === "room" && (
          <POSRoomTableList
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            setActiveTab={setActiveTab}
            selectedShipper={selectedShipper}
            setSelectedShipper={setSelectedShipper}
            orderType={orderType}
            setOrderType={setOrderType}
          />
        )}

        {activeTab === "menu" && (
          <POSMenuList
            selectedTable={selectedTable}
            selectedOrder={selectedOrder}
          />
        )}
      </div>
    </div>
  );
};

export default ModelLeftSide;
