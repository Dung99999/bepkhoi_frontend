import React from "react";
import CartAction from "../../components/Shop/Cart/CartAction";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartStatus: React.FC = () => {
    const navigate = useNavigate();
    const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const hasItems = cart.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-4 shadow-sm">
                <CartAction activeButton="Trạng thái" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
            >
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                    {!hasItems ? (
                        <>
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-6"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </motion.div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Tất cả đơn đã được chuyển tới lễ tân.
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Cảm ơn bạn đã đặt hàng. Nhân viên sẽ xác nhận đơn hàng của bạn sớm nhất.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-6"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 text-yellow-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </motion.div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Bạn vẫn còn sản phẩm chưa xác nhận
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Vui lòng quay lại giỏ hàng để xác nhận đơn hàng của bạn.
                                </p>
                            </div>
                        </>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/shop/menu")}
                        className={`w-full py-3 px-4 rounded-lg font-medium ${hasItems ? "bg-green-500 hover:bg-green-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}`}
                    >
                        {hasItems ? "Tiếp tục mua hàng" : "Quay lại menu"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default CartStatus;