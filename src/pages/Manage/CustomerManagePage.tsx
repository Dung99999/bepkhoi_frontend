import React, { useState } from "react";
import CustomerList from "../../components/Manage/Customer/CustomerList";
import CustomerSidebar from "../../components/Manage/Customer/CustomerSidebar";
import { Button, message } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import './MenuPage.css';

const CustomerManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authInfo?.token}`,
        }
      });

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) {
        message.error("Tải xuống thất bại");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Customers.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error("Lỗi khi tải file Excel");
    }
  };

  return (
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-[7px]">
        <CustomerSidebar
          search={search}
          setSearch={setSearch}
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
          <CustomerList search={search}/>
        </main>
      </div>
    </div>
  );
};

export default CustomerManagePage;