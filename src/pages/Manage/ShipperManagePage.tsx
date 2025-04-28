import React, { useState } from "react";
import UserList from "../../components/Manage/Shipper/UserList";
import Sidebar from "../../components/Manage/Shipper/Sidebar";
import { Button, message } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import AddUserModal from "../../components/Manage/Shipper/AddUserModal";
import { useAuth } from "../../context/AuthContext";
import './MenuPage.css';

const ShipperManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Shipper/export`, {
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
      a.download = 'Shippers.xlsx';
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
        <Sidebar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Nhân viên giao hàng</h1>
            <div className="flex gap-2">
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={() => setIsAddModalOpen(true)}>
                  <PlusOutlined className="icon-of-menu-list-button" />Thêm mới
                </Button>
              </div>
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={handleExportExcel}>
                  <FileExcelOutlined className="icon-of-menu-list-button" />Xuất Excel
                </Button>
              </div>
            </div>
          </div>
          <UserList search={search} status={status}/>
        </main>
      </div>
      {isAddModalOpen && <AddUserModal visible={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};

export default ShipperManagePage;