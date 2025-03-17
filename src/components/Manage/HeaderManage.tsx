import React from "react";
import { NavLink } from "react-router-dom";
import { EditOutlined, PhoneOutlined, GlobalOutlined, MessageOutlined } from "@ant-design/icons";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png"; // ✅ Đường dẫn đúng tới logo

const navItems = [
  { label: "Tổng quan", path: "/dashboard" },
  { label: "Hàng hóa", path: "/manage/menu" },
  { label: "Điều chỉnh giá", path: "/manage/cost-fix" },
  { label: "Phòng/Bàn", path: "/rooms" },
  { label: "Đối tác", path: "/partners" },
  { label: "Khách hàng", path: "/manage/customers" },
];

const HeaderManage: React.FC = () => {
  return (
    <header className="bg-white shadow-md font-sans">
      {/* ✅ Thanh ngang đầu tiên (Logo + Thông tin liên hệ) */}
      <div className="flex justify-between items-center px-[8.33%] py-4 mt-[-5px] mb-[-5px]">
        {/* Logo + Tên */}
        <div className="flex items-center space-x-3">
          <img
            src={logoBepKhoi}
            alt="Logo Bếp Khói"
            className="w-20 h-20 object-contain items-center gap-x-4"
          />
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-gray-800">Nhà hàng Bếp Khói</div>
            <div className="text-[15px] italic font-medium text-gray-400">Nâng niu văn hóa ẩm thực Việt</div>
          </div>
        </div>

        {/* Thông tin bên phải */}
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
        </div>
      </div>

      {/* ✅ Thanh ngang thứ 2 (NavItems + Nút Edit) */}
      <div className="flex justify-between items-center px-[8.33%] h-[50px] bg-[#FFEBCD] border-t">
        {/* Nav Items */}
        <nav className="flex space-x-4">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#FFE4B5] text-black" // ✅ Active màu
                    : "hover:bg-[#FFE4B5] hover:text-black" // ✅ Hover màu
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Nút Edit bên phải */}
        <button
          className="bg-white p-2 rounded-md hover:bg-gray-100 transition"
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </button>
      </div>
    </header>
  );
};

export default HeaderManage;
