import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface Props {
  selectedShipper: number | null;
  setSelectedShipper: (shipperId: number | null) => void;
  isReloadAfterAssignShipper: boolean;
  setIsReloadAfterAssignShipper: (isReload: boolean) => void;
  selectedOrderForAssign: number | null;
}

const ITEMS_PER_PAGE = 8;

interface Shipper {
  shipperId: number;
  shipperName: string;
  phone: string;
  email: string;
  isActive: boolean;
  // Add other relevant shipper properties here
}

interface IsActiveOption {
  label: string;
  value: boolean | null;
}

// Sample static shipper data
const sampleShippers: Shipper[] = [
  {
    shipperId: 1,
    shipperName: "Nguyen Van A",
    phone: "0901234567",
    email: "a@example.com",
    isActive: true,
  },
  {
    shipperId: 2,
    shipperName: "Tran Thi B",
    phone: "0911223344",
    email: "b@example.com",
    isActive: true,
  },
  {
    shipperId: 3,
    shipperName: "Le Duc C",
    phone: "0922334455",
    email: "c@example.com",
    isActive: false,
  },
  {
    shipperId: 4,
    shipperName: "Pham Ngoc D",
    phone: "0933445566",
    email: "d@example.com",
    isActive: true,
  },
  {
    shipperId: 5,
    shipperName: "Hoang Hai E",
    phone: "0944556677",
    email: "e@example.com",
    isActive: false,
  },
  {
    shipperId: 6,
    shipperName: "Vu Minh F",
    phone: "0955667788",
    email: "f@example.com",
    isActive: true,
  },
  {
    shipperId: 7,
    shipperName: "Do Thuy G",
    phone: "0966778899",
    email: "g@example.com",
    isActive: true,
  },
  {
    shipperId: 8,
    shipperName: "Bui Xuan H",
    phone: "0977889900",
    email: "h@example.com",
    isActive: false,
  },
  {
    shipperId: 9,
    shipperName: "Ly Thanh I",
    phone: "0988990011",
    email: "i@example.com",
    isActive: true,
  },
  {
    shipperId: 10,
    shipperName: "Dinh Van K",
    phone: "0999001122",
    email: "k@example.com",
    isActive: true,
  },
  {
    shipperId: 11,
    shipperName: "Mai Anh L",
    phone: "0801122334",
    email: "l@example.com",
    isActive: false,
  },
  {
    shipperId: 12,
    shipperName: "Cao Thi M",
    phone: "0812233445",
    email: "m@example.com",
    isActive: true,
  },
];

const POSShipperList: React.FC<Props> = ({
  selectedShipper,
  setSelectedShipper,
  isReloadAfterAssignShipper,
  setIsReloadAfterAssignShipper,
  selectedOrderForAssign,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shippers, setShippers] = useState<Shipper[]>(sampleShippers);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = shippers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [choosedIsActive, setChoosedIsActive] = useState<boolean | null>(null);
  const [filteredShippers, setFilteredShippers] =
    useState<Shipper[]>(sampleShippers);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const isActiveFilterList: IsActiveOption[] = [
    { label: "Tất cả", value: null },
    { label: "Đang hoạt động", value: true },
    { label: "Ngừng hoạt động", value: false },
  ];

  useEffect(() => {
    if (choosedIsActive === null) {
      setFilteredShippers(sampleShippers);
    } else {
      const filtered = sampleShippers.filter(
        (shipper) => shipper.isActive === choosedIsActive
      );
      setFilteredShippers(filtered);
    }
    setCurrentPage(1); // Reset page when filter changes
  }, [choosedIsActive]);

  useEffect(() => {
    setShippers(filteredShippers);
  }, [filteredShippers]);

  const handleSelectItem = (item: Shipper) => {
    setSelectedShipper(item.shipperId);
    console.log("Selected Shipper:", item);
    if (selectedOrderForAssign != null) {
      console.log(
        `Simulating assigning shipper ${item.shipperId} to order ${selectedOrderForAssign}`
      );
      setIsReloadAfterAssignShipper(true);
      // In a real scenario, you would call an API here
      // await fetchAssignShipperToOrder(selectedOrderForAssign, item.shipperId);
      setTimeout(() => {
        setIsReloadAfterAssignShipper(false);
      }, 500); // Simulate API call time
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-4">
        <Radio.Group
          options={isActiveFilterList}
          defaultValue={choosedIsActive}
          onChange={(e) => {
            setChoosedIsActive(e.target.value);
          }}
        />
      </div>
      {/* Shipper List */}
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 grid-rows-2 overflow-y-auto">
        {currentItems.map((item) => (
          <div
            key={item.shipperId}
            className={`rounded-lg overflow-hidden pt-1 flex flex-col w-full h-[11vw] items-center transition-colors duration-200 shadow-md
              ${(() => {
                if (item.shipperId === selectedShipper) {
                  return "bg-blue-300"; // If the shipper is selected
                } else if (item.shipperId === hoveredId) {
                  return "bg-[#FAEDD7]"; // If the shipper is hovered
                } else {
                  return "bg-[#fffbf5]"; // Default background color
                }
              })()}
            `}
            onMouseEnter={() => setHoveredId(item.shipperId)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelectItem(item)}
          >
            {/* You can customize how the shipper information is displayed */}
            <div className="relative flex flex-col items-center w-full gap-1">
              <div className="absolute justify-center rounded-lg p-2 flex flex-col items-center">
                <div className="w-[5vw] rounded-full bg-gray-300 flex items-center justify-center h-[5vw]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M9.75 21.75l-3 1.5-3-1.5m9.75-3l3 1.5 3-1.5M6.75 7.5l3-1.5 3 1.5m3-1.5l-3 1.5-3-1.5"
                    />
                  </svg>
                </div>
                <div className="absolute w-[90%] text-[0.9vw] text-center translate-y-[6vw] bg-white text-black font-semibold z-10 rounded-lg p-1">
                  {item.shipperName}
                </div>
              </div>
            </div>

            {/* Shipper Name */}
            <div className="relative translate-y-[7.5vw] text-[0.8vw] flex justify-center overflow-hidden text-center text-black font-semibold w-[80%] h-[3vw] whitespace-nowrap">
              <div className="absolute w-[90%] flex justify-center">
                {/* You can display other relevant info here */}
                {item.phone}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-end gap-2 flex-shrink-0 bg-white sticky bottom-0 shadow-md">
        <LeftOutlined
          className={`cursor-pointer ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} / {Math.ceil(shippers.length / ITEMS_PER_PAGE)}
        </span>
        <RightOutlined
          className={`cursor-pointer ${
            startIndex + ITEMS_PER_PAGE >= shippers.length
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={() =>
            startIndex + ITEMS_PER_PAGE < shippers.length &&
            setCurrentPage(currentPage + 1)
          }
        />
      </div>
    </div>
  );
};

export default POSShipperList;
