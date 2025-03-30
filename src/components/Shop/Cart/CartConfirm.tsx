import React from "react";
import { Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";

interface CartConfirmProps {
  total: number;
  discount: number;
  calculateTotal: () => number;
}

const CartConfirm: React.FC<CartConfirmProps> = ({ total, discount, calculateTotal }) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate("/shop/payment", { state: { totalAmount: total } });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-4">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Tạm tính:</span>
        <span className="font-medium">{calculateTotal().toLocaleString()}đ</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Giảm giá:</span>
        <span className="text-red-500">-{discount.toLocaleString()}đ</span>
      </div>
      <Divider className="my-2" />
      <div className="flex justify-between">
        <span className="text-lg font-bold">Tổng cộng:</span>
        <span className="text-lg font-bold">{total.toLocaleString()}đ</span>
      </div>

      <div className="flex space-x-4 mt-6">
        <Button className="flex-1 bg-gray-200 text-black rounded-md py-2">✔ Xác nhận</Button>
        <Button
          className="flex-1 bg-yellow-500 text-black rounded-md py-2"
          onClick={handlePayment}
        >
          💳 Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default CartConfirm;
