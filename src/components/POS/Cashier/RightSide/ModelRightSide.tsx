import React, { useRef, useState, useEffect } from "react";
import { Tabs, Modal, message } from "antd";
import POSTableAndCustomerBar from "./POSTableAndCustomerBar";
import POSListOfOrder from "./POSListOfOrder";
import POSPayment from "./POSPayment";
import styles from "../../../../styles/POS/main.module.css";
import ModalCreateCustomer from "./ModalCreateCustomer";
import useSignalR from "../../../../CustomHook/useSignalR";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
const token = localStorage.getItem("Token");

interface props{
  selectedTable: number | null;
  selectedShipper: number | null;
  orderType: number | null;
  setSelectedOrder: (orderId: number | null) => void;
  selectedOrder : number | null;
}


type TargetKey = React.MouseEvent | React.KeyboardEvent | string;


interface OrderModel {
  orderId: number;
  customerId: number | null;
  shipperId: number | null;
  deliveryInformationId: number | null;
  orderTypeId: number;
  roomId: number | null;
  createdTime: string;  // Dạng ISO 8601 string
  totalQuantity: number;
  amountDue: number;
  orderStatusId: number;
  orderNote: string | null;
}

interface CreateNewOrder{
  customerId : number | null;
  shipperId : number | null;
  deliveryInformationId: number | null;
  orderTypeId : number;
  roomId : number | null;
  orderStatusId : number;
  orderNote : string | null;
}

interface Tab{
  label : string;
  value : string;
}


async function fetchOrders(roomId: number | null, shipperId: number | null, orderTypeId: number | null): Promise<OrderModel[]> {
  try {
    // Tạo chuỗi query string từ các tham số
    const query = new URLSearchParams();

    // Chỉ thêm query parameter nếu giá trị không phải null
    if (roomId !== null) {
      query.append("roomId", roomId.toString());
    }
    if (shipperId !== null) {
      query.append("shipperId", shipperId.toString());
    }
    if (orderTypeId !== null) {
      query.append("orderTypeId", orderTypeId.toString());
    }
    // Gửi request với query parameters nếu có
    const response = await fetch(
      `${API_BASE_URL}api/orders/get-order-by-type-pos?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse dữ liệu JSON và trả về kết quả
    const orders: OrderModel[] = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Ném lỗi ra ngoài để caller xử lý
  }
}

async function fetchCreateNewOrder(data: Omit<CreateNewOrder, "orderStatusId"> & { orderStatusId?: number }): Promise<number> {
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
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(requestBody),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to create order");
    }

    const orderId = json.data?.orderId;
    if (!orderId) {
      throw new Error("orderId not found in response");
    }

    return orderId;
  } catch (error) {
    throw error;
  }
}

const fetchRemoveOrder = async (orderId: number): Promise<void> => {
  try {
    // Gửi yêu cầu POST đến API để xóa đơn hàng
    const response = await fetch(`${API_BASE_URL}api/orders/remove-order/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token,
      },
    });

    // Kiểm tra mã trạng thái phản hồi
    if (!response.ok) {
      // Nếu mã trạng thái không phải 200 OK, lấy thông báo lỗi từ phản hồi
      const data = await response.json();
      throw new Error(data.Message || 'Failed to remove order');
    }
    // Nếu thành công, lấy kết quả và hiển thị thông báo
    const result = await response.json();
  } catch (error) {
    // Nếu có lỗi, hiển thị thông báo lỗi
    console.log(`${error}`)
  }
};


