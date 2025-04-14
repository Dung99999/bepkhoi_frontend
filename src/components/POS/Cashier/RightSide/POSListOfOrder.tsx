import React, { useState, useEffect } from "react";
import { Button, Modal, Input, message } from "antd";
import { MinusOutlined, PlusOutlined, DeleteFilled } from "@ant-design/icons";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface props {
  selectedOrder: number | null
  isReloadAfterAddProduct: boolean;
  setIsReloadAfterAddProduct: (isReload: boolean) => void;
  isReloadAfterUpdateQuantity: boolean;
  setIsReloadAfterUpdateQuantity: (isReload: boolean) => void;
  isReloadAfterConfirm: boolean;
  setIsReloadAfterConfirm: (isReload: boolean) => void;
}
interface OrderDetailModel {
  orderDetailId: number;
  orderId: number;
  status: boolean | null;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string | null;
}
interface UpdateOrderDetailQuantityRequest {
  orderId: number;
  orderDetailId: number;
  isAdd: boolean | null;
  quantity: number | null;
}

interface AddNoteToOrderDetailRequest {
  orderId: number;
  orderDetailId: number;
  note: string;
}

async function fetchOrderDetail(orderId: number | null): Promise<OrderDetailModel[]> {
  const apiUrl = `${API_BASE_URL}api/orders/get-order-details-by-order-id?orderId=${orderId}`; // URL endpoint cho API

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Kiểm tra nếu mã trạng thái HTTP là 2xx (thành công)
    if (response.ok) {
      const data: OrderDetailModel[] = await response.json();
      if (data.length === 0) {
        // Trường hợp không có dữ liệu
        console.warn('No order details found for the given orderId.');
        return [];
      }
      return data;
    } else if (response.status === 400) {
      // Nếu có lỗi về tham số (400 Bad Request)
      const errorData = await response.json();
      console.error('Bad Request:', errorData.message);
      return [];
    } else if (response.status === 404) {
      // Nếu không tìm thấy đơn hàng (404 Not Found)
      console.error('Not Found: No order details found for the given orderId.');
      return [];
    } else {
      // Xử lý lỗi server (500 Internal Server Error)
      const errorData = await response.json();
      console.error('Server Error:', errorData.message);
      return [];
    }
  } catch (error) {
    // Xử lý lỗi không mong muốn (ví dụ lỗi mạng)
    console.error('Error fetching order details:', error);
    return [];
  }
}

async function updateOrderDetailQuantity(request: UpdateOrderDetailQuantityRequest): Promise<OrderDetailModel | null> {
  const apiUrl = `${API_BASE_URL}api/orders/update-order-detail-quantity`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
      return null;
    }

    const result = await response.json();
    return result.data as OrderDetailModel;
  } catch (error) {
    console.error('Error update order details:', error);
    return null;
  }
}

async function addNoteToOrderDetail(request: AddNoteToOrderDetailRequest): Promise<boolean> {
  const apiUrl = `${API_BASE_URL}api/order-detail/add-note-to-order-detail`;
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
      console.log(data.message); // Optional: log success
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
    console.error('Error calling add-note-to-order-detail:', error);
    return false;
  }
}

async function fetchDeleteUnconfirmOrderDetail(orderId: number, orderDetailId: number): Promise<boolean> {
  if (!orderId || !orderDetailId || orderId <= 0 || orderDetailId <= 0) {
    console.error("Invalid parameters: orderId and orderDetailId must be positive integers.");
    return false;
  }
  const url = `${API_BASE_URL}api/orders/delete-order-detail?orderId=${orderId}&orderDetailId=${orderDetailId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    const result = await response.json();

    if (response.ok) {
      console.log(result.message || "Deleted successfully.");
      return true;
    }
    console.error(`[${response.status}] ${result.message}`);
    if (result.error) console.error(result.error);
    return false;
  } catch (error) {
    console.error("API call failed:", error);
    return false;
  }
}

async function fetchDeleteConfirmOrderDetail(
  orderId: number,
  orderDetailId: number,
  cashierId: number,
  reason: string
): Promise<boolean> {
  // Validate input
  if (!orderId || !orderDetailId || !cashierId || !reason.trim()) {
    console.error("Invalid parameters: All fields must be provided and valid.");
    return false;
  }
  const queryParams = new URLSearchParams({
    orderId: orderId.toString(),
    orderDetailId: orderDetailId.toString(),
    cashierId: cashierId.toString(),
    reason: reason.trim(),
  });
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/delete-confirmed-order-detail?${queryParams.toString()}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      console.log(result.message || "Deleted confirmed order detail successfully.");
      return true;
    } else {
      console.error(`[${response.status}] ${result.message || "Unknown error occurred."}`);
      return false;
    }
  } catch (error: any) {
    console.error("Network or server error while deleting confirmed order detail:", error);
    return false;
  }
}


const POSListOfOrder: React.FC<props> = ({ selectedOrder, isReloadAfterAddProduct, setIsReloadAfterAddProduct , isReloadAfterUpdateQuantity , setIsReloadAfterUpdateQuantity , isReloadAfterConfirm , setIsReloadAfterConfirm }) => {
  const [selectedOrders, setSelectedOrders] = useState<OrderDetailModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderDetail, setCurrentOrderDetail] = useState<OrderDetailModel | null>(null);
  const [isModalDeleteOrderdetailOpen, setIsModalDeleteOrderdetailOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingOrderDetailId, setDeletingOrderDetailId] = useState<number | null>(null);

  const fetchData = async () => {
    const orderDetails = await fetchOrderDetail(selectedOrder);
    setSelectedOrders(orderDetails);
  };

  const handleUpdateOrderDetailAddMinus = async (isAdd: boolean, orderDetailId: number) => {
    if (selectedOrder !== null) {
      const request: UpdateOrderDetailQuantityRequest = {
        orderId: selectedOrder,
        orderDetailId: orderDetailId,
        isAdd: isAdd,
        quantity: null,
      };
      const updatedOrderDetail = await updateOrderDetailQuantity(request);
      if (updatedOrderDetail) {
        fetchData();
        setIsReloadAfterUpdateQuantity(true);
      } else {
        console.error('Failed to update order detail');
      }
    }
  };

  useEffect(() => {
    if (selectedOrder !== null) {
      fetchData();
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder !== null && isReloadAfterAddProduct == true) {
      fetchData();
      setIsReloadAfterAddProduct(false);
    }
  }, [isReloadAfterAddProduct]);

  useEffect(() => {
    if (selectedOrder !== null && isReloadAfterConfirm == true) {
      fetchData();
      setIsReloadAfterConfirm(false);
    }
  }, [isReloadAfterConfirm]);
  const openNoteModal = (orderDetail: OrderDetailModel) => {
    setCurrentOrderDetail({...orderDetail});
    setIsModalOpen(true);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentOrderDetail) {
      setCurrentOrderDetail({ ...currentOrderDetail, productNote: e.target.value });
    }
  };

  const saveNote = async () => {
    if (currentOrderDetail && selectedOrder !== null) {
      const request: AddNoteToOrderDetailRequest = {
        orderId: selectedOrder,
        orderDetailId: currentOrderDetail.orderDetailId,
        note: currentOrderDetail.productNote || "",
      };
  
      const success = await addNoteToOrderDetail(request);
      if (success) {
        fetchData();
      }
    }
    setIsModalOpen(false);
  };

  const deleteOrderDetail = async (isConfirmed: boolean, orderDetailId:number|null) => {
    if (!selectedOrder || !orderDetailId){
      console.log(`xóa: OrderId = ${selectedOrder}, OrderDetailId = ${deletingOrderDetailId}`)
      message.warning("Chưa chọn hóa đơn hoặc sản phẩm để xóa");
      setDeletingOrderDetailId(null);
      return;
    }
    if (isConfirmed) {
      const success = await fetchDeleteConfirmOrderDetail(
        selectedOrder,
        orderDetailId,
        2, 
        deleteReason.trim()
      );
      if (success) {
        fetchData();
        setIsModalDeleteOrderdetailOpen(false);
        message.success("Xóa món thành công");
        setDeletingOrderDetailId(null);
        setIsReloadAfterUpdateQuantity(true);
      }
    } else {
      const success = await fetchDeleteUnconfirmOrderDetail(
        selectedOrder,
        orderDetailId
      );
      if (success) {
        fetchData();
        message.success("Xóa món thành công");
        setDeletingOrderDetailId(null);
        setIsReloadAfterUpdateQuantity(true);
      }
    }
  };
  const handleClickDeleteOrderDetail = (orderDetail: OrderDetailModel) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sản phẩm này?",
      content: orderDetail.productName,
      okText: "Xoá",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
      onOk: () => {
        if (orderDetail.status) {
          // Lưu lại id để dùng sau trong Modal
          setDeletingOrderDetailId(orderDetail.orderDetailId);
          setDeleteReason("");
          setIsModalDeleteOrderdetailOpen(true);
        } else {
          // Gọi xoá trực tiếp nếu chưa xác nhận
          deleteOrderDetail(false, orderDetail.orderDetailId);
        }
      },
    });
  };

  return (
    <div className="p-3 rounded-md">
      <div className="max-h-[40vh] overflow-y-auto">
        <ul className="space-y-2">
          {selectedOrders.map((item, index) => (
            <li key={item.orderDetailId} className="bg-white p-2 rounded-md shadow">
              <div className="flex justify-between items-center">
                <span className={`font-semibold w-1/3 ${item.status?"text-green-500":""}`}>
                  {index + 1}. {item.productName}
                </span>
                <div className="flex items-center space-x-2 w-1/3 justify-center">
                  <div className="border-2" style={{ borderRadius: "15px" }}>
                    <Button
                      type="text"
                      icon={<MinusOutlined />}
                      disabled={item.status==true}
                      onClick={() => handleUpdateOrderDetailAddMinus(false, item.orderDetailId)}
                    />
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      disabled={item.status==true}
                      onClick={() => handleUpdateOrderDetailAddMinus(true, item.orderDetailId)}
                    />
                  </div>
                </div>
                <div className="text-right w-1/3">
                  <span style={{ marginRight: "30px", fontSize: "1rem" }}>
                    {item.price.toLocaleString()}đ
                  </span>
                  <span className="font-semibold" style={{ fontSize: "1.1rem" }}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
                <DeleteFilled className="ml-3 text-lg text-red-500"
                  onClick={() => handleClickDeleteOrderDetail(item)}
                />
              </div>
              <div
                className={`text-sm mt-1 ${item.status ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer'}`}
                onClick={() => {
                  if (!item.status) openNoteModal(item);
                }}
              >
                {item.productNote ?
                 `${item.productNote}` : "Ghi chú/ món thêm"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal nhập ghi chú */}
      <Modal
        title="Ghi chú"
        open={isModalOpen}
        onOk={saveNote}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentOrderDetail(null);
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
        <Input
          placeholder="Nhập ghi chú"
          value={currentOrderDetail?.productNote || ""}
          onChange={handleNoteChange}
        />
      </Modal>
      <Modal
        title="Huỷ món đã xác nhận"
        open={isModalDeleteOrderdetailOpen}
        onOk={async () => {
          if(deleteReason.trim()!=null && deleteReason.trim()!=""){
            if (deletingOrderDetailId === null) {
              // Đợi 2 giây và kiểm tra lại
              await new Promise((resolve) => setTimeout(resolve, 2000));
              if (deletingOrderDetailId === null) {
                message.error("Không tìm thấy sản phẩm để huỷy.");
                return;
              }
            }
            deleteOrderDetail(true, deletingOrderDetailId)
          }else{
            message.warning("Lý do hủy món không được bỏ trống")
          }
        }
        }
        onCancel={() =>{
          setDeletingOrderDetailId(null)
          setIsModalDeleteOrderdetailOpen(false)
        }}
        okButtonProps={{
          className: `text-white bg-red-500 hover:bg-red-600`
        }}
      >
        <Input.TextArea
          placeholder="Nhập lý do huỷ món"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
        />
      </Modal>      
    </div>
  );
};

export default POSListOfOrder;
