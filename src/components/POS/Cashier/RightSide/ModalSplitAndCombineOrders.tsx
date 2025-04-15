import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Space,
  Radio,
  Typography,
  InputNumber,
  Table,
  Button,
  message
} from "antd";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

const { Text } = Typography;

interface SplitOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  selectedOrder: number | null;
  setIsReloadAfterUpdateQuantity: (isReload: boolean) => void;
  setIsReloadAfterAddProduct: (isReload: boolean) => void;
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
interface RoomDtoPos {
  roomId: number;
  roomName: string;
  roomAreaId: number;
  ordinalNumber: number;
  seatNumber: number;
  roomNote: string;
  isUse: boolean;
}
interface CombineOption{
  value: string;
  label: string;
}
interface CombineOrderPosRequestDto {
  firstOrderId: number;
  secondOrderId: number;
}
const fetchAllOrders = async (): Promise<OrderModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-all-orders`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.log("Fetch orders failed:", errorBody.message || "Unknown error");
      return [];
    }

    const result = await response.json();
    return result.data as OrderModel[];
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
};
const fetchAllRoom = async (): Promise<RoomModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/rooms/get-all-room-for-pos`, {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Lỗi khi fetch room:", errorBody.message || "Unknown error");
      return []; // hoặc throw nếu bạn muốn xử lý ở nơi gọi
    }

    const result = await response.json();
    return result as RoomModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchAllRoom:", error.message || error);
    return [];
  }
};
const fetchAllShippers = async (): Promise<ShipperModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/Shipper`, {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Lỗi khi fetch shipper:", errorBody.message || "Unknown error");
      return [];
    }

    const result = await response.json();
    return result as ShipperModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchAllShippers:", error.message || error);
    return [];
  }
};
const fetchOrderDetail = async (orderId: number): Promise<OrderDetailModel[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}api/orders/get-order-details-by-order-id?orderId=${orderId}`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Lỗi khi fetch order details:", errorBody.message || "Unknown error");
      return [];
    }

    const result = await response.json();
    return result as OrderDetailModel[];
  } catch (error: any) {
    console.error("Lỗi khi gọi API fetchOrderDetail:", error.message || error);
    return [];
  }
};

async function fetchSplitOrder(
  requestData: SplitOrderPosRequest
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}api/order-detail/SplitOrderPos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: result.message || "Order split successfully"
      };
    }

    // Xử lý lỗi do request không hợp lệ (400)
    if (response.status === 400) {
      return {
        success: false,
        message: "Request invalid or rejected",
        error: result.message || "Bad request"
      };
    }

    // Xử lý lỗi server nội bộ (500)
    if (response.status === 500) {
      return {
        success: false,
        message: "Server encountered an error",
        error: result.error || "Internal server error"
      };
    }

    // Các lỗi khác không mong đợi
    return {
      success: false,
      message: "Unexpected error occurred",
      error: result.error || "Unknown error"
    };

  } catch (error: any) {
    // Lỗi kết nối mạng hoặc fetch lỗi
    return {
      success: false,
      message: "Failed to connect to server",
      error: error.message || "Network or unknown error"
    };
  }
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

