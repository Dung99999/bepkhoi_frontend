import React, { useState } from "react";
import MenuList from "../../components/Manage/Customer/MenuList";
import MenuSidebar from "../../components/Manage/Customer/MenuSidebar";
import { Button, message } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import AddMenuModal from "../../components/Manage/Menu/AddMenuModal";
import './MenuPage.css'; 

const CustomerManagePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleExportExcel = async () => {
    try {
        const response = await fetch("https://localhost:7257/api/Customer/export", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Customers.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Tải xuống thất bại", response.statusText);
        }
    } catch (error) {
        console.error("Lỗi khi tải file Excel", error);
    }
};

  
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Khách hàng</h1>
            <div className="flex gap-2">
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={handleExportExcel}>
                  <FileExcelOutlined className="icon-of-menu-list-button"/>Xuất Excel
                </Button>
              </div>
            </div>
          </div>
          <MenuList search={search}/>
        </main>
      </div>
      {isAddModalOpen && <AddMenuModal visible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};

export default CustomerManagePage;