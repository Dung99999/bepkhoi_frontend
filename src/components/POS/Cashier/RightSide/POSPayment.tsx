import {
  BellOutlined,
  CaretDownOutlined,
  DollarOutlined,
  EditOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { Empty, Input, Modal, message } from "antd";
import React, { useState, useEffect } from "react";
import DrawerPaymentFinal from "./DrawerPaymentFinal";
import ModalSplitOrder from "./ModalSplitOrders";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;



interface Props {
  selectedOrder: number | null;
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

async function fetchAddNoteToOrder(request: AddNoteRequest): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}api/orders/add-note`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return true;
    } else if (response.status === 400) {
      const errorData = await response.json();
      console.error('Bad Request:', errorData.message);
    } else if (response.status === 404) {
      const errorData = await response.json();
      console.warn('Not Found:', errorData.message);
    } else {
      const errorData = await response.json();
      console.error('Server Error:', errorData.message);
    }

    return false;
  } catch (error) {
    console.error('Error calling addNoteToOrder:', error);
    return false;
  }
}

async function confirmOrderPos(orderId: number): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}api/order-detail/confirm/${orderId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.message); 
      return true;
    } else if (response.status === 400) {
      const errorData = await response.json();
      console.error('Bad Request:', errorData.message);
    } else if (response.status === 404) {
      const errorData = await response.json();
      console.warn('Not Found:', errorData.message);
    } else {
      const errorData = await response.json();
      console.error('Server Error:', errorData.message);
    }
    return false;
  } catch (error) {
    console.error('Error calling confirmOrderPos:', error);
    return false;
  }
}

const fetchGeneralData = async (orderId: number): Promise<OrderGeneralDataPosDto | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-order-general-data/${orderId}`);

    if (!response.ok) {
      const errorBody = await response.json();
      const message = errorBody.message || 'Unknown error';
      const detail = errorBody.detail || '';
      switch (response.status) {
        case 404:
          console.error(`[Not Found] ${message}`);
          break;
        case 500:
          if (message.includes('cơ sở dữ liệu')) {
            console.error(`[Database Error] ${message} - ${detail}`);
          } else if (message.includes('không hợp lệ')) {
            console.error(`[Invalid Operation] ${message} - ${detail}`);
          } else {
            console.error(`[Unknown Server Error] ${message} - ${detail}`);
          }
          break;
        default:
          console.error(`[Unhandled Error] ${message} - ${detail}`);
          break;
      }
      return null;
    }
    const data: OrderGeneralDataPosDto = await response.json();
    return data;
  } catch (error: any) {
    console.error(`[Fetch Exception] Failed to fetch order summary: ${error.message}`);
    return null;
  }
};

