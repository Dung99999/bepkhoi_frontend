import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Modal, message } from "antd";
import POSTableAndCustomerBar from "./POSTableAndCustomerBar";
import POSListOfOrder from "./POSListOfOrder";
import POSPayment from "./POSPayment";
import styles from "../../../../styles/POS/main.module.css";
import ModalCreateCustomer from "./ModalCreateCustomer";
import useSignalR from "../../../../CustomHook/useSignalR";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedTable: number | null;
  selectedShipper: number | null;
  orderType: number | null;
  setSelectedOrder: (orderId: number | null) => void;
  selectedOrder: number | null;
}

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface OrderModel {
  orderId: number;
  customerId: number | null;
  shipperId: number | null;
  deliveryInformationId: number | null;
  orderTypeId: number;
  roomId: number | null;
  createdTime: string;
  totalQuantity: number;
  amountDue: number;
  orderStatusId: number;
  orderNote: string | null;
}

interface CreateNewOrder {
  customerId: number | null;
  shipperId: number | null;
  deliveryInformationId: number | null;
  orderTypeId: number;
  roomId: number | null;
  orderStatusId: number;
  orderNote: string | null;
}

interface Tab {
  label: string;
  value: string;
}

const fetchOrders = async (
  roomId: number | null,
  shipperId: number | null,
  orderTypeId: number | null,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderModel[]> => {
  try {
    const query = new URLSearchParams();
    if (roomId !== null) query.append("roomId", roomId.toString());
    if (shipperId !== null) query.append("shipperId", shipperId.toString());
    if (orderTypeId !== null) query.append("orderTypeId", orderTypeId.toString());

    const response = await fetch(
      `${API_BASE_URL}api/orders/get-order-by-type-pos?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      const errorBody = await response.json();
      message.error(errorBody.message || "Không thể lấy danh sách đơn hàng.");
      return [];
    }

    const orders: OrderModel[] = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    message.error("Lỗi kết nối khi lấy danh sách đơn hàng.");
    return [];
  }
};

const fetchCreateNewOrder = async (
  data: Omit<CreateNewOrder, "orderStatusId"> & { orderStatusId?: number },
  token: string,
  clearAuthInfo: () => void
): Promise<number | null> => {
  try {
    const requestBody: CreateNewOrder = {
      customerId: data.customerId ?? null,
      shipperId: data.shipperId ?? null,
      deliveryInformationId: data.deliveryInformationId ?? null,
      orderTypeId: data.orderTypeId,
      roomId: data.roomId ?? null,
      orderStatusId: data.orderStatusId ?? 1,
      orderNote: data.orderNote ?? null,
    };

    const response = await fetch(`${API_BASE_URL}api/orders/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Không thể tạo đơn hàng.");
    }

    const orderId = json.data?.orderId;
    if (!orderId) {
      throw new Error("orderId không tìm thấy trong phản hồi.");
    }

    return orderId;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    message.error("Tạo đơn hàng thất bại.");
    return null;
  }
};

const fetchRemoveOrder = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/remove-order/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.Message || "Không thể xóa đơn hàng.");
    }

    message.success("Xóa đơn hàng thành công.");
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    message.error("Xóa đơn hàng thất bại.");
    throw error;
  }
};

