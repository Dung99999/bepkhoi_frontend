import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface props {
  selectedOrder: number | null
  isReloadAfterAddProduct: boolean;
  setIsReloadAfterAddProduct: (isReload: boolean) => void;  
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

async function fetchOrderDetail(orderId: number|null): Promise<OrderDetailModel[]> {
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

const POSListOfOrder: React.FC<props> = ({ selectedOrder, isReloadAfterAddProduct, setIsReloadAfterAddProduct }) => {
  const [selectedOrders, setSelectedOrders] = useState<OrderDetailModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetailModel | null>(null);

  const updateQuantity = (id: number, amount: number) => {
    setSelectedOrders((prevOrders) =>
      prevOrders.map((item) =>
        item.orderDetailId === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const fetchData = async () => {
    const orderDetails = await fetchOrderDetail(selectedOrder);
    setSelectedOrders(orderDetails); 
  };

  const fetchDataAfterAddProduct = async () => {
    const orderDetails = await fetchOrderDetail(selectedOrder);
    setSelectedOrders(orderDetails); 
    setIsReloadAfterAddProduct(false);
  };

  useEffect(() => {
    if (selectedOrder !== null) {
      fetchData();
    }
  }, [selectedOrder]); 

  useEffect(() => {
    if (selectedOrder !== null && isReloadAfterAddProduct == true) {
      fetchDataAfterAddProduct();
    }
  }, [isReloadAfterAddProduct]); 

  const openNoteModal = (order: OrderDetailModel) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, productNote: e.target.value });
    }
  };

  const saveNote = () => {
    if (currentOrder) {
      setSelectedOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.orderDetailId === currentOrder.orderId
            ? { ...item, note: currentOrder.productNote }
            : item
        )
      );
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-3 rounded-md">
      <div className="max-h-[40vh] overflow-y-auto">
        <ul className="space-y-2">
          {selectedOrders.map((item, index) => (
            <li key={item.orderDetailId} className="bg-white p-2 rounded-md shadow">
              <div className="flex justify-between items-center">
                <span className="font-semibold w-1/3">
                  {index + 1}. {item.productName}
                </span>
                <div className="flex items-center space-x-2 w-1/3 justify-center">
                  <div className="border-2" style={{ borderRadius: "15px" }}>
                    <Button
                      type="text"
                      icon={<MinusOutlined />}
                      onClick={() => updateQuantity(item.orderDetailId, -1)}
                    />
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => updateQuantity(item.orderDetailId, 1)}
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
              </div>
              <div
                className="text-sm text-gray-500 mt-1 cursor-pointer"
                onClick={() => openNoteModal(item)}
              >
                {item.productNote ? `Ghi chú: ${item.productNote}` : "Ghi chú/ món thêm"}
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
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Nhập ghi chú"
          value={currentOrder?.productNote || ""}
          onChange={handleNoteChange}
        />
      </Modal>
    </div>
  );
};

export default POSListOfOrder;
