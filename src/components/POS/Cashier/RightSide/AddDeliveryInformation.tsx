import React from "react";
import { useState, useEffect } from "react";
import { Modal, Input, Button, Radio, message } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../context/AuthContext";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
interface Props {
  open: boolean;
  onClose: () => void;
  selectedOrder: number | null;
}
interface DeliveryInformation {
    deliveryInformationId: number;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    deliveryNote: string | null;
  }
  interface DeliveryInformationCreateDto {
    orderId: number;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    deliveryNote?: string;
  }
// async function 
const fetchDeliveryInformation = async (
  orderId: number, 
  token: string, 
  clearAuthInfo: () => void
): Promise<DeliveryInformation | null> => {
  const url = `${API_BASE_URL}api/orders/delivery-information/${orderId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token,
      },
    });

    // Kiểm tra nếu response trả về 401, gọi clearAuthInfo
    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      console.log(`Error: API request failed with status code ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data?.data) {
      return data.data;
    } else {
      console.log('Error: Không có dữ liệu giao hàng.');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    return null;
  }
};

// Tương tự cho các hàm fetch khác
const fetchEditDeliveryInformation = async (
  payload: DeliveryInformationCreateDto,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  const url = `${API_BASE_URL}api/orders/add-order-delivery-information`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`API Error ${response.status}:`, errorData.message || errorData);
      return false;
    }
    const data = await response.json();
    console.log("Thành công:", data.message);
    return true;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return false;
  }
};
  
  
const AddDeliveryInformation: React.FC<Props> = ({ open, onClose, selectedOrder }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const clearFormFields = () => {
    setCustomerName("");
    setPhone("");
    setAddress("");
    setNote("");
  };

  const handleSubmit = async () => {
    if (!selectedOrder) {
      message.warning("Không có đơn hàng được chọn.");
      return;
    }

    if (!customerName.trim()) {
      message.warning("Tên khách hàng không được để trống.");
      return;
    }

    if (customerName.length > 100) {
      message.warning("Tên khách hàng không được vượt quá 100 ký tự.");
      return;
    }

    if (!phone.trim()) {
      message.warning("Số điện thoại không được để trống.");
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      message.warning("Số điện thoại không đúng định dạng.");
      return;
    }

    if (phone.length > 20) {
      message.warning("Số điện thoại không được vượt quá 20 ký tự.");
      return;
    }

    if (!address.trim()) {
      message.warning("Địa chỉ không được để trống.");
      return;
    }

    if (address.length > 255) {
      message.warning("Địa chỉ không được vượt quá 255 ký tự.");
      return;
    }

    if (note && note.length > 255) {
      message.warning("Ghi chú không được vượt quá 255 ký tự.");
      return;
    }

    const payload: DeliveryInformationCreateDto = {
      orderId: selectedOrder,
      receiverName: customerName.trim(),
      receiverPhone: phone.trim(),
      receiverAddress: address.trim(),
      deliveryNote: note?.trim() || "",
    };

    const success = await fetchEditDeliveryInformation(payload, authInfo?.token || "", clearAuthInfo);

    if (success) {
      message.success("Thêm thông tin giao hàng thành công.");
      onClose();
    } else {
      message.error("Thêm thông tin giao hàng thất bại. Vui lòng thử lại.");
    }
  };

  const getDeliveryInfo = async (orderId: number) => {
    const deliveryInfo = await fetchDeliveryInformation(orderId, authInfo?.token || "", clearAuthInfo);
    if (deliveryInfo) {
      setCustomerName(deliveryInfo.receiverName);
      setPhone(deliveryInfo.receiverPhone);
      setAddress(deliveryInfo.receiverAddress);
      setNote(deliveryInfo.deliveryNote || "");
    } else {
      clearFormFields();
    }
  };

  useEffect(() => {
    if (selectedOrder !== null && open) {
      getDeliveryInfo(selectedOrder);
    }
  }, [open]);

  return (
    <Modal
      title="Thông tin giao hàng"
      open={open}
      onCancel={() => onClose()}
      footer={null}
    >
      <div className="flex flex-col w-full justify-between">
        <div className="flex flex-col gap-4">
          {/* Column 1 */}
          <div className="flex items-center gap-4">
            <p className="w-1/3">Tên khách hàng</p>
            <input
              name="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Điện thoại</p>
            <input
              name="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Địa Chỉ</p>
            <input
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Ghi chú</p>
            <input
              name="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
        <div className="text-end my-5">
          <button
            className="bg-[#fccb77] mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-[#fab848]"
            type="button"
            onClick={handleSubmit}
          >
            <SaveOutlined />
            <span className="ml-2">Lưu</span>
          </button>
          <button
            className="bg-gray-300 mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-gray-400"
            type="button"
            onClick={() => {
              clearFormFields();
              onClose();
            }}
          >
            <StopOutlined />
            <span className="ml-2">Bỏ qua</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddDeliveryInformation;

