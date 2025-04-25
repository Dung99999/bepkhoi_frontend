import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
    label: "Quản lý phòng",
    path: "/manage/rooms",
    submenu: [
      { label: "Phòng", path: "/manage/rooms" },
      { label: "Khu vực phòng", path: "/manage/roomArea" },
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
      <div className="flex justify-between items-center px-[8vw] py-[2vw] mt-[-0.5vw] mb-[-0.5vw]">
        <div className="flex items-center space-x-[1vw]">
          <img
            src={logoBepKhoi}
            alt="Logo Bếp Khói"
            className="w-[5vw] h-[5vw] min-w-[4vw] min-h-[4vw] max-w-[8vw] max-h-[8vw] object-contain items-center gap-x-[1vw]"
          />
          <div className="flex flex-col">
            <div className="text-[1.5vw] font-semibold text-gray-800">
              Nhà hàng Bếp Khói
            </div>
            <div className="text-[1vw] italic font-medium text-gray-400">
              Nâng niu văn hóa ẩm thực Việt
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-[2vw] text-gray-600 text-[0.9vw]">
          <button className="hover:text-yellow-500 transition flex items-center gap-[0.3vw]">
            <MessageOutlined />
            <span>Hỗ trợ</span>
          </button>
          <button className="hover:text-yellow-500 transition flex items-center gap-[0.3vw]">
            <GlobalOutlined />
            <span>Tiếng Việt (VN)</span>
          </button>
          <div className="flex items-center gap-[0.3vw]">
            <span className="font-bold text-yellow-500">{localStorage.getItem("UserName")}</span>
          </div>
          <button
            onClick={handleOpenModal}
            className="hover:text-yellow-500 transition text-[1.2vw]"
            title="Thông tin cá nhân"
          >
            <UserOutlined />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-[8vw] h-[3vw] bg-[#FFEBCD] border-t">
        <nav className="flex space-x-[1vw] text-[1vw]">
          {navItems.map((item, index) =>
            item.submenu ? (
              <Dropdown
                key={index}
                menu={{
                  items: item.submenu.map((subItem, subIndex) => ({
                    key: subIndex,
                    label: <NavLink to={subItem.path}>{subItem.label}</NavLink>,
                    style: {
                      fontSize: "1vw",
                    },
                  })),
                }}
                trigger={["hover"]}
              >
                <div className="px-[1vw] py-[0.5vw] rounded-lg font-medium cursor-pointer hover:bg-[#FFE4B5] hover:text-black transition-all">
                  {item.label}
                </div>
              </Dropdown>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-[1vw] py-[0.5vw] rounded-[1vw] font-medium transition-all duration-200 ${
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
          className="bg-white p-[0.5vw] w-[2vw] h-[2vw] rounded-[0.6vw] hover:bg-gray-100 transition flex items-center justify-center"
          title="Chỉnh sửa"
        >
          <a
            href="/pos/cashier"
            className="w-[1.8vw] h-[1.8vw] flex items-center justify-center"
          >
            <EditOutlined className="text-[1vw]" />
          </a>
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
