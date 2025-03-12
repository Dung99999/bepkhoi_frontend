import React, { useState } from "react";
import MenuList from "../../components/Manage/Menu/MenuList";
import MenuSidebar from "../../components/Manage/Menu/MenuSidebar";
import { Button } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import './MenuPage.css'; 

const MenuPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]); // ✅ Mảng string
  const [status, setStatus] = useState<string[]>([]); // ✅ Mảng string

  return (
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-[7px]">
        <MenuSidebar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
        />
        <main className="flex-1 overflow-auto">
          {/* Phần tiêu đề và button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Hàng hóa</h1>
            <div className="flex gap-2">
              {/* Bọc button trong div để dễ thêm icon sau này */}
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default"><PlusOutlined className="icon-of-menu-list-button"/>Thêm mới</Button>
              </div>
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" ><FileExcelOutlined className="icon-of-menu-list-button"/>Xuất Excel</Button>
              </div>
            </div>
          </div>

          {/* Danh sách menu */}
          <MenuList search={search} category={category} status={status} />
        </main>
      </div>
    </div>
  );
};

export default MenuPage;
