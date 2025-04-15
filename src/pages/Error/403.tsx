import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons"; // Import icon từ Ant Design

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Điều hướng về trang trước đó
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="flex flex-row items-center justify-center mb-4">
          <h1 className="text-6xl font-extrabold text-red-500 mb-4">403</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Truy cập bị từ chối
        </h2>
        <p className="text-gray-600">
          Xin lỗi, tài khoản của bạn không có quyền truy cập vào trang này.
        </p>
      </div>
      <button
        onClick={handleGoBack}
        className="flex items-center font-semibold gap-2 px-6 py-3 bg-yellow-200 text-black rounded-lg shadow-md hover:bg-[#FFE4B5] hover:text-black transition duration-300"
      >
        <ArrowLeftOutlined />
        Quay lại
      </button>
    </div>
  );
};

export default ForbiddenPage;
