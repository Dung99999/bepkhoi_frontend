import React, { useState } from "react";
import { Button, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import MenuSidebar from "../../components/Manage/Menu/MenuSidebar";
import PriceMenuList from "../../components/Manage/Menu/PriceMenuList";
import { useAuth } from "../../context/AuthContext";
import "./SettingPricePage.css";

const SettingPricePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [menuStatus, setMenuStatus] = useState<string>("all");

  const handleExportPriceExcel = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const categoryFilter = category.length > 0 ? category.join(",") : "All";
      const statusFilter =
        menuStatus !== "all"
          ? menuStatus === "1"
            ? "Active"
            : "Inactive"
          : "All";
      const searchFilter = search.trim() !== "" ? search : "None";
      const fileName = `ProductPriceList_${formattedDate}_Category_${categoryFilter}_Status_${statusFilter}_Search_${searchFilter}.xlsx`;

      const queryParams = new URLSearchParams({
        sortBy: "ProductId",
        sortDirection: "asc",
      });
      if (category.length > 0)
        queryParams.append("categoryId", category.join(","));
      if (menuStatus !== "all")
        queryParams.append("isActive", menuStatus === "1" ? "true" : "false");
      if (search.trim() !== "")
        queryParams.append("search", encodeURIComponent(search));

      const apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/export-product-price-excel?${queryParams.toString()}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }

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
      <div className="flex flex-1 p-[1vw] gap-[0.5vw]">
        <MenuSidebar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={menuStatus}
          setStatus={setMenuStatus}
        />
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-[1vw]">
            <h1 className="text-[2vw] font-bold">Cài đặt giá</h1>
            <Button
              type="default"
              onClick={handleExportPriceExcel}
              style={{
                backgroundColor: "#00B63E",
                color: "#FFF",
                fontWeight: 600,
                borderRadius: "0.5vw",
                fontSize: "0.9vw",
                padding: "0.5vw 1vw",
                height: "auto",
              }}
            >
              <FileExcelOutlined className="icon-of-menu-list-button text-[1vw]" />{" "}
              Xuất Excel
            </Button>
          </div>
          <PriceMenuList
            search={search}
            category={category}
            menuStatus={menuStatus}
          />
        </main>
      </div>
    </div>
  );
};

export default SettingPricePage;