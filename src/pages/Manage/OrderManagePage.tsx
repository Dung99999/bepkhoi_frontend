import React, { useState, useEffect } from "react";
import OrderList from "../../components/Manage/Order/OrderList";
import OrderDetail from "../../components/Manage/Order/OrderDetail";
import Sidebar from "../../components/Manage/Order/SideBar";

const token = localStorage.getItem("Token");

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
  deliveryInformationId: number | null;
}

interface OrderDetailItem {
  orderDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string;
}

interface DeliveryInformation {
  deliveryInformationId: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  deliveryNote: string;
}

interface CancellationHistoryItem {
  orderCancellationHistoryId: number;
  orderId: number;
  cashierId: number;
  cashierName: string;
  productId: number;
  productName: string;
  quantity: number;
  reason: string;
}

const OrderManagePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInformation | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [cancellationHistory, setCancellationHistory] = useState<CancellationHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchDeliveryInfo = async (deliveryInfoId: number) => {
    setDeliveryLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/DeliveryInformation/${deliveryInfoId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch delivery information");

      const data = await response.json();
      setDeliveryInfo(data.data);
    } catch (error) {
      console.error("Error fetching delivery information:", error);
      setDeliveryInfo(null);
    } finally {
      setDeliveryLoading(false);
    }
  };

  const fetchCancellationHistory = async (orderId: number) => {
    setHistoryLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/cancellation-history/${orderId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch cancellation history");
      const data = await response.json();
      setCancellationHistory(data.data || []);
    } catch (error) {
      console.error("Error fetching cancellation history:", error);
      setCancellationHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchOrders = async (fromDate?: string, toDate?: string) => {
    setLoading(true);
    try {
      const baseUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/orders`;
      const url =
        fromDate && toDate
          ? `${baseUrl}/filter-by-date?fromDate=${fromDate}&toDate=${toDate}`
          : `${baseUrl}/get-all-orders`;

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const ordersData = data.data || [];

      const ordersWithCustomerNames = ordersData.map((order: Order) => ({
        ...order,
        customerName:
          customers.find((c) => c.customerId === order.customerId)
            ?.customerName || "Khách vãng lai",
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
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    setDetailLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/order-detail/get-by-order-id/${orderId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
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
    if (record.deliveryInformationId) {
      await fetchDeliveryInfo(record.deliveryInformationId);
    } else {
      setDeliveryInfo(null);
    }
    await fetchCancellationHistory(record.orderId);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      if (dateFrom && dateTo) {
        fetchOrders(dateFrom, dateTo);
      } else {
        fetchOrders();
      }
    }
  }, [customers, dateFrom, dateTo]);

  return (
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-[7px]">
        <Sidebar
          dateFrom={dateFrom}
          dateTo={dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          search={search}
          setSearch={setSearch}
        />
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          </div>
          <OrderList
            data={orders}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </main>
      </div>
      <OrderDetail
        visible={isDetailModalOpen}
        orderId={selectedOrder?.orderId}
        customerName={selectedOrder?.customerName}
        createdTime={selectedOrder?.createdTime}
        amountDue={selectedOrder?.amountDue}
        orderNote={selectedOrder?.orderNote}
        items={orderDetails}
        loading={detailLoading}
        deliveryInfo={deliveryInfo}
        deliveryLoading={deliveryLoading}
        cancellationHistory={cancellationHistory}
        historyLoading={historyLoading}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default OrderManagePage;