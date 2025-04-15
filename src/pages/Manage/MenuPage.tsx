import React, { useState } from "react";
import MenuList from "../../components/Manage/Menu/MenuList";
import MenuSidebar from "../../components/Manage/Menu/MenuSidebar";
import { Button, message } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import AddMenuModal from "../../components/Manage/Menu/AddMenuModal";
import './MenuPage.css'; 

const MenuPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleExportExcel = async () => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const categoryFilter = category.length > 0 ? category.join(",") : ""; 
      const statusFilter = status !== "all" ? status : "";
      const searchFilter = search.trim() !== "" ? encodeURIComponent(search) : "";
      const fileName = `ProductList_${formattedDate}_Category_${categoryFilter || "All"}_Status_${statusFilter || "All"}_Search_${searchFilter || "None"}.xlsx`;
      const queryParams = new URLSearchParams({
        sortBy: "ProductId",
        sortDirection: "asc",
      });
      if (categoryFilter) queryParams.append("categoryId", categoryFilter);
      if (statusFilter) queryParams.append("isActive", statusFilter === "1" ? "true" : "false");
      if (searchFilter) queryParams.append("search", searchFilter);
      const apiUrl = `https://localhost:7257/api/Menu/export-products-excel?${queryParams.toString()}`;
      console.log("Export URL:", apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Xuất file thất bại");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      message.success(`File "${fileName}" đã được tải xuống thành công!`);
    } catch (error) {
      message.error("Lỗi khi tải xuống file Excel");
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
            <h1 className="text-3xl font-bold">Hàng hóa</h1>
            <div className="flex gap-2">
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={() => setIsAddModalOpen(true)}>
                  <PlusOutlined className="icon-of-menu-list-button"/>Thêm mới
                </Button>
              </div>
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={handleExportExcel}>
                  <FileExcelOutlined className="icon-of-menu-list-button"/>Xuất Excel
                </Button>
              </div>
            </div>
          </div>
          <MenuList search={search} category={category} status={status} />
        </main>
      </div>
      {isAddModalOpen && <AddMenuModal visible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};

export default MenuPage;