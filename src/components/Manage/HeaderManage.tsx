import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Modal } from "antd";
import {
  EditOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png";
import UserUpdateModal from "./UserUpdateModal";

const navItems = [
  { label: "Tổng quan", path: "/manage/dashboard" },
  {
    label: "Hàng hóa",
    submenu: [
      { label: "Danh mục", path: "/manage/menu" },
      { label: "Thiết lập giá", path: "/manage/settingPrice" },
    ],
  },
  {
    label: "Phòng/Bàn",
    path: "/manage/rooms",
    submenu: [
      { label: "Bàn", path: "/manage/rooms" },
      { label: "Phòng", path: "/manage/roomArea" },
    ],
  },
  {
    label: "Quản lý hóa đơn",
    submenu: [
      { label: "Hóa đơn", path: "/manage/invoice" },
      { label: "Phiếu đặt hàng", path: "/manage/order" },
    ],
  },
  {
    label: "Đối tác",
    submenu: [
      { label: "Khách hàng", path: "/manage/customer" },
      { label: "Nhân viên quầy", path: "/manage/cashier" },
      { label: "Nhân viên giao hàng", path: "/manage/shipper" },
    ],
  },
];

const HeaderManage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleReloadUser = () => {
    console.log("Tải lại thông tin sau khi cập nhật...");
  };

  return (
    <header className="bg-white shadow-md font-sans">
      <div className="flex justify-between items-center px-[8.33%] py-4 mt-[-5px] mb-[-5px]">
        <div className="flex items-center space-x-3">
          <img
            src={logoBepKhoi}
            alt="Logo Bếp Khói"
            className="w-20 h-20 object-contain items-center gap-x-4"
          />
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-gray-800">
              Nhà hàng Bếp Khói
            </div>
            <div className="text-[15px] italic font-medium text-gray-400">
              Nâng niu văn hóa ẩm thực Việt
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-gray-600 text-sm">
          <button className="hover:text-yellow-500 transition flex items-center gap-[5px]">
            <MessageOutlined />
            <span>Hỗ trợ</span>
          </button>
          <button className="hover:text-yellow-500 transition flex items-center gap-[5px]">
            <GlobalOutlined />
            <span>Tiếng Việt (VN)</span>
          </button>
          <div className="flex items-center gap-[5px]">
            <PhoneOutlined />
            <span className="font-medium text-yellow-500">0975307087</span>
          </div>
          <button
            onClick={handleOpenModal}
            className="hover:text-yellow-500 transition text-[18px]"
            title="Thông tin cá nhân"
          >
            <UserOutlined />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-[8.33%] h-[50px] bg-[#FFEBCD] border-t">
        <nav className="flex space-x-4">
          {navItems.map((item, index) =>
            item.submenu ? (
              <Dropdown
                key={index}
                menu={{
                  items: item.submenu.map((subItem, subIndex) => ({
                    key: subIndex,
                    label: <NavLink to={subItem.path}>{subItem.label}</NavLink>,
                  })),
                }}
                trigger={["hover"]}
              >
                <div className="px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-[#FFE4B5] hover:text-black transition-all">
                  {item.label}
                </div>
              </Dropdown>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFE4B5] text-black"
                      : "hover:bg-[#FFE4B5] hover:text-black"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <button
          className="bg-white p-2 rounded-md hover:bg-gray-100 transition"
          title="Chỉnh sửa"
          onClick={() => navigate("/pos/cashier")}
        >
          <EditOutlined />
        </button>
      </div>

      <UserUpdateModal
        open={isModalVisible}
        onClose={handleCloseModal}
        onReload={handleReloadUser}
      />
    </header>
  );
};

export default HeaderManage;
