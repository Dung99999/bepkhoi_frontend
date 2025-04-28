import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Select,
  Radio,
  Typography,
  InputNumber,
  Table,
  Button,
  message,
} from "antd";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
const { Text } = Typography;

interface SplitOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  selectedOrder: number | null;
}

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

interface SplitToOption {
  value: number;
  label: string;
}

interface RoomModel {
  roomId: number;
  roomName: string;
  roomAreaId: number;
  ordinalNumber: number;
  seatNumber: number;
  roomNote: string;
  isUse: boolean;
}

interface SplitToRoomOption {
  value: number;
  label: string;
}

interface ShipperModel {
  userId: number;
  userName: string;
  phone: string;
  status: boolean;
}

interface SplitToShipperOption {
  value: number;
  label: string;
}

interface OrderDetailModel {
  orderDetailId: number;
  orderId: number;
  status: boolean;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string | null;
}

interface SplitOrderPosRequestProduct {
  order_detail_id: number;
  product_id: number;
  quantity: number;
}

interface SplitOrderPosRequest {
  createNewOrder: boolean;
  orderId: number;
  splitTo?: number | null;
  orderTypeId: number;
  roomId?: number | null;
  shipperId?: number | null;
  product: SplitOrderPosRequestProduct[];
}

interface CombineOption {
  value: string;
  label: string;
}

interface CombineOrderPosRequestDto {
  firstOrderId: number;
  secondOrderId: number;
}

const fetchAllOrders = async (
  token: string,
  clearAuthInfo: () => void
): Promise<OrderModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-all-orders`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

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

    const result = await response.json();
    return result.data as OrderModel[];
  } catch (error) {
    console.error("Fetch error:", error);
    message.error("Lỗi kết nối khi lấy danh sách đơn hàng.");
    return [];
  }
};

const fetchAllRoom = async (
  token: string,
  clearAuthInfo: () => void
): Promise<RoomModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/rooms/get-all-room-for-pos`, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      const errorBody = await response.json();
      message.error(errorBody.message || "Không thể lấy danh sách phòng.");
      return [];
    }

    const result = await response.json();
    return result as RoomModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchAllRoom:", error.message || error);
    message.error("Lỗi kết nối khi lấy danh sách phòng.");
    return [];
  }
};

const fetchAllShippers = async (
  token: string,
  clearAuthInfo: () => void
): Promise<ShipperModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/Shipper`, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      const errorBody = await response.json();
      message.error(errorBody.message || "Không thể lấy danh sách shipper.");
      return [];
    }

    const result = await response.json();
    return result as ShipperModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchAllShippers:", error.message || error);
    message.error("Lỗi kết nối khi lấy danh sách shipper.");
    return [];
  }
};

const fetchOrderDetail = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderDetailModel[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}api/orders/get-order-details-by-order-id?orderId=${orderId}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
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
      message.error(errorBody.message || "Không thể lấy chi tiết đơn hàng.");
      return [];
    }

    const result = await response.json();
    return result as OrderDetailModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchOrderDetail:", error.message || error);
    message.error("Lỗi kết nối khi lấy chi tiết đơn hàng.");
    return [];
  }
};

const fetchSplitOrder = async (
  requestData: SplitOrderPosRequest,
  token: string,
  clearAuthInfo: () => void
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/order-detail/SplitOrderPos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return { success: false, message: "Phiên làm việc đã hết hạn.", error: "Unauthorized" };
    }

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Tách đơn thành công.",
      };
    }

    if (response.status === 400) {
      return {
        success: false,
        message: result.message || "Yêu cầu không hợp lệ.",
        error: result.error || "Bad request",
      };
    }

    if (response.status === 500) {
      return {
        success: false,
        message: "Lỗi server.",
        error: result.error || "Internal server error",
      };
    }

    return {
      success: false,
      message: "Lỗi không xác định.",
      error: result.error || "Unknown error",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Lỗi kết nối server.",
      error: error.message || "Network or unknown error",
    };
  }
};

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

const fetchCombineOrder = async (
  request: CombineOrderPosRequestDto,
  token: string,
  clearAuthInfo: () => void
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/combine-orders`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return { success: false, message: "Phiên làm việc đã hết hạn.", error: "Unauthorized" };
    }

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Ghép đơn thành công.",
      };
    }

    if (response.status === 400 || response.status === 404) {
      return {
        success: false,
        message: result.message || "Yêu cầu không hợp lệ.",
      };
    }

    return {
      success: false,
      message: "Lỗi không xác định.",
      error: result.error || result.message || "Unknown error",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Lỗi kết nối server.",
      error: error.message || "Unknown fetch error",
    };
  }
};