const POSPayment: React.FC<Props> = ({ selectedOrder }) => {
  const [isModalNoteOrderOpen, setIsNoteOrderModalOpen] = useState(false);
  const [isModalSplitOrderOpen, setIsModalSplitOrderOpen] = useState(false);
  const [note, setNote] = useState("");
  const [splitNote, setSplitNote] = useState("");
  const [isDrawerPaymentVisible, setIsDrawerPaymentVisible] = useState(false);
  const [orderData, setOrderData] = useState<OrderGeneralDataPosDto | null>(null);

  const showDrawerPayment = () => setIsDrawerPaymentVisible(true);
  const onClosePaymentDrawer = () => setIsDrawerPaymentVisible(false);
  const handleConfirm = async () => {
    if (orderData==null || selectedOrder==null) {
      message.warning("Không tìm thấy đơn hàng.");
      return;
    }
    if(!orderData.hasUnconfirmProducts){
      message.warning("Vui lòng thêm sản phẩm mới vào đơn hàng.");
      return;
    }
    const confirmed = await confirmOrderPos(selectedOrder);
    if (confirmed) {
      message.success("Đơn hàng đã được xác nhận!");
    } else {
      message.error("Xác nhận đơn hàng thất bại.");
    }
  };
  const getOrderGeneralData = async () => {
    if (selectedOrder == null) {
      setOrderData(null);
      return;
    }
    const data = await fetchGeneralData(selectedOrder);
    setOrderData(data);
  };
  useEffect(() => {
    getOrderGeneralData();
  }, [selectedOrder]);
  
  useEffect(() => {
    if (orderData?.orderNote && orderData.orderNote.trim() !== "") {
      setNote(orderData.orderNote);
    } else {
      setNote("");
    }
  }, [orderData]);

  return (
    <div className="px-3 w-full bg-white rounded-md ">
      {/* First row */}
      <div className="flex flex-row bg-[#fafafa] w-full border-b  pb-2">
        {/* Left - first row */}
        <div className="justify-start flex items-center">
          {/* Name of discound */}
          <p className="text-gray-600 font-semibold mr-2 ml-2">
            Bếp Khói Ocean Park
          </p>
          <div
            className="mt-2 p-1 flex items-center bg-gray-100 rounded-full w-6 h-6 cursor-pointer hover:bg-gray-300"
            title="Chọn cửa hàng"
          >
            <CaretDownOutlined />
          </div>
        </div>

        <div className="flex-1"></div>
        {/* Right - first row */}
        <div className="justify-end flex flex-row">
          <p className="font-semibold text-gray-700 mr-2">Tổng số lượng món: </p>
          <p className="mr-2 font-normal text-gray-700">{(orderData!==null&&selectedOrder!==null)?orderData.totalQuantity:0} món</p>
        </div>
      </div>
      {/* Second row */}
      <div className="flex flex-row w-full border-b pt-2 pb-2">
        {/* Left - second row */}
        <div className="justify-start flex items-center">
          {/* Name of employee */}
          <p
            className="text-gray-600 font-semibold cursor-not-allowed p-1"
            title="bạn không có quyền chỉnh sửa"
          >
            Tùng-admin
          </p>

          {/* editButton */}
          <div
            className={`mx-3 p-1 flex items-center rounded-full w-6 h-6 ${(selectedOrder!=null)?"cursor-pointer bg-gray-200 hover:bg-gray-400":"cursor-not-allowed bg-gray-100"}`}
            title="thêm ghi chú"
            onClick={() => {
              if(selectedOrder!=null){
                setIsNoteOrderModalOpen(true)
              }
            }}
          >
            <EditOutlined />
          </div>

          {/* split order button */}
          <button
            className={`px-3 py-1 rounded-full flex items-center ${(selectedOrder!=null&&orderData?.hasUnconfirmProducts)
                ? "bg-white text-gray-700 cursor-pointer hover:bg-gray-200"
                : "text-gray-400 cursor-not-allowed"
              }`}
            onClick={() => setIsModalSplitOrderOpen(true)}
            disabled={!((selectedOrder!=null&&orderData?.hasUnconfirmProducts))}
          >
            <SplitCellsOutlined />
            <span className="pl-2">Tách Đơn/Ghép Đơn</span>
          </button>
        </div>

        <div className="flex-1"></div>
        {/* Right - second row */}
        <div className="justify-end flex flex-row">
          <div className="px-1 py-1">
            <span className="mr-2 font-semibold text-gray-700">Tổng số tiền:</span>
            <span className="mr-2 font-normal text-gray-700">{(orderData!==null&&selectedOrder!==null)?orderData.amountDue.toLocaleString():"0"}đ</span>
          </div>
          <div className=""></div>
        </div>
      </div>
      {/* Third row */}
      <div className="flex w-full pt-4 pb-2">
        <button
          className={`flex-1 flex w-full items-center gap-2 px-4 mr-2 py-8
          border rounded-2xl justify-center ${(selectedOrder!=null&&orderData?.hasUnconfirmProducts)
              ? "bg-white text-lg font-semibold text-yellow-600 border-[#FFE6BC] border-2 cursor-pointer hover:bg-[#FFE6BC] hover:text-black hover:font-semibold"
              : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={handleConfirm}
            disabled={!((selectedOrder!=null&&orderData?.hasUnconfirmProducts))}
        >
          <BellOutlined />
          <span className="">Thông báo (F10)</span>
        </button>
        <button
          className="flex-1 flex w-full items-center gap-2 px-4 ml-2 py-2
          rounded-2xl justify-center bg-[#FFE6BC] font-semibold text-lg
          hover:bg-[#f7daa8] text-[#4a4133]"
          onClick={showDrawerPayment}
        >
          <DollarOutlined />
          <span className="">Thanh toán (F9)</span>
        </button>
      </div>
      {/* Drawer Thanh toán */}
      <DrawerPaymentFinal
        isVisible={isDrawerPaymentVisible}
        onClose={onClosePaymentDrawer}
      />

      {/* Modal Note */}
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
          `
        }}
        onOk={async () => {
          if (!selectedOrder) {
            console.warn("Chưa chọn đơn hàng");
            return;
          }
          const success = await fetchAddNoteToOrder({
            orderId: selectedOrder,
            orderNote: note,
          });
          if (success) {
            console.log("Đã thêm ghi chú cho đơn hàng:", selectedOrder);
            setIsNoteOrderModalOpen(false);
          } else {
            console.error("Thêm ghi chú thất bại.");
          }
        }}
      >
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
        />
      </Modal>

      {/* Modal split */}
      <ModalSplitOrder
        open={isModalSplitOrderOpen}
        onCancel={() => setIsModalSplitOrderOpen(false)}
        onOk={(note) => {
          console.log("Tách đơn ghi chú:", note);
          setIsModalSplitOrderOpen(false);
        }}
        note={splitNote}
        setNote={setSplitNote}
      />
    </div>
  );
};

export default POSPayment;
