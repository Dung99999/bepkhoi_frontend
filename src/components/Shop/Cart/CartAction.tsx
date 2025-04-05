import React from "react";
import { useNavigate } from "react-router-dom";

interface CartActionProps {
    activeButton?: "Thông tin đơn hàng" | "Trạng thái" | "+ Thêm món";
}

const CartAction: React.FC<CartActionProps> = ({ activeButton = "Thông tin đơn hàng" }) => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng</h1>
            <div className="flex space-x-6 text-gray-600 font-medium border-b pb-2">
                <button
                    className={`text-sm ${activeButton === "Thông tin đơn hàng" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"}`}
                    onClick={() => {
                        navigate("/shop/cart");
                    }}
                >
                    Thông tin đơn hàng
                </button>

                <button
                    className={`text-sm ${activeButton === "Trạng thái" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"}`}
                    onClick={() => {
                        navigate("/shop/status");
                    }}
                >
                    Trạng thái
                </button>

                <button
                    className={`text-sm ${activeButton === "+ Thêm món" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"}`}
                    onClick={() => {
                        navigate("/shop/menu");
                    }}
                >
                    + Thêm món
                </button>
            </div>
        </div>
    );
};

export default CartAction;