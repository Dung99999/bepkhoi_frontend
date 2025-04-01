import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalAmount = location.state?.totalAmount || 0;

  const [selectedMethod, setSelectedMethod] = useState<string>("cash");

  return (
    <div className="p-4 bg-gray-100 h-full">
      <div className="flex items-center mb-4">
        <LeftOutlined
          className="text-xl cursor-pointer mr-2"
          onClick={() => navigate("/shop/cart")}
        />
        <h1 className="text-2xl font-bold">Thanh toán</h1>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md mb-4">
        <div
          className={`flex justify-between items-center p-4 rounded-md cursor-pointer ${
            selectedMethod === "cash" ? "border-2 border-green-500" : "border"
          }`}
          onClick={() => setSelectedMethod("cash")}
        >
          <span>Tiền mặt</span>
          {selectedMethod === "cash" && <span className="text-green-500 font-semibold">✔</span>}
        </div>

        <div
          className={`flex justify-between items-center p-4 rounded-md cursor-pointer mt-2 ${
            selectedMethod === "bank" ? "border-2 border-green-500" : "border"
          }`}
          onClick={() => setSelectedMethod("bank")}
        >
          <span>Chuyển khoản ngân hàng</span>
          {selectedMethod === "bank" && <span className="text-green-500 font-semibold">✔</span>}
        </div>
      </div>

      <button className="w-full bg-yellow-500 text-black py-3 rounded-md font-bold">
        Thanh toán {totalAmount.toLocaleString()}đ
      </button>
    </div>
  );
};

export default PaymentPage;
