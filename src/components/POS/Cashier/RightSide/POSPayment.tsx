import {
  BellOutlined,
  CaretDownOutlined,
  DollarOutlined,
  EditOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { Empty, Input, Modal, message } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import DrawerPaymentFinal from "./DrawerPaymentFinal";
import ModalSplitOrder from "./ModalSplitAndCombineOrders";
import AddDeliveryInformation from "./AddDeliveryInformation";
import useSignalR from "../../../../CustomHook/useSignalR";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedOrder: number | null;
  isReloadAfterPayment: boolean;
  setIsReloadAfterPayment: (isReload: boolean) => void;
  orderType: number | null;
}

interface AddNoteRequest {
  orderId: number;
  orderNote: string;
}

interface OrderGeneralDataPosDto {
  orderId: number;
  orderNote?: string;
  totalQuantity: number;
  amountDue: number;
  hasUnconfirmProducts: boolean;
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

const fetchAddNoteToOrder = async (
  request: AddNoteRequest,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  const apiUrl = `${API_BASE_URL}api/orders/add-note`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return true;
    } else {
      const errorData = await response.json();
      if (response.status === 400) {
        console.error("Bad Request:", errorData.message);
      } else if (response.status === 404) {
        console.warn("Not Found:", errorData.message);
      } else {
        console.error("Server Error:", errorData.message);
      }
      message.error(errorData.message || "Không thể thêm ghi chú.");
      return false;
    }
  } catch (error) {
    console.error("Error calling addNoteToOrder:", error);
    message.error("Lỗi kết nối khi thêm ghi chú.");
    return false;
  }
};

