import React, { useState, useEffect } from "react";
import CartAction from "../../components/Shop/Cart/CartAction";
import CartList from "../../components/Shop/Cart/CartList";
import CartConfirm from "../../components/Shop/Cart/CartConfirm";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: number, type: "increase" | "decrease") => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const updatedQuantity = type === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0;
  const total = calculateTotal() - discount;

  const handleCreateOrder = async () => {
    try {
      if (cart.length === 0) {
        messageApi.warning("Giỏ hàng trống! Hãy thêm đồ vào giỏ hàng trước");
        return;
      }

      const customerInfo = JSON.parse(sessionStorage.getItem("customerInfo") || "{}");
      const roomId = sessionStorage.getItem("roomId");

      const orderDetails = cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity,
        productNote: "",
        status: true
      }));

      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      const amountDue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderPayload = {
        customerId: customerInfo.customerId || 0,
        orderTypeId: 3,
        roomId: roomId ? parseInt(roomId) : 0,
        totalQuantity: totalQuantity,
        amountDue: amountDue,
        orderStatusId: 1,
        orderNote: "",
        orderDetails: orderDetails
      };

      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/create-order-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      console.log('Order created:', result);

      messageApi.success('Đơn hàng đã được tạo thành công!');

      setTimeout(() => {
        sessionStorage.removeItem("cart");
        navigate("/shop/status", {
          state: {
            totalAmount: total,
            orderId: result.orderId
          }
        });
      }, 1000);

    } catch (error) {
      console.error('Error creating order:', error);
      messageApi.error('Có lỗi xảy ra khi tạo đơn hàng!');
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="bg-white p-4 shadow-sm">
        <CartAction activeButton="Thông tin đơn hàng" />
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Giỏ hàng của bạn đang trống</p>
      ) : (
        <CartList cart={cart} onQuantityChange={handleQuantityChange} />
      )}
      <div className="mt-6">
        <CartConfirm
          total={total}
          discount={discount}
          calculateTotal={calculateTotal}
          onCreateOrder={handleCreateOrder}
        />
      </div>
    </div>
  );
};

export default CartPage;