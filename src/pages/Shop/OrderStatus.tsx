import React, { useEffect, useState } from "react";
import CartAction from "../../components/Shop/Cart/CartAction";
import { useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import axios from "axios";
import useSignalR from "../../CustomHook/useSignalR";
interface OrderDetail {
    orderDetailId: number;
    orderId: number;
    status: boolean;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    productNote: string;
}

const OrderStatus: React.FC = () => {
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<number>(() => {
        return parseInt(sessionStorage.getItem('selectedOrderId') || '0', 10);
    });
    const navigate = useNavigate();
    useSignalR(
        {
          eventName: "OrderUpdate",
          groupName: "order",
          callback: (updatedOrderId: number) => {
            if (updatedOrderId === selectedOrder) {
                fetchOrderDetails();
            }
          },
        },
        [selectedOrder]
      );
      const fetchOrderDetails = async () => {
        try {
            const orderId = sessionStorage.getItem('selectedOrderId');
            if (!orderId) {
                navigate('/shop/menu');
                return;
            }
            setSelectedOrder(parseInt(orderId, 10));
            const response = await axios.get(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/get-order-details-by-order-id`,
                {
                  params: { orderId }
                }
              );
            
            setOrderDetails(response.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrderDetails();
    }, [navigate]);

    const completedOrders = orderDetails.filter(item => item.status);
    const pendingOrders = orderDetails.filter(item => !item.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <CartAction activeButton="Trạng thái" />
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 bg-white p-4 border-r border-gray-200">
                        <div className="sticky top-16 bg-white z-10 pb-2">
                            <h2 className="text-lg font-bold text-red-500 mb-3 flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                Chưa xác nhận
                            </h2>
                            <div className="h-px bg-gray-200 w-full mb-3"></div>
                        </div>
                        
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map(item => (
                                <div key={item.orderDetailId} className="mb-4 p-3 bg-red-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm font-semibold text-gray-700 mr-2">
                                                    {item.price.toLocaleString()}đ
                                                </span>
                                                <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-300">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            {item.productNote && (
                                                <p className="text-xs text-gray-600 mt-1 italic">
                                                    <span className="font-medium">Ghi chú:</span> {item.productNote}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                <p>Không có món nào chờ xác nhận</p>
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/2 bg-white p-4">
                        <div className="sticky top-16 bg-white z-10 pb-2">
                            <h2 className="text-lg font-bold text-green-500 mb-3 flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                Đã xác nhận
                            </h2>
                            <div className="h-px bg-gray-200 w-full mb-3"></div>
                        </div>
                        
                        {completedOrders.length > 0 ? (
                            completedOrders.map(item => (
                                <div key={item.orderDetailId} className="mb-4 p-3 bg-green-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <div className="flex items-center mt-1">
                                                <span className="text-sm font-semibold text-gray-700 mr-2">
                                                    {item.price.toLocaleString()}đ
                                                </span>
                                                <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-300">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                            {item.productNote && (
                                                <p className="text-xs text-gray-600 mt-1 italic">
                                                    <span className="font-medium">Ghi chú:</span> {item.productNote}
                                                </p>
                                            )}
                                        </div>
                                        <Tag color="green" className="ml-2">
                                            Đã xác nhận
                                        </Tag>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                <p>Chưa có món nào được xác nhận</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;