const confirmOrderPos = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  const apiUrl = `${API_BASE_URL}api/order-detail/confirm/${orderId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      const errorData = await response.json();
      if (response.status === 400) {
        console.error("Bad Request:", errorData.message);
      } else if (response.status === 404) {
        console.warn("Not Found:", errorData.message);
      } else {
        console.error("Server Error:", errorData.message);
      }
      message.error(errorData.message || "Không thể xác nhận đơn hàng.");
      return false;
    }
  } catch (error) {
    console.error("Error calling confirmOrderPos:", error);
    message.error("Lỗi kết nối khi xác nhận đơn hàng.");
    return false;
  }
};

const fetchGeneralData = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderGeneralDataPosDto | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-order-general-data/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      const errorBody = await response.json();
      const messageText = errorBody.message || "Unknown error";
      const detail = errorBody.detail || "";
      switch (response.status) {
        case 404:
          console.error(`[Not Found] ${messageText}`);
          break;
        case 500:
          if (messageText.includes("cơ sở dữ liệu")) {
            console.error(`[Database Error] ${messageText} - ${detail}`);
          } else if (messageText.includes("không hợp lệ")) {
            console.error(`[Invalid Operation] ${messageText} - ${detail}`);
          } else {
            console.error(`[Unknown Server Error] ${messageText} - ${detail}`);
          }
          break;
        default:
          console.error(`[Unhandled Error] ${messageText} - ${detail}`);
          break;
      }
      message.error(messageText || "Không thể lấy thông tin đơn hàng.");
      return null;
    }

    const data: OrderGeneralDataPosDto = await response.json();
    return data;
  } catch (error) {
    message.error("Lỗi kết nối khi lấy thông tin đơn hàng.");
    return null;
  }
};

const POSPayment: React.FC<Props> = ({
  selectedOrder,
  isReloadAfterPayment,
  setIsReloadAfterPayment,
  orderType,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [isModalNoteOrderOpen, setIsNoteOrderModalOpen] = useState(false);
  const [isModalSplitOrderOpen, setIsModalSplitOrderOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isDrawerPaymentVisible, setIsDrawerPaymentVisible] = useState(false);
  const [orderData, setOrderData] = useState<OrderGeneralDataPosDto | null>(null);
  const [isAddDeliveryInformationOpen, setIsAddDeliveryInformationOpen] = useState<boolean>(false);

  const showDrawerPayment = () => setIsDrawerPaymentVisible(true);
  const onClosePaymentDrawer = () => setIsDrawerPaymentVisible(false);

  const getOrderGeneralData = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      setOrderData(null);
      return;
    }
    if (selectedOrder == null) {
      setOrderData(null);
      return;
    }
    const data = await fetchGeneralData(selectedOrder, authInfo.token, clearAuthInfo);
    setOrderData(data);
  }, [authInfo?.token, clearAuthInfo, selectedOrder]);

  const handleConfirm = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (orderData == null || selectedOrder == null) {
      message.warning("Không tìm thấy đơn hàng.");
      return;
    }
    if (!orderData.hasUnconfirmProducts) {
      message.warning("Vui lòng thêm sản phẩm mới vào đơn hàng.");
      return;
    }
    const confirmed = await confirmOrderPos(selectedOrder, authInfo.token, clearAuthInfo);
    if (confirmed) {
      message.success("Đơn hàng đã được xác nhận!");
      getOrderGeneralData();
    } else {
      message.error("Xác nhận đơn hàng thất bại.");
    }
  }, [authInfo?.token, clearAuthInfo, orderData, selectedOrder, getOrderGeneralData]);

  useSignalR(
    {
      eventName: "OrderUpdate",
      groupName: "order",
      callback: (updatedOrderId: number) => {
        if (updatedOrderId === selectedOrder) {
          getOrderGeneralData();
        }
      },
    },
    [selectedOrder, getOrderGeneralData]
  );

  const debounceCustomerUpdateOrder = useCallback(() => {
    let timeout: NodeJS.Timeout;
    return (updatedOrderId: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (updatedOrderId === selectedOrder) {
          message.info(`Khách hàng đã thêm một yêu cầu mới vào hóa đơn ${updatedOrderId}.`);
          getOrderGeneralData();
        }
      }, 500);
    };
  }, [selectedOrder, getOrderGeneralData]);

  useSignalR(
    {
      eventName: "CustomerUpdateOrder",
      groupName: "order",
      callback: debounceCustomerUpdateOrder(),
    },
    [debounceCustomerUpdateOrder]
  );

  useEffect(() => {
    getOrderGeneralData();
  }, [getOrderGeneralData]);

  useEffect(() => {
    if (orderData?.orderNote && orderData.orderNote.trim() !== "") {
      setNote(orderData.orderNote);
    } else {
      setNote("");
    }
  }, [orderData]);

  return (
    <div className="px-3 w-full bg-white rounded-md">
      <div className="flex flex-row bg-[#fafafa] w-full border-b py-2">
        <div className="justify-start flex items-center">
          <p className="text-gray-600 font-semibold mr-2 ml-2">Bếp Khói Ocean Park</p>
        </div>
        <div className="flex-1"></div>
        <div className="justify-end flex flex-row">
          <p className="font-semibold text-gray-700 mr-2">Tổng số lượng món: </p>
          <p className="mr-2 font-normal text-gray-700">
            {orderData && selectedOrder ? orderData.totalQuantity : 0} món
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full border-b pt-2 pb-2">
        <div className="justify-start flex items-center">
          <p
            className="text-gray-600 font-semibold cursor-not-allowed p-1"
            title="Bạn không có quyền chỉnh sửa"
          >
            {authInfo?.userName || "~"} ({authInfo?.roleName || "~"})
          </p>
          <div
            className={`mx-3 p-1 flex items-center rounded-full w-6 h-6 ${
              selectedOrder != null
                ? "cursor-pointer bg-gray-200 hover:bg-gray-400"
                : "cursor-not-allowed bg-gray-100"
            }`}
            title="Thêm ghi chú"
            onClick={() => {
              if (selectedOrder != null) {
                setIsNoteOrderModalOpen(true);
              }
            }}
          >
            <EditOutlined />
          </div>
          <button
            className={`px-3 py-1 rounded-full flex items-center ${
              selectedOrder != null && orderData?.totalQuantity != 0
                ? "bg-white text-gray-700 cursor-pointer hover:bg-gray-200"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => setIsModalSplitOrderOpen(true)}
            disabled={!(selectedOrder != null && orderData?.totalQuantity != 0)}
          >
            <SplitCellsOutlined />
            <span className="pl-2">Tách Đơn/Ghép Đơn</span>
          </button>
          {orderType === 2 && selectedOrder !== null && (
            <button
              className={`px-3 py-1 rounded-full flex items-center ${
                orderData?.totalQuantity !== 0
                  ? "bg-white text-gray-700 cursor-pointer hover:bg-gray-200"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => setIsAddDeliveryInformationOpen(true)}
              disabled={orderData?.totalQuantity === 0}
            >
              <span className="pl-2">Giao hàng</span>
            </button>
          )}
        </div>
        <div className="flex-1"></div>
        <div className="justify-end flex flex-row">
          <div className="px-1 py-1">
            <span className="mr-2 font-semibold text-gray-700">Tổng số tiền:</span>
            <span className="mr-2 font-normal text-gray-700">
              {orderData && selectedOrder ? orderData.amountDue.toLocaleString() : "0"}đ
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full pt-4 pb-2">
        <button
          className={`flex-1 flex w-full items-center gap-2 px-4 mr-2 py-8 border rounded-2xl justify-center ${
            selectedOrder != null && orderData?.hasUnconfirmProducts
              ? "bg-white text-lg font-semibold text-yellow-600 border-[#FFE6BC] border-2 cursor-pointer hover:bg-[#FFE6BC] hover:text-black hover:font-semibold"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleConfirm}
          disabled={!(selectedOrder != null && orderData?.hasUnconfirmProducts)}
        >
          <BellOutlined />
          <span>Xác nhận đơn</span>
        </button>
        <button
          className={`flex-1 flex w-full items-center gap-2 px-4 ml-2 py-2 border rounded-2xl justify-center ${
            selectedOrder != null && orderData?.totalQuantity != 0
              ? "bg-[#FFE6BC] font-semibold text-lg hover:bg-[#f7daa8] text-[#4a4133]"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={showDrawerPayment}
          disabled={!(selectedOrder != null && orderData?.totalQuantity != 0)}
        >
          <DollarOutlined />
          <span>Thanh toán</span>
        </button>
      </div>
      <DrawerPaymentFinal
        isVisible={isDrawerPaymentVisible}
        onClose={onClosePaymentDrawer}
        selectedOrder={selectedOrder}
        isReloadAfterPayment={isReloadAfterPayment}
        setIsReloadAfterPayment={setIsReloadAfterPayment}
      />
      <Modal
        title="Thêm ghi chú"
        open={isModalNoteOrderOpen}
        onCancel={() => setIsNoteOrderModalOpen(false)}
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
        onOk={async () => {
          if (!authInfo?.token) {
            message.error("Vui lòng đăng nhập để tiếp tục.");
            return;
          }
          if (!selectedOrder) {
            message.warning("Chưa chọn đơn hàng.");
            return;
          }
          const success = await fetchAddNoteToOrder(
            {
              orderId: selectedOrder,
              orderNote: note.trim(),
            },
            authInfo.token,
            clearAuthInfo
          );
          if (success) {
            message.success("Đã thêm ghi chú cho đơn hàng.");
            setIsNoteOrderModalOpen(false);
            getOrderGeneralData();
          } else {
            message.error("Thêm ghi chú thất bại.");
          }
        }}
      >
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
        />
      </Modal>
      <ModalSplitOrder
        open={isModalSplitOrderOpen}
        onCancel={() => setIsModalSplitOrderOpen(false)}
        onOk={() => {
          setIsModalSplitOrderOpen(false);
          getOrderGeneralData();
        }}
        selectedOrder={selectedOrder}
      />
      <AddDeliveryInformation
        open={isAddDeliveryInformationOpen}
        onClose={() => setIsAddDeliveryInformationOpen(false)}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default POSPayment;