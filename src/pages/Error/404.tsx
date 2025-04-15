import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons"; // Import icon từ Ant Design

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Điều hướng về trang trước đó
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-6">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        {/* Nút quay lại */}
        <button
          onClick={handleGoBack}
          className="flex items-center font-semibold gap-2 px-6 py-3 bg-yellow-200 text-black rounded-lg shadow-md hover:bg-[#FFE4B5] hover:text-black transition duration-300"
        >
          <ArrowLeftOutlined /> {/* Icon mũi tên từ Ant Design */}
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
