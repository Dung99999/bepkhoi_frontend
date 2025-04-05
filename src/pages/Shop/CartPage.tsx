import React, { useState, useEffect } from "react";
import CartAction from "../../components/Shop/Cart/CartAction";
import CartList from "../../components/Shop/Cart/CartList";
import CartConfirm from "../../components/Shop/Cart/CartConfirm";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);

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
  const discount = 2000;
  const total = calculateTotal() - discount;

  return (
    <div>
      <div className="bg-white p-4 shadow-sm">
        <CartAction activeButton="Thông tin đơn hàng" />
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">Giỏ hàng của bạn đang trống</p>
      ) : (
        <CartList cart={cart} onQuantityChange={handleQuantityChange} />
      )}
      <div className="mt-6">
        <CartConfirm total={total} discount={discount} calculateTotal={calculateTotal} />
      </div>
    </div>
  );
};

export default CartPage;
