import React, { useEffect, useState } from "react";
import POSRoomTableList from "./POSRoomTableList";
import POSMenuList from "./POSMenuList";
import POSSearchBarLeftSide from "./POSSearchBarLeftSide";

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
  setIsReloadAfterAddProduct,
}) => {
  const [activeTab, setActiveTab] = useState<"room" | "menu" | "shiper">(
    "room"
  );

  const fakeShippingData = [
    {
      orderId: 1,
      customerName: "Nguyễn Văn A",
      address: "123 Đường ABC",
      status: "Đang giao",
    },
    {
      orderId: 2,
      customerName: "Trần Thị B",
      address: "456 Đường XYZ",
      status: "Đã giao",
    },
    {
      orderId: 3,
      customerName: "Lê Minh C",
      address: "789 Đường MNO",
      status: "Đang giao",
    },
  ];

  // When loading page
  // useEffect(() => {
  //   setSelectedTable(1);
  // }, []);

  return (
    <div className="p-3 bg-[#FFFFFF] rounded-lg h-[calc(100vh-2rem)] flex flex-col">
      {/* Tabs & Search */}
      <div className="flex items-center border-b border-gray-300 pb-2">
        <div className="flex space-x-[1vw]">
          <button
            className={` font-semibold transition ${
              activeTab === "room"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("room")}
          >
            Phòng bàn
          </button>
          <button
            className={` py-[1vw] font-semibold transition ${
              activeTab === "menu"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            Thực đơn
          </button>
          <button
            className={` py-[1vw] font-semibold transition ${
              activeTab === "shiper"
                ? "bg-[#FFFFFF] text-[#ffbe4f] border-b-2 border-[#ffbe4f]"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("shiper")}
          >
            Giao đi
          </button>
        </div>

        <div className="ml-[3vw] mr-[3vw]">
          <POSSearchBarLeftSide />
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
        {activeTab === "room" && (
          <POSRoomTableList
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "menu" && (
          <POSMenuList
            selectedTable={selectedTable}
            selectedOrder={selectedOrder}
            isReloadAfterAddProduct={isReloadAfterAddProduct}
            setIsReloadAfterAddProduct={setIsReloadAfterAddProduct}
          />
        )}

        {activeTab === "shiper" && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Danh sách giao đi</h3>
            {fakeShippingData.map((order) => (
              <div
                key={order.orderId}
                className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{`Đơn hàng #${order.orderId}`}</span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "Đang giao"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p>{`Khách hàng: ${order.customerName}`}</p>
                  <p>{`Địa chỉ: ${order.address}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelLeftSide;