async function fetchCombineOrder(
  request: CombineOrderPosRequestDto
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/combine-orders`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: result.message || "Orders combined successfully.",
      };
    }
    // Handle known 400 and 404 errors
    if (response.status === 400 || response.status === 404) {
      return {
        success: false,
        message: result.message || "Invalid request.",
      };
    }
    // Catch-all for any other non-200 errors
    return {
      success: false,
      message: "Unexpected error occurred.",
      error: result.error || result.message || "Unknown error.",
    };
  } catch (error: any) {
    // Handle network/server-side fetch errors
    return {
      success: false,
      message: "Failed to connect to server.",
      error: error.message || "Unknown fetch error.",
    };
  }
}

// async function fetchAllRoomsForPos(): Promise<{
//   success: boolean;
//   data?: RoomDtoPos[];
//   message?: string;
// }> {
//   try {
//     const response = await fetch(`${API_BASE_URL}api/rooms/get-all-room-for-pos`);
//     if (response.ok) {
//       const data: RoomDtoPos[] = await response.json();
//       return {
//         success: true,
//         data,
//       };
//     } else if (response.status === 404) {
//       const error = await response.json();
//       return {
//         success: false,
//         message: error.message || "Không tìm thấy dữ liệu phòng.",
//       };
//     } else if (response.status === 400) {
//       const error = await response.json();
//       return {
//         success: false,
//         message: error.message || "Yêu cầu không hợp lệ.",
//       };
//     } else {
//       const error = await response.json();
//       return {
//         success: false,
//         message: error.message || "Lỗi không xác định.",
//       };
//     }
//   } catch (err: any) {
//     return {
//       success: false,
//       message: "Lỗi kết nối server hoặc mạng.",
//     };
//   }
// }


const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const ModalSplitOrder: React.FC<SplitOrderModalProps> = ({
  open,
  onCancel,
  onOk,
  selectedOrder,
  setIsReloadAfterUpdateQuantity,
  setIsReloadAfterAddProduct
}) => {
  const [splitMode, setSplitMode] = useState<"split" | "merge">("split");
  //Split to state
  const [splitToOptionList, setSplitToOptionList] = useState<SplitToOption[]>([
    { value: 0, label: "Tạo đơn mới" }
  ]);
  const [splitToRoomList, setSplitToRoomList] = useState<SplitToRoomOption[]>()
  const [splitToShipperList, setSplitToShipperList] = useState<SplitToShipperOption[]>([]);
  const [splitToOrder, setSplitToOrder] = useState<number>(0);
  const [splitToRoom, setSplitToRoom] = useState<number|null>(null);
  const [splitToShipper, setSplitToShipper] = useState<number|null>(null);
  const [orderType, setOrderType] = useState<number|undefined>(undefined);
  const [orderDetails, setOrderDetails] = useState<(OrderDetailModel & { splitQty: number })[]>([]);
  //Combine state
  const [combineOptionList, setCombineOptionList] = useState<CombineOption[]>([]);
  const [combineOptionValue, setCombineOptionValue] = useState<string|null>(null);
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

  const handleSplitOrder = async () => {
    if (!selectedOrder) {
      console.warn("Không có đơn hàng được chọn.");
      return;
    }
    // Lọc những sản phẩm có số lượng tách > 0
    const productsToSplit = orderDetails
      .filter((item) => item.splitQty > 0)
      .map((item) => ({
        order_detail_id: item.orderDetailId,
        product_id: item.productId,
        quantity: item.splitQty,
      }));
  
    if (productsToSplit.length === 0) {
      console.warn("Không có sản phẩm nào được chọn để tách.");
      return;
    }
  
    let requestData: SplitOrderPosRequest;
  
    const isCreateNewOrder = splitToOrder === 0;
  
    if (isCreateNewOrder) {
      if (!orderType) {
        console.warn("Vui lòng chọn loại đơn khi tạo đơn mới.");
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
        orderTypeId: 0, // không cần thiết trong trường hợp này
        product: productsToSplit,
      };
    }
  
    const result = await fetchSplitOrder(requestData);
  
    if (result.success) {
      console.log("Tách đơn thành công:", result.message);
      message.success("Tách đơn thành công");
      onOk(); 
      setIsReloadAfterUpdateQuantity(true);
      setIsReloadAfterAddProduct(true);
    } else {
      console.error("Tách đơn thất bại:", result.error || result.message);
      message.error("Tách đơn thất bại. Vui lòng thử lại.");
    }
  };
  const handleCombineOrder = async () => {
    if (selectedOrder !== null && selectedCombineOrderId !== null) {
      const request: CombineOrderPosRequestDto = {
        firstOrderId: selectedOrder,
        secondOrderId: selectedCombineOrderId,
      };
      const result = await fetchCombineOrder(request);
      if (result.success) {
        message.success(result.message);
        setIsReloadAfterAddProduct(true);
        setIsReloadAfterUpdateQuantity(true);
        onOk(); 
      } else {
        message.error(result.message);
        if (result.error) {
          console.error("Chi tiết lỗi:", result.error);
        }
      }
    } else {
      message.warning("Không tìm thấy đơn đặt hàng.");
    }
  };

  const getAllOrder = async () => {
    const orders = await fetchAllOrders();
    const filteredOrders = orders.filter(order => order.orderId !== selectedOrder);
    const options: SplitToOption[] = filteredOrders.map((order) => ({
      value: order.orderId,
      label: `Đơn ${order.orderId} - ${order.orderNote || "Không có ghi chú"}`,
    }));
    setSplitToOptionList([
      { value: 0, label: "Tạo đơn mới" },
      ...options,
    ]);
  };
  const getAllRoom = async () => {
    const rooms = await fetchAllRoom();
    const options: SplitToRoomOption[] = rooms
      .map((room) => ({
        value: room.roomId,
        label: room.roomName,
      }));
    setSplitToRoomList(options);
  };
  const getAllShippers = async () => {
    const shippers = await fetchAllShippers();
    const options: SplitToShipperOption[] = shippers
      .filter((shipper) => shipper.status)
      .map((shipper) => ({
        value: shipper.userId,
        label: `${shipper.userName} - ${shipper.phone}`,
      }));
    setSplitToShipperList(options);
  };
  const getOrderDetail = async (orderId: number) => {
    const data = await fetchOrderDetail(orderId);
    if (data.length > 0) {
      const mapped = data.map((item: any) => ({
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
  };
  const getCombinedOptions = async () => {
    try {
      const [rooms, shippers] = await Promise.all([
        fetchAllRoom(),
        fetchAllShippers()
      ]);
  
      const takeawayOption: CombineOption = {
        value: "takeaway",
        label: "Mang về"
      };
  
      const roomOptions: CombineOption[] = rooms.map(room => ({
        value: `room-${room.roomId.toString()}`,
        label: room.roomName
      }));
  
      const shipperOptions: CombineOption[] = shippers
        .filter(shipper => shipper.status==true)
        .map(shipper => ({
          value: `shipper-${shipper.userId.toString()}`,
          label: `${shipper.userName} - ${shipper.phone}`
        }));
  
      setCombineOptionList([takeawayOption, ...roomOptions, ...shipperOptions]);
    } catch (error) {
      console.error("Error fetching combined options:", error);
    }
  };
  const handleCombineOptionChange = async (value: string) => {
    let roomId: number | null = null;
    let shipperId: number | null = null;
    let orderTypeId: number | null = null;
  
    if (value.trim() === "takeaway") {
      orderTypeId = 1;
    } else if (value.trim().startsWith("room-")) {
      const roomIdStr = value.split("room-")[1];
      roomId = parseInt(roomIdStr, 10);
      orderTypeId = 3;
    } else if (value.trim().startsWith("shipper-")) {
      const shipperIdStr = value.split("shipper-")[1];
      shipperId = parseInt(shipperIdStr, 10);
      orderTypeId = 2;
    }
    try {
      const orders = await fetchOrders(roomId, shipperId, orderTypeId);
      const filteredOrders = selectedOrder != null
      ? orders.filter((o) => o.orderId !== selectedOrder)
      : orders;
      setCombineOrderList(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch orders for merge:", error);
      setCombineOrderList([]);
    }
  };
  useEffect(() => {
    if(combineOptionValue!==null){
      handleCombineOptionChange(combineOptionValue)
    }
  }, [combineOptionValue])
  useEffect(() => {
    //Phần split order
    if (open) {
      getAllOrder();
      getAllRoom();
      getAllShippers();
      //set lại các state
      setSplitToOrder(0);
      setSplitToRoom(null);
      setSplitToShipper(null);
      setOrderType(undefined);
      if (selectedOrder != null) {
        getOrderDetail(selectedOrder);
      }
      //Phần combine order
      getCombinedOptions();
      setCombineOptionValue(null);
      setCombineOrderList([]);
      setSelectedCombineOrderId(null);
    }
  }, [open])
  return (
    <Modal
      className="w-[60vw] h-auto"
      title={`Đơn đặt hàng ${selectedOrder ?? "~"}`}
      open={open}
      onCancel={onCancel}
      width="60vw"
      onOk={() => {
        if(splitMode == "split"){
          handleSplitOrder();
        }
        if(splitMode == "merge"){
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
        `
      }}
    >
      {/* Split/ Merge Order General */}
      <div className="w-full h-auto">
        {/* Tab bar */}

        {/* Radio Group để chọn chế độ */}
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
            {/* Select option */}
            <div className=" w-[100%] mt-[1vw] h-auto flex flex-row justify-between">
              <p className="font-semibold">Tách đến</p>
              <Select<number>
                showSearch
                value={splitToOrder}
                placeholder="Chọn hóa đơn bạn muốn tách đến"
                style={{ width: 300 }}
                onChange={(value: number) => {
                  setSplitToOrder(value);
                  // reset orderType nếu người dùng chọn lại
                  if (value !== 0) {
                    setOrderType(undefined);
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
                  onChange={(value) => setOrderType(value)}
                  options={[
                    { value: 1, label: "Mang về" },
                    { value: 2, label: "Giao đi" },
                    { value: 3, label: "Phòng bàn" },
                  ]}
                />
              )}
              {orderType === 2 && splitToOrder === 0 && (
                <Select
                  placeholder="Chọn shipper"
                  style={{ width: 200 }}
                  value={splitToShipper}
                  onChange={(value) => setSplitToShipper(value)}
                  options={splitToShipperList}
                />
              )}
              {orderType === 3 && splitToOrder === 0 && (
                <Select
                  placeholder="Chọn Phòng/bàn"
                  style={{ width: 200 }}
                  value={splitToRoom}
                  onChange={(value) => setSplitToRoom(value)}
                  options={splitToRoomList}
                />
              )}
            </div>
            {/* Table */}
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
            {/* Select option */}
            <div className=" w-[100%] mt-[1vw] h-auto flex flex-row justify-start">
              <p className="font-semibold mr-3">Ghép đến</p>
                <Select
                  showSearch
                  value={combineOptionValue} 
                  placeholder="Chọn nơi bạn muốn ghép đến"
                  style={{ width: 300 }}
                  onChange={(value: string) => {
                    setCombineOptionValue(value);
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={combineOptionList}
                />
            </div>
            {/* Merge Order Table */}
            <Table
              className="mt-[2vw]"
              dataSource={combineOrderList}
              columns={mergeColumns}
              rowKey="orderId"
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: "Bạn không có đơn đặt hàng nào" }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalSplitOrder;