const ModelRightSide: React.FC<Props> = ({
  selectedTable,
  selectedShipper,
  orderType,
  selectedOrder,
  setSelectedOrder,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [isReloadAfterPayment, setIsReloadAfterPayment] = useState<boolean>(false);
  const [previousSelectedOrderId, setPreviousSelectedOrderId] = useState<number | null>(null);

  const openCustomerModal = () => setIsCustomerModalOpen(true);
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const getOrder = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    try {
      const orders = await fetchOrders(
        selectedTable,
        selectedShipper,
        orderType,
        authInfo.token,
        clearAuthInfo
      );

      if (!orders || orders.length === 0) {
        setTabs([]);
        console.log("Không có đơn hàng nào phù hợp.");
        setSelectedOrder(null);
        setActiveKey("");
        setPreviousSelectedOrderId(null);
        return;
      }

      const generatedTabs: Tab[] = orders.map((order) => ({
        label: `Đơn ${order.orderId}`,
        value: order.orderId.toString(),
      }));
      setTabs(generatedTabs);

      const currentTab = selectedOrder
        ? generatedTabs.find((tab) => Number(tab.value) === selectedOrder)
        : null;

      if (currentTab) {
        setActiveKey(currentTab.value);
        setSelectedOrder(Number(currentTab.value));
        setPreviousSelectedOrderId(Number(currentTab.value));
      } else {
        setActiveKey(generatedTabs[0].value);
        setSelectedOrder(Number(generatedTabs[0].value));
        setPreviousSelectedOrderId(Number(generatedTabs[0].value));
      }
    } catch (error) {
      console.error("Failed to get orders:", error);
      setSelectedOrder(null);
      setActiveKey("");
      setPreviousSelectedOrderId(null);
      message.error("Không thể lấy danh sách đơn hàng.");
    }
  }, [authInfo?.token, clearAuthInfo, selectedTable, selectedShipper, orderType, selectedOrder, setSelectedOrder]);

  const addTab = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (!orderType) {
      message.warning("Vui lòng chọn loại đơn trước khi tạo đơn hàng.");
      return;
    }

    if (orderType === 2 && selectedShipper == null) {
      message.warning("Vui lòng chọn shipper cho đơn giao đi.");
      return;
    }

    if (orderType === 3 && selectedTable == null) {
      message.warning("Vui lòng chọn phòng/bàn cho đơn phòng.");
      return;
    }

    try {
      const newOrderData: Omit<CreateNewOrder, "orderStatusId"> = {
        customerId: null,
        shipperId: selectedShipper ?? null,
        deliveryInformationId: null,
        orderTypeId: orderType,
        roomId: selectedTable ?? null,
        orderNote: null,
      };

      const newOrderId = await fetchCreateNewOrder(newOrderData, authInfo.token, clearAuthInfo);

      if (newOrderId) {
        message.success("Tạo đơn hàng thành công.");
        await getOrder(); // Làm mới danh sách đơn hàng
        setActiveKey(newOrderId.toString());
        setSelectedOrder(newOrderId);
      }
    } catch (error) {
      console.error("Không thể tạo đơn hàng mới:", error);
      message.error("Tạo đơn hàng thất bại.");
    }
  };

  const removeTab = (targetKey: TargetKey) => {
    Modal.confirm({
      title: "Xác nhận xóa đơn hàng?",
      content: "Bạn có chắc muốn xóa đơn này không? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      async onOk() {
        if (!authInfo?.token) {
          message.error("Vui lòng đăng nhập để tiếp tục.");
          return;
        }

        try {
          const orderIdToRemove = Number(targetKey);
          await fetchRemoveOrder(orderIdToRemove, authInfo.token, clearAuthInfo);
          setTabs((prevTabs) => prevTabs.filter((tab) => tab.value !== targetKey));
          if (activeKey === targetKey) {
            setActiveKey("");
            setSelectedOrder(null);
          }
          await getOrder(); // Làm mới danh sách đơn hàng
        } catch (error) {
          console.error("Error removing tab:", error);
          // Thông báo lỗi đã được xử lý trong fetchRemoveOrder
        }
      },
    });
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setSelectedOrder(Number(newActiveKey));
  };

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      addTab();
    } else {
      removeTab(targetKey);
    }
  };

  useEffect(() => {
    if (orderType) {
      switch (orderType) {
        case 1: // Takeaway
          getOrder();
          break;
        case 2: // Delivery
          if (selectedShipper !== null) {
            getOrder();
          }
          break;
        case 3: // Dine-in
          if (selectedTable !== null) {
            getOrder();
          }
          break;
        default:
          break;
      }
    }
  }, [orderType, selectedShipper, selectedTable, getOrder]);

  useSignalR(
    {
      eventName: "OrderListUpdate",
      groupName: "order",
      callback: (data: { roomId: number | null; shipperId: number | null; orderStatusId: number }) => {
        console.log("Received OrderListUpdate with data:", data);
        let shouldRefresh = false;
        switch (orderType) {
          case 1:
            shouldRefresh = true;
            break;
          case 2:
            if (selectedShipper !== null && data.shipperId === selectedShipper) {
              shouldRefresh = true;
            }
            break;
          case 3:
            if (selectedTable !== null && data.roomId === selectedTable) {
              shouldRefresh = true;
            }
            break;
          default:
            break;
        }
        if (shouldRefresh) {
          console.log("Refreshing order list for orderType:", orderType);
          getOrder();
        } else {
          console.log("Skipping refresh, client not related to event data");
        }
      },
    },
    [orderType, selectedShipper, selectedTable, getOrder]
  );

  return (
    <div className="p-3 bg-[#FFFFFF] w-full rounded-lg h-[calc(100vh-2rem)] flex flex-col">
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        className={`flex-1 flex flex-col h-full ${styles.customTabs}`}
        items={tabs.map((tab) => ({
          label: <span className={styles.customTabLabel}>{tab.label}</span>,
          key: tab.value,
          children: (
            <div className="flex flex-col gap-1 h-full">
              <div className="flex-none">
                <POSTableAndCustomerBar
                  selectedTable={selectedTable}
                  onCreateCustomer={openCustomerModal}
                  selectedOrder={selectedOrder}
                  orderType={orderType}
                  selectedShipper={selectedShipper}
                  currentTab={tab.value}
                />
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px]">
                <POSListOfOrder selectedOrder={selectedOrder} />
              </div>
            </div>
          ),
        }))}
      />
      <div className="flex-none border-none min-w-full rounded-md flex-grow-0">
        <POSPayment
          selectedOrder={selectedOrder}
          isReloadAfterPayment={isReloadAfterPayment}
          setIsReloadAfterPayment={setIsReloadAfterPayment}
          orderType={orderType}
        />
      </div>

      <ModalCreateCustomer open={isCustomerModalOpen} onClose={closeCustomerModal} />
    </div>
  );
};

export default ModelRightSide;