const ModalSplitOrder: React.FC<SplitOrderModalProps> = ({
  open,
  onCancel,
  onOk,
  selectedOrder,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [splitMode, setSplitMode] = useState<"split" | "merge">("split");
  const [splitToOptionList, setSplitToOptionList] = useState<SplitToOption[]>([
    { value: 0, label: "Tạo đơn mới" },
  ]);
  const [splitToRoomList, setSplitToRoomList] = useState<SplitToRoomOption[]>([]);
  const [splitToShipperList, setSplitToShipperList] = useState<SplitToShipperOption[]>([]);
  const [splitToOrder, setSplitToOrder] = useState<number>(0);
  const [splitToRoom, setSplitToRoom] = useState<number | null>(null);
  const [splitToShipper, setSplitToShipper] = useState<number | null>(null);
  const [orderType, setOrderType] = useState<number | undefined>(undefined);
  const [orderDetails, setOrderDetails] = useState<(OrderDetailModel & { splitQty: number })[]>([]);
  const [combineOptionList, setCombineOptionList] = useState<CombineOption[]>([]);
  const [combineOptionValue, setCombineOptionValue] = useState<string | null>(null);
  const [combineOrderList, setCombineOrderList] = useState<OrderModel[]>([]);
  const [selectedCombineOrderId, setSelectedCombineOrderId] = useState<number | null>(null);

  const SplitColumns = [
    {
      title: "Mã SP",
      dataIndex: "productId",
      key: "productId",
      width: "10%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "45%",
      render: (_: any, record: OrderDetailModel) => (
        <span className={record.status ? "text-green-500 font-semibold" : ""}>
          {record.productName}
        </span>
      ),
    },
    {
      title: "SL trên đơn gốc",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
    },
    {
      title: "SL tách",
      dataIndex: "splitQty",
      key: "splitQty",
      width: "20%",
      render: (value: number, record: any) => (
        <InputNumber
          min={0}
          max={record.quantity}
          value={value}
          onChange={(val) => {
            const newData = orderDetails.map((item) =>
              item.orderDetailId === record.orderDetailId
                ? { ...item, splitQty: Math.min(val || 0, item.quantity) }
                : item
            );
            setOrderDetails(newData);
          }}
        />
      ),
    },
  ];

  const mergeColumns = [
    {
      title: "",
      key: "radio",
      width: "5%",
      render: (_: any, record: OrderModel) => (
        <Radio
          checked={selectedCombineOrderId === record.orderId}
          onChange={() => setSelectedCombineOrderId(record.orderId)}
        />
      ),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      render: (value: number | null) => value ? value : "Khách lẻ",
    },
    {
      title: "Mã đơn đặt",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Tổng SL hàng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amountDue",
      key: "amountDue",
      render: (value: number) => `${value.toLocaleString()} đ`,
    },
  ];

  const getAllOrder = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const orders = await fetchAllOrders(authInfo.token, clearAuthInfo);
    const filteredOrders = orders.filter((order) => order.orderId !== selectedOrder);
    const options: SplitToOption[] = filteredOrders.map((order) => ({
      value: order.orderId,
      label: `Đơn ${order.orderId} - ${order.orderNote || "Không có ghi chú"}`,
    }));
    setSplitToOptionList([{ value: 0, label: "Tạo đơn mới" }, ...options]);
  }, [authInfo?.token, clearAuthInfo, selectedOrder]);

  const getAllRoom = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const rooms = await fetchAllRoom(authInfo.token, clearAuthInfo);
    const options: SplitToRoomOption[] = rooms.map((room) => ({
      value: room.roomId,
      label: room.roomName,
    }));
    setSplitToRoomList(options);
  }, [authInfo?.token, clearAuthInfo]);

  const getAllShippers = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const shippers = await fetchAllShippers(authInfo.token, clearAuthInfo);
    const options: SplitToShipperOption[] = shippers
      .filter((shipper) => shipper.status)
      .map((shipper) => ({
        value: shipper.userId,
        label: `${shipper.userName} - ${shipper.phone}`,
      }));
    setSplitToShipperList(options);
  }, [authInfo?.token, clearAuthInfo]);

  const getOrderDetail = useCallback(
    async (orderId: number) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      const data = await fetchOrderDetail(orderId, authInfo.token, clearAuthInfo);
      if (data.length > 0) {
        const mapped = data.map((item) => ({
          orderDetailId: item.orderDetailId,
          orderId: item.orderId,
          status: item.status,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          productNote: item.productNote,
          splitQty: 0,
        }));
        setOrderDetails(mapped);
      } else {
        setOrderDetails([]);
      }
    },
    [authInfo?.token, clearAuthInfo]
  );

  const getCombinedOptions = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    try {
      const [rooms, shippers] = await Promise.all([
        fetchAllRoom(authInfo.token, clearAuthInfo),
        fetchAllShippers(authInfo.token, clearAuthInfo),
      ]);

      const takeawayOption: CombineOption = {
        value: "takeaway",
        label: "Mang về",
      };

      const roomOptions: CombineOption[] = rooms.map((room) => ({
        value: `room-${room.roomId}`,
        label: room.roomName,
      }));

      const shipperOptions: CombineOption[] = shippers
        .filter((shipper) => shipper.status)
        .map((shipper) => ({
          value: `shipper-${shipper.userId}`,
          label: `${shipper.userName} - ${shipper.phone}`,
        }));

      setCombineOptionList([takeawayOption, ...roomOptions, ...shipperOptions]);
    } catch (error) {
      console.error("Error fetching combined options:", error);
      message.error("Lỗi khi lấy tùy chọn gộp đơn.");
    }
  }, [authInfo?.token, clearAuthInfo]);

  const handleCombineOptionChange = useCallback(
    async (value: string) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      let roomId: number | null = null;
      let shipperId: number | null = null;
      let orderTypeId: number | null = null;

      if (value === "takeaway") {
        orderTypeId = 1;
      } else if (value.startsWith("room-")) {
        roomId = parseInt(value.split("room-")[1], 10);
        orderTypeId = 3;
      } else if (value.startsWith("shipper-")) {
        shipperId = parseInt(value.split("shipper-")[1], 10);
        orderTypeId = 2;
      }

      try {
        const orders = await fetchOrders(
          roomId,
          shipperId,
          orderTypeId,
          authInfo.token,
          clearAuthInfo
        );
        const filteredOrders =
          selectedOrder != null
            ? orders.filter((o) => o.orderId !== selectedOrder)
            : orders;
        setCombineOrderList(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders for merge:", error);
        setCombineOrderList([]);
        message.error("Lỗi khi lấy danh sách đơn hàng để gộp.");
      }
    },
    [authInfo?.token, clearAuthInfo, selectedOrder]
  );

  const handleSplitOrder = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!selectedOrder) {
      message.warning("Không có đơn hàng được chọn.");
      return;
    }

    const productsToSplit = orderDetails
      .filter((item) => item.splitQty > 0)
      .map((item) => ({
        order_detail_id: item.orderDetailId,
        product_id: item.productId,
        quantity: item.splitQty,
      }));

    if (productsToSplit.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để tách.");
      return;
    }

    let requestData: SplitOrderPosRequest;
    const isCreateNewOrder = splitToOrder === 0;

    if (isCreateNewOrder) {
      if (!orderType) {
        message.warning("Vui lòng chọn loại đơn khi tạo đơn mới.");
        return;
      }
      if (orderType === 3 && splitToRoom == null) {
        message.warning("Vui lòng chọn phòng/bàn khi tạo đơn phòng.");
        return;
      }
      if (orderType === 2 && splitToShipper == null) {
        message.warning("Vui lòng chọn shipper khi tạo đơn giao đi.");
        return;
      }

      requestData = {
        createNewOrder: true,
        orderId: selectedOrder,
        orderTypeId: orderType,
        roomId: orderType === 3 ? splitToRoom ?? null : null,
        shipperId: orderType === 2 ? splitToShipper ?? null : null,
        product: productsToSplit,
      };
    } else {
      requestData = {
        createNewOrder: false,
        orderId: selectedOrder,
        splitTo: splitToOrder,
        orderTypeId: 0,
        product: productsToSplit,
      };
    }

    const result = await fetchSplitOrder(requestData, authInfo.token, clearAuthInfo);

    if (result.success) {
      message.success(result.message);
      onOk();
    } else {
      message.error(result.message);
      console.error("Tách đơn thất bại:", result.error);
    }
  };

  const handleCombineOrder = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!selectedOrder || !selectedCombineOrderId) {
      message.warning("Vui lòng chọn đơn hàng để gộp.");
      return;
    }

    const request: CombineOrderPosRequestDto = {
      firstOrderId: selectedOrder,
      secondOrderId: selectedCombineOrderId,
    };

    const result = await fetchCombineOrder(request, authInfo.token, clearAuthInfo);

    if (result.success) {
      message.success(result.message);
      onOk();
    } else {
      message.error(result.message);
      console.error("Ghép đơn thất bại:", result.error);
    }
  };

  useEffect(() => {
    if (open && authInfo?.token) {
      getAllOrder();
      getAllRoom();
      getAllShippers();
      getCombinedOptions();
      setSplitToOrder(0);
      setSplitToRoom(null);
      setSplitToShipper(null);
      setOrderType(undefined);
      setCombineOptionValue(null);
      setCombineOrderList([]);
      setSelectedCombineOrderId(null);
      if (selectedOrder != null) {
        getOrderDetail(selectedOrder);
      }
    }
  }, [open, authInfo?.token, selectedOrder, getAllOrder, getAllRoom, getAllShippers, getCombinedOptions, getOrderDetail]);

  useEffect(() => {
    if (combineOptionValue !== null) {
      handleCombineOptionChange(combineOptionValue);
    }
  }, [combineOptionValue, handleCombineOptionChange]);

  return (
    <Modal
      className="w-[60vw] h-auto"
      title={`Đơn đặt hàng ${selectedOrder ?? "~"}`}
      open={open}
      onCancel={onCancel}
      width="60vw"
      onOk={() => {
        if (splitMode === "split") {
          handleSplitOrder();
        } else if (splitMode === "merge") {
          handleCombineOrder();
        }
      }}
      okButtonProps={{
        className: `
          text-black 
          border 
          border-gray-300 
          bg-white 
          hover:bg-[#4096ff] 
          hover:text-white 
          hover:border-[#4096ff]
        `,
      }}
    >
      <div className="w-full h-auto">
        <Radio.Group
          onChange={(e) => setSplitMode(e.target.value)}
          value={splitMode}
          buttonStyle="solid"
        >
          <Radio.Button value="split">Tách đơn</Radio.Button>
          <Radio.Button value="merge">Ghép đơn</Radio.Button>
        </Radio.Group>

        {splitMode === "split" ? (
          <div>
            <div className="w-[100%] mt-[1vw] h-auto flex flex-row justify-between items-center">
              <p className="font-semibold">Tách đến</p>
              <Select<number>
                showSearch
                value={splitToOrder}
                placeholder="Chọn hóa đơn bạn muốn tách đến"
                style={{ width: 300 }}
                onChange={(value: number) => {
                  setSplitToOrder(value);
                  if (value !== 0) {
                    setOrderType(undefined);
                    setSplitToRoom(null);
                    setSplitToShipper(null);
                  }
                }}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={splitToOptionList.filter(Boolean)}
              />
              {splitToOrder === 0 && (
                <Select<number>
                  style={{ width: 300 }}
                  value={orderType}
                  placeholder="Chọn loại đơn"
                  onChange={(value) => setOrderType(value)}
                  options={[
                    { value: 1, label: "Mang về" },
                    { value: 2, label: "Giao đi" },
                    { value: 3, label: "Phòng bàn" },
                  ]}
                />
              )}
              {orderType === 2 && splitToOrder === 0 && (
                <Select<number>
                  placeholder="Chọn shipper"
                  style={{ width: 200 }}
                  value={splitToShipper}
                  onChange={(value) => setSplitToShipper(value)}
                  options={splitToShipperList}
                />
              )}
              {orderType === 3 && splitToOrder === 0 && (
                <Select<number>
                  placeholder="Chọn Phòng/bàn"
                  style={{ width: 200 }}
                  value={splitToRoom}
                  onChange={(value) => setSplitToRoom(value)}
                  options={splitToRoomList}
                />
              )}
            </div>
            <Table
              className="mt-[2vw]"
              dataSource={orderDetails}
              columns={SplitColumns}
              pagination={false}
              bordered
              size="small"
              rowKey="orderDetailId"
              locale={{
                emptyText: "Không có sản phẩm nào trong đơn",
              }}
            />
          </div>
        ) : (
          <div>
            <div className="w-[100%] mt-[1vw] h-auto flex flex-row justify-start items-center">
              <p className="font-semibold mr-3">Ghép đến</p>
              <Select<string>
                showSearch
                value={combineOptionValue}
                placeholder="Chọn nơi bạn muốn ghép đến"
                style={{ width: 300 }}
                onChange={(value: string) => setCombineOptionValue(value)}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={combineOptionList}
              />
            </div>
            <Table
              className="mt-[2vw]"
              dataSource={combineOrderList}
              columns={mergeColumns}
              rowKey="orderId"
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: "Không có đơn hàng nào để gộp" }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalSplitOrder;