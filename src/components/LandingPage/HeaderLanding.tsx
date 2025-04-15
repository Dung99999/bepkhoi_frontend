import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  PhoneOutlined,
  GlobalOutlined,
  MessageOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png";

const navItems = [
  { label: "Trang chủ", path: "/" },
  {
    label: "Về chúng tôi",
    path: "/about-us",
  },
  {
    label: "Liên hệ",
    path: "/contact",
  },
];

const HeaderLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md font-sans">
      <div className="flex justify-between items-center px-[8.33vw] py-[2vw] md:py-[1vw] mt-[-0.5vw] mb-[-0.5vw]">
        <div className="flex items-center space-x-[1vw]">
          <img
            src={logoBepKhoi}
            alt="Logo Bếp Khói"
            className="w-[12vw] h-[12vw] md:w-[5vw] md:h-[5vw] object-contain items-center"
          />
          <div className="flex flex-col">
            <div className="text-[4vw] md:text-[1.5vw] font-semibold text-gray-800">
              Nhà hàng Bếp Khói
            </div>
            <div className="hidden md:block text-[1vw] italic font-medium text-gray-400">
              Nâng niu văn hóa ẩm thực Việt
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-[1.5vw] text-gray-600 text-[1vw]">
          <button className="hover:text-yellow-500 transition flex items-center gap-[0.5vw]">
            <MessageOutlined />
            <span>Hỗ trợ</span>
          </button>
          <button className="hover:text-yellow-500 transition flex items-center gap-[0.5vw]">
            <GlobalOutlined />
            <span>Tiếng Việt (VN)</span>
          </button>
          <div className="flex items-center gap-[0.5vw]">
            <PhoneOutlined />
            <span className="font-medium text-yellow-500">0975307087</span>
          </div>
          <button
            className="hover:text-yellow-500 transition text-[1.2vw]"
            title="Đăng nhập vào trang quản lý"
          >
            <a href="/login"><UserOutlined /></a>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[6vw] text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuOutlined />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#FFEBCD] px-[8.33vw] py-[2vw]">
          <nav className="flex flex-col space-y-[2vw]">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-[4vw] py-[2vw] rounded-lg font-medium transition-all duration-200 text-[4vw] ${
                    isActive
                      ? "bg-[#FFE4B5] text-black"
                      : "hover:bg-[#FFE4B5] hover:text-black"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <div className="hidden md:flex justify-between items-center px-[8.33vw] h-[3vw] bg-[#FFEBCD] border-t">
        <nav className="flex space-x-[1vw]">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `px-[1vw] py-[0.5vw] rounded-lg font-medium transition-all duration-200 text-[1vw] ${
                  isActive
                    ? "bg-[#FFE4B5] text-black"
                    : "hover:bg-[#FFE4B5] hover:text-black"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default HeaderLanding;
