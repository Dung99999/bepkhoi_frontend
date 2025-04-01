import React, { useState } from "react";
import { Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface Props {
  selectedTable: number | null;
}

const categories = [
  { label: "Tất cả", value: "all" },
  { label: "Cơm", value: "com" },
  { label: "Phở", value: "pho" },
  { label: "Bánh mì", value: "banhmi" },
];

const menuItems = Array.from({ length: 48 }, (_, i) => {
  const sellPrice = Math.floor(Math.random() * (100000 - 50000) + 50000);
  const salePrice = Math.random() > 0.5 ? sellPrice - 5000 : sellPrice; // Có thể có giá KM
  return {
    id: i + 1,
    name: `Món ${i + 1}`,
    category: categories[(i % categories.length)].value,
    sellPrice,
    salePrice,
    image: "https://media.vietnamplus.vn/images/4359a3df9b251435296fbde0195654ba1403885bd60a0cb0eb9a5c0cbccf6559c7927feda324b59c53ede6e0ea57d4aa/2707pho.jpg", // Link ảnh mẫu
  };
});



const ITEMS_PER_PAGE = 12;

const POSMenuList: React.FC<Props> = ({ selectedTable }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [selectedOrders, setSelectedOrders] = useState<{ id: number; name: string; quantity: number; price: number }[]>([]);

  const handleSelectItem = (item: { id: number; name: string; salePrice: number}) => {
    setSelectedOrders((prevOrders) => {
      const existingOrder = prevOrders.find(order => order.id === item.id);
      if (existingOrder) {
        return prevOrders.map(order =>
          order.id === item.id ? { ...order, quantity: order.quantity + 1 } : order
        );
      } else {
        return [...prevOrders, { id: item.id, name: item.name, quantity: 1, price: item.salePrice }];
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Thanh lọc category */}
      <div className="p-4 flex gap-4">
        <Radio.Group
          options={categories}
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="flex-1 p-4 grid grid-cols-4 gap-4 grid-rows-3">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#fffbf5] rounded-lg  overflow-hidden p-4 flex flex-col items-center transition-colors duration-200 hover:bg-[#FAEDD7] shadow-md"
            onClick={() => handleSelectItem(item)}
          >
            {/* Ảnh + Giá */}
            <div className="flex items-center w-full gap-4">
              <img src={item.image} alt={item.name} className="w-[45%] h-[100%] object-cover rounded-md" />
              <div className="flex flex-col w-[55%] items-start">
                <span className="text-black font-bold">{item.salePrice}đ</span>
                {item.sellPrice !== item.salePrice && (
                  <span className="text-red-500 line-through">{item.sellPrice}đ</span>
                )}
              </div>
            </div>

            {/* Tên sản phẩm */}
            <div className="mt-2 text-center text-black font-semibold w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-end gap-2 flex-shrink-0 bg-white sticky bottom-0 shadow-md">
        <LeftOutlined
          className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} / {Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
        </span>
        <RightOutlined
          className={`cursor-pointer ${startIndex + ITEMS_PER_PAGE >= filteredItems.length ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => startIndex + ITEMS_PER_PAGE < filteredItems.length && setCurrentPage(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export default POSMenuList;