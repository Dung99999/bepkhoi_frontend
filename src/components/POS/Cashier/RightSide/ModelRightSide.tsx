import React, { useRef, useState, useEffect } from "react";
import { Tabs } from "antd";
import POSTableAndCustomerBar from "./POSTableAndCustomerBar";
import POSListOfOrder from "./POSListOfOrder";
import POSPayment from "./POSPayment";
import styles from "../../../../styles/POS/main.module.css";
import ModalCreateCustomer from "./ModalCreateCustomer";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface props{
  selectedTable: number | null;
  selectedShipper: number | null;
  orderType: number | null;
  setSelectedOrder: (orderId: number | null) => void;
  selectedOrder : number | null;
  isReloadAfterAddProduct: boolean;
  setIsReloadAfterAddProduct: (isReload: boolean) => void;  
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
    const response = await fetch(`${API_BASE_URL}api/orders/get-order-by-type-pos?${query.toString()}`);

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
    alert(result.message); // Hiển thị thông báo thành công
  } catch (error) {
    // Nếu có lỗi, hiển thị thông báo lỗi
    console.log(`${error}`)
  }
};


const ModelRightSide: React.FC<props> = ({ selectedTable, selectedShipper, orderType, selectedOrder, setSelectedOrder, isReloadAfterAddProduct, setIsReloadAfterAddProduct }) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const openCustomerModal = () => {
    console.log("Setting isCustomerModalOpen to true");
    setIsCustomerModalOpen(true);
  };
  const closeCustomerModal = () => setIsCustomerModalOpen(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const[order, setOrder] = useState<OrderModel[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [isReload, setIsReload] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null); 
  const [isReloadAfterUpdateQuantity, setIsReloadAfterUpdateQuantity] = useState<boolean>(false);
  const [isReloadAfterConfirm, setIsReloadAfterConfirm] = useState<boolean>(false);

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
      setActiveKey(newOrderId.toString());
      setSelectedOrder(newOrderId);
      setIsReload(true);
    } catch (error) {
      console.error("Không thể tạo đơn hàng mới:", error);
    }
  };
  

  const removeTab = async (targetKey: TargetKey) => {
    try {
      const orderIdToRemove = Number(targetKey);  
      await fetchRemoveOrder(orderIdToRemove);
      setTabs((prevTabs) => prevTabs.filter((tab) => tab.value !== targetKey));
      if (activeKey === targetKey) {
        setActiveKey("");  
        setSelectedOrder(null);
      }
      const updatedOrders = await fetchOrders(selectedTable, selectedShipper, orderType);
      if (updatedOrders.length === 0) {
        setTabs([]);  
        setOrder([]);  
      } else {
        const updatedTabs: Tab[] = updatedOrders.map((order) => ({
          label: `Đơn ${order.orderId}`,
          value: order.orderId.toString(),
        }));
        setTabs(updatedTabs);
        setOrder(updatedOrders);
      }
    } catch (error) {
      console.error("Error removing tab:", error);
    }
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
      const orders = await fetchOrders(selectedTable, selectedShipper, orderType);
      if (!orders || orders.length === 0) {
        // Không có đơn hàng nào
        setTabs([]);
        console.log("Không có đơn hàng nào phù hợp.");
        setOrder([])
        setSelectedOrder(null)
        return;
      }
      // Nếu có đơn hàng thì map sang tab
      const generatedTabs: Tab[] = orders.map((order) => ({
        label: `Đơn ${order.orderId}`,
        value: order.orderId.toString(),
      }));
      setTabs(generatedTabs);
      setActiveKey(generatedTabs[0].value);
      setSelectedOrder(Number(generatedTabs[0].value))
      setOrder(orders); 
    } catch (error) {
      console.log("Failed to get orders:", error);
      setOrder([])
      setSelectedOrder(null)
    }
  }
  async function ReloadAfterCreateOrder() {
    try {
      const orders = await fetchOrders(selectedTable, selectedShipper, orderType);
      if (!orders || orders.length === 0) {
        // Không có đơn hàng nào
        setTabs([]);
        console.log("Không có đơn hàng nào phù hợp.");
        setIsReload(false);
        return;
      }
      // Nếu có đơn hàng thì map sang tab
      const generatedTabs: Tab[] = orders.map((order) => ({
        label: `Đơn ${order.orderId}`,
        value: order.orderId.toString(),
      }));
      setTabs(generatedTabs);
      setOrder(orders); 
      setIsReload(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setIsReload(false);
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
    if(isReload==true){
      ReloadAfterCreateOrder();
    }
  }, [isReload]);

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
                  key={selectedOrder}
                  selectedTable={selectedTable}
                  onCreateCustomer={openCustomerModal}
                  onCustomerSelect={setSelectedCustomerId}
                  selectedOrder={selectedOrder}
                />
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px]">
                <POSListOfOrder 
                selectedOrder={selectedOrder}
                isReloadAfterAddProduct={isReloadAfterAddProduct}
                setIsReloadAfterAddProduct={setIsReloadAfterAddProduct}
                isReloadAfterUpdateQuantity={isReloadAfterUpdateQuantity}
                setIsReloadAfterUpdateQuantity={setIsReloadAfterUpdateQuantity}
                isReloadAfterConfirm={isReloadAfterConfirm}
                setIsReloadAfterConfirm={setIsReloadAfterConfirm}
                />
              </div>
            </div>
          ),
        }))}
      />
      <div className="flex-none border-none min-w-full rounded-mdflex-grow-0">
        <POSPayment 
        selectedOrder={selectedOrder}
        isReloadAfterAddProduct={isReloadAfterAddProduct}
        setIsReloadAfterAddProduct={setIsReloadAfterAddProduct}
        isReloadAfterUpdateQuantity={isReloadAfterUpdateQuantity}
        setIsReloadAfterUpdateQuantity={setIsReloadAfterUpdateQuantity}
        isReloadAfterConfirm={isReloadAfterConfirm}
        setIsReloadAfterConfirm={setIsReloadAfterConfirm}
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
