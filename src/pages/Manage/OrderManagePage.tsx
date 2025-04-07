import React, { useState, useEffect } from "react";
import OrderList from "../../components/Manage/Order/OrderList";
import OrderDetail from "../../components/Manage/Order/OrderDetail";

interface Customer {
    customerId: number;
    customerName: string;
}

interface Order {
    orderId: number;
    customerId: number;
    createdTime: string;
    totalQuantity: number;
    amountDue: number;
    orderNote: string;
    customerName?: string;
}

interface OrderDetailItem {
    orderDetailId: number;
    productName: string;
    quantity: number;
    price: number;
    productNote: string;
}

const OrderManagePage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/get-all-orders`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const ordersData = data.data || [];

            const ordersWithCustomerNames = ordersData.map((order: Order) => ({
                ...order,
                customerName: customers.find(c => c.customerId === order.customerId)?.customerName || 'Khách vãng lai'
            }));

            setOrders(ordersWithCustomerNames);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer`);
            if (!response.ok) throw new Error('Failed to fetch customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchOrderDetails = async (orderId: number) => {
        setDetailLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/order-detail/get-by-order-id/${orderId}`
            );
            if (!response.ok) throw new Error("Failed to fetch order details");

            const data = await response.json();
            setOrderDetails(data.data || []);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setOrderDetails([]);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleRowClick = async (record: Order) => {
        setSelectedOrder(record);
        setIsDetailModalOpen(true);
        await fetchOrderDetails(record.orderId);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (customers.length > 0) {
            fetchOrders();
        }
    }, [customers]);

    return (
        <div className="flex w-full h-full px-[8.33%] font-sans">
            <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
                </div>

                <OrderList
                    data={orders}
                    loading={loading}
                    onRowClick={handleRowClick}
                />

                <OrderDetail
                    visible={isDetailModalOpen}
                    orderId={selectedOrder?.orderId}
                    customerName={selectedOrder?.customerName}
                    createdTime={selectedOrder?.createdTime}
                    amountDue={selectedOrder?.amountDue}
                    orderNote={selectedOrder?.orderNote}
                    items={orderDetails}
                    loading={detailLoading}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default OrderManagePage;