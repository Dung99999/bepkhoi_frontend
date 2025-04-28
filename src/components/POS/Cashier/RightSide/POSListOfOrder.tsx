import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Input, message } from "antd";
import { MinusOutlined, PlusOutlined, DeleteFilled } from "@ant-design/icons";
import useSignalR from "../../../../CustomHook/useSignalR";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedOrder: number | null;
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

const fetchOrderDetail = async (
  orderId: number | null,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderDetailModel[]> => {
  if (!orderId) return [];

  const apiUrl = `${API_BASE_URL}api/orders/get-order-details-by-order-id?orderId=${orderId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (response.ok) {
      const data: OrderDetailModel[] = await response.json();
      if (data.length === 0) {
        return [];
      }
      return data;
    } else {
      const errorData = await response.json();
      if (response.status === 400) {
        console.error("Bad Request:", errorData.message);
      } else if (response.status === 404) {
        console.error("Not Found: No order details found for the given orderId.");
      } else {
        console.error("Server Error:", errorData.message);
      }
      message.error(errorData.message || "Không thể lấy chi tiết đơn hàng.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    message.error("Lỗi kết nối khi lấy chi tiết đơn hàng.");
    return [];
  }
};

const updateOrderDetailQuantity = async (
  request: UpdateOrderDetailQuantityRequest,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderDetailModel | null> => {
  const apiUrl = `${API_BASE_URL}api/orders/update-order-detail-quantity`;

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
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      message.error(errorData.message || "Không thể cập nhật số lượng sản phẩm.");
      return null;
    }

    const result = await response.json();
    return result.data as OrderDetailModel;
  } catch (error) {
    console.error("Error updating order details:", error);
    message.error("Lỗi kết nối khi cập nhật số lượng sản phẩm.");
    return null;
  }
};

const addNoteToOrderDetail = async (
  request: AddNoteToOrderDetailRequest,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  const apiUrl = `${API_BASE_URL}api/order-detail/add-note-to-order-detail`;

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
    console.error("Error calling add-note-to-order-detail:", error);
    message.error("Lỗi kết nối khi thêm ghi chú.");
    return false;
  }
};

const fetchDeleteUnconfirmOrderDetail = async (
  orderId: number,
  orderDetailId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  if (!orderId || !orderDetailId || orderId <= 0 || orderDetailId <= 0) {
    message.error("Thông tin đơn hàng hoặc sản phẩm không hợp lệ.");
    return false;
  }

  const url = `${API_BASE_URL}api/orders/delete-order-detail?orderId=${orderId}&orderDetailId=${orderDetailId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    const result = await response.json();

    if (response.ok) {
      console.log(result.message || "Deleted successfully.");
      return true;
    }

    console.error(`[${response.status}] ${result.message}`);
    if (result.error) console.error(result.error);
    message.error(result.message || "Không thể xóa sản phẩm.");
    return false;
  } catch (error) {
    console.error("API call failed:", error);
    message.error("Lỗi kết nối khi xóa sản phẩm.");
    return false;
  }
};

const fetchDeleteConfirmOrderDetail = async (
  orderId: number,
  orderDetailId: number,
  cashierId: number,
  reason: string,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  if (!orderId || !orderDetailId || !cashierId || !reason.trim()) {
    message.error("Thông tin đơn hàng, sản phẩm, hoặc lý do hủy không hợp lệ.");
    return false;
  }

  const queryParams = new URLSearchParams({
    orderId: orderId.toString(),
    orderDetailId: orderDetailId.toString(),
    cashierId: cashierId.toString(),
    reason: reason.trim(),
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}api/orders/delete-confirmed-order-detail?${queryParams.toString()}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    const result = await response.json();

    if (response.ok) {
      return true;
    }

    message.error(result.message || "Không thể xóa sản phẩm đã xác nhận.");
    return false;
  } catch (error) {
    message.error("Lỗi kết nối khi xóa sản phẩm đã xác nhận.");
    return false;
  }
};

const POSListOfOrder: React.FC<Props> = ({ selectedOrder }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [selectedOrders, setSelectedOrders] = useState<OrderDetailModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderDetail, setCurrentOrderDetail] = useState<OrderDetailModel | null>(null);
  const [isModalDeleteOrderdetailOpen, setIsModalDeleteOrderdetailOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingOrderDetailId, setDeletingOrderDetailId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const orderDetails = await fetchOrderDetail(selectedOrder, authInfo.token, clearAuthInfo);
    setSelectedOrders(orderDetails);
  }, [authInfo?.token, clearAuthInfo, selectedOrder]);

  useSignalR(
    {
      eventName: "OrderUpdate",
      groupName: "order",
      callback: (updatedOrderId: number) => {
        if (updatedOrderId === selectedOrder) {
          fetchData();
        }
      },
    },
    [selectedOrder, fetchData]
  );

  const debounceCustomerUpdateOrder = useCallback(() => {
    let timeout: NodeJS.Timeout;
    return (updatedOrderId: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (updatedOrderId === selectedOrder) {
          fetchData();
        }
      }, 500);
    };
  }, [selectedOrder, fetchData]);

  useSignalR(
    {
      eventName: "CustomerUpdateOrder",
      groupName: "order",
      callback: debounceCustomerUpdateOrder(),
    },
    [debounceCustomerUpdateOrder]
  );

  const handleUpdateOrderDetailAddMinus = useCallback(
    async (isAdd: boolean, orderDetailId: number) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      if (selectedOrder === null) {
        message.warning("Vui lòng chọn đơn hàng trước khi cập nhật.");
        return;
      }

      const request: UpdateOrderDetailQuantityRequest = {
        orderId: selectedOrder,
        orderDetailId: orderDetailId,
        isAdd: isAdd,
        quantity: null,
      };

      const updatedOrderDetail = await updateOrderDetailQuantity(
        request,
        authInfo.token,
        clearAuthInfo
      );

      if (updatedOrderDetail) {
        fetchData();
        message.success("Cập nhật số lượng thành công.");
      } else {
        message.error("Cập nhật số lượng thất bại.");
      }
    },
    [authInfo?.token, clearAuthInfo, selectedOrder, fetchData]
  );

  const openNoteModal = useCallback((orderDetail: OrderDetailModel) => {
    setCurrentOrderDetail({ ...orderDetail });
    setIsModalOpen(true);
  }, []);

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentOrderDetail) {
      setCurrentOrderDetail({ ...currentOrderDetail, productNote: e.target.value });
    }
  }, [currentOrderDetail]);

  const saveNote = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (currentOrderDetail && selectedOrder !== null) {
      const request: AddNoteToOrderDetailRequest = {
        orderId: selectedOrder,
        orderDetailId: currentOrderDetail.orderDetailId,
        note: currentOrderDetail.productNote || "",
      };

      const success = await addNoteToOrderDetail(request, authInfo.token, clearAuthInfo);
      if (success) {
        fetchData();
        message.success("Thêm ghi chú thành công.");
      } else {
        message.error("Thêm ghi chú thất bại.");
      }
    }
    setIsModalOpen(false);
    setCurrentOrderDetail(null);
  }, [authInfo?.token, clearAuthInfo, currentOrderDetail, selectedOrder, fetchData]);

  const deleteOrderDetail = useCallback(
    async (isConfirmed: boolean, orderDetailId: number | null) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      if (!selectedOrder || !orderDetailId) {
        message.warning("Chưa chọn hóa đơn hoặc sản phẩm để xóa.");
        setDeletingOrderDetailId(null);
        return;
      }
  
      let success = false;
      if (isConfirmed) {
        if (!authInfo.userId || isNaN(parseInt(authInfo.userId))) {
          message.error("Không tìm thấy thông tin người dùng hợp lệ. Vui lòng đăng nhập lại.");
          return;
        }
        success = await fetchDeleteConfirmOrderDetail(
          selectedOrder,
          orderDetailId,
          parseInt(authInfo.userId), // Chuyển string thành number
          deleteReason.trim(),
          authInfo.token,
          clearAuthInfo
        );
      } else {
        success = await fetchDeleteUnconfirmOrderDetail(
          selectedOrder,
          orderDetailId,
          authInfo.token,
          clearAuthInfo
        );
      }
  
      if (success) {
        fetchData();
        setIsModalDeleteOrderdetailOpen(false);
        message.success("Xóa sản phẩm thành công.");
        setDeletingOrderDetailId(null);
      } else {
        message.error("Xóa sản phẩm thất bại.");
      }
    },
    [
      authInfo?.token,
      authInfo?.userId,
      clearAuthInfo,
      selectedOrder,
      deleteReason,
      fetchData,
    ]
  );

  const handleClickDeleteOrderDetail = useCallback(
    (orderDetail: OrderDetailModel) => {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        content: orderDetail.productName,
        okText: "Xóa",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        onOk: () => {
          if (orderDetail.status) {
            setDeletingOrderDetailId(orderDetail.orderDetailId);
            setDeleteReason("");
            setIsModalDeleteOrderdetailOpen(true);
          } else {
            deleteOrderDetail(false, orderDetail.orderDetailId);
          }
        },
      });
    },
    [deleteOrderDetail]
  );

  useEffect(() => {
    if (selectedOrder !== null) {
      fetchData();
    } else {
      setSelectedOrders([]);
    }
  }, [selectedOrder, fetchData]);

  return (
    <div className="p-3 rounded-md">
      <div className="max-h-[40vh] overflow-y-auto">
        <ul className="space-y-2">
          {selectedOrders.map((item, index) => (
            <li key={item.orderDetailId} className="bg-white p-2 rounded-md shadow">
              <div className="flex justify-between items-center">
                <span
                  className={`font-semibold w-1/3 ${item.status ? "text-green-500" : ""}`}
                >
                  {index + 1}. {item.productName}
                </span>
                <div className="flex items-center space-x-2 w-1/3 justify-center">
                  <div className="border-2" style={{ borderRadius: "15px" }}>
                    <Button
                      type="text"
                      icon={<MinusOutlined />}
                      disabled={item.status === true}
                      onClick={() => handleUpdateOrderDetailAddMinus(false, item.orderDetailId)}
                    />
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      disabled={item.status === true}
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
                <DeleteFilled
                  className="ml-3 text-lg text-red-500"
                  onClick={() => handleClickDeleteOrderDetail(item)}
                />
              </div>
              <div
                className={`text-sm mt-1 ${
                  item.status ? "text-gray-300 cursor-not-allowed" : "text-gray-500 cursor-pointer"
                }`}
                onClick={() => {
                  if (!item.status) openNoteModal(item);
                }}
              >
                {item.productNote ? item.productNote : "Ghi chú/món thêm"}
              </div>
            </li>
          ))}
        </ul>
      </div>

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
          `,
        }}
      >
        <Input
          placeholder="Nhập ghi chú"
          value={currentOrderDetail?.productNote || ""}
          onChange={handleNoteChange}
        />
      </Modal>

      <Modal
        title="Hủy món đã xác nhận"
        open={isModalDeleteOrderdetailOpen}
        onOk={async () => {
          if (deleteReason.trim()) {
            if (deletingOrderDetailId === null) {
              message.error("Không tìm thấy sản phẩm để hủy.");
              return;
            }
            await deleteOrderDetail(true, deletingOrderDetailId);
          } else {
            message.warning("Lý do hủy món không được bỏ trống.");
          }
        }}
        onCancel={() => {
          setDeletingOrderDetailId(null);
          setIsModalDeleteOrderdetailOpen(false);
        }}
        okButtonProps={{
          className: `text-white bg-red-500 hover:bg-red-600`,
        }}
      >
        <Input.TextArea
          placeholder="Nhập lý do hủy món"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default POSListOfOrder;