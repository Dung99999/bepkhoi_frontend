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
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart: Product[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: number, type: "increase" | "decrease") => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const updatedQuantity = type === "increase" ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 2000;
  const total = calculateTotal() - discount;

  return (
    <div>
      <CartAction />
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
