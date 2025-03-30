import React, { useState } from "react";

const CartAction: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("Thông tin đơn hàng");
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng</h1>
            <div className="flex space-x-6 text-gray-600 font-medium border-b pb-2">
                <button
                    className={`text-sm ${activeButton === "Thông tin đơn hàng" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"
                        }`}
                    onClick={() => setActiveButton("Thông tin đơn hàng")}
                >
                    Thông tin đơn hàng
                </button>

                <button
                    className={`text-sm ${activeButton === "Trạng thái" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"
                        }`}
                    onClick={() => setActiveButton("Trạng thái")}
                >
                    Trạng thái
                </button>

                <button
                    className={`text-sm ${activeButton === "+ Thêm món" ? "font-semibold border-b-2 border-black pb-2" : "hover:text-black"
                        }`}
                    onClick={() => setActiveButton("+ Thêm món")}
                >
                    + Thêm món
                </button>
            </div>
        </div>
    );
};

export default CartAction;