const ModelRightSide: React.FC<props> = ({ selectedTable, selectedShipper, orderType, selectedOrder, setSelectedOrder }) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  // const[order, setOrder] = useState<OrderModel[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [isReloadAfterPayment, setIsReloadAfterPayment] = useState<boolean>(false);
  const [previousSelectedOrderId, setPreviousSelectedOrderId] = useState<number | null>(null);

  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setSelectedOrder(Number(newActiveKey));
  };

  const addTab = async () => {
    try {
      // Kiểm tra dữ liệu cần thiết
      if (!orderType) {
        console.warn("Không thể tạo đơn hàng nếu chưa chọn loại đơn.");
        return;
      }
      // Tạo dữ liệu cho đơn hàng mới
      const newOrderData: Omit<CreateNewOrder, "orderStatusId"> = {
        customerId: null,
        shipperId: selectedShipper ?? null,
        deliveryInformationId: null,
        orderTypeId: orderType,
        roomId: selectedTable ?? null,
        orderNote: null,
      };
      // Gọi API tạo đơn hàng và chỉ nhận orderId
      const newOrderId = await fetchCreateNewOrder(newOrderData);
      // Cập nhật tab đang được chọn sang đơn hàng vừa tạo
      // setActiveKey(newOrderId.toString());
      // setSelectedOrder(newOrderId);
    } catch (error) {
      console.error("Không thể tạo đơn hàng mới:", error);
      message.error("Tạo đơn hàng thất bại");
    }
  };

  const removeTab = (targetKey: TargetKey) => {
    Modal.confirm({
      title: "Xác nhận xoá đơn hàng?",
      content: "Bạn có chắc muốn xoá đơn này không? Hành động này không thể hoàn tác.",
      okText: "Xoá",
      cancelText: "Hủy",
      okType: "danger",
      async onOk() {
        try {
          const orderIdToRemove = Number(targetKey);  
          await fetchRemoveOrder(orderIdToRemove);
          message.success("Xoá đơn hàng thành công");
          setTabs((prevTabs) => prevTabs.filter((tab) => tab.value !== targetKey));
          if (activeKey === targetKey) {
            setActiveKey("");  
            setSelectedOrder(null);
          }
        } catch (error) {
          console.error("Error removing tab:", error);
          message.error("Lỗi xoá đơn hàng");
        }
      },
    });
  };
  
  

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      addTab();
    } else {
      removeTab(targetKey);
    }
  };


async function getOrder() {
    try {
      console.log("getOrder called, current selectedOrder:", selectedOrder);
      const orders = await fetchOrders(selectedTable, selectedShipper, orderType);
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
      console.log("Failed to get orders:", error);
      setSelectedOrder(null);
      setActiveKey("");
      setPreviousSelectedOrderId(null);
    }
  }

  useEffect(() => {
    switch (orderType) {
      case 1:
        getOrder();
        break;
      case 2:
        if (selectedShipper !== null) {
          getOrder();
        }
        break;  
      case 3:
        if (selectedTable !== null) {
          getOrder();
        }
        break;
      default:
        break;
    }
  }, [selectedTable, selectedShipper, orderType]);
  
  useEffect(() => {
    switch (orderType) {
      case 1:
        getOrder();
        break;
      case 2:
        if (selectedShipper !== null) {
          getOrder();
        }
        break;  
      case 3:
        if (selectedTable !== null) {
          getOrder();
        }
        break;
      default:
        break;
    }
  }, []);

  useSignalR(
    {
      eventName: "OrderListUpdate",
      groupName: "order",
      callback: (data: { roomId: number | null; shipperId: number | null; orderStatusId: number }) => {
        console.log("Received OrderListUpdate with data:", data);
        // Kiểm tra xem client hiện tại có liên quan đến roomId hoặc shipperId trong sự kiện không
        let shouldRefresh = false;
        switch (orderType) {
          case 1: // Takeaway: luôn làm mới
            shouldRefresh = true;
            break;
          case 2: // Delivery: kiểm tra shipperId
            if (selectedShipper !== null && data.shipperId === selectedShipper) {
              shouldRefresh = true;
            }
            break;
          case 3: // Dine-in: kiểm tra roomId
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
    [orderType, selectedShipper, selectedTable]
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
          label: (
            <span className={`${styles.customTabLabel}`}>{tab.label}</span>
          ),
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
                <POSListOfOrder 
                selectedOrder={selectedOrder}
                />
              </div>
            </div>
          ),
        }))}
      />
      <div className="flex-none border-none min-w-full rounded-mdflex-grow-0">
        <POSPayment 
        selectedOrder={selectedOrder}
        isReloadAfterPayment={isReloadAfterPayment}
        setIsReloadAfterPayment={setIsReloadAfterPayment}
        orderType={orderType}
        />
      </div>

      <ModalCreateCustomer
        open={isCustomerModalOpen}
        onClose={closeCustomerModal}
      />
    </div>
  );
};

export default ModelRightSide;
