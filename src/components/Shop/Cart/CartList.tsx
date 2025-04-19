import React from "react";
import { Button } from "antd";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  productNote?: string;
}

interface CartListProps {
  cart: Product[];
  onQuantityChange: (id: number, type: "increase" | "decrease") => void;
}

const CartList: React.FC<CartListProps> = ({ cart, onQuantityChange }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md max-h-80 overflow-y-auto">
      {cart.map((product) => (
        <div key={product.id} className="border-b pb-4 mb-4 last:border-none last:mb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
              <div className="ml-4">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-gray-500">•{product.description}</p>
                {product.productNote && (
                  <p className="text-xs text-gray-600 mt-1 italic">
                    <span className="font-medium">Ghi chú:</span> {product.productNote}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">{product.price.toLocaleString()}đ</p>
              <div className="flex items-center space-x-2 mt-2">
                <Button onClick={() => onQuantityChange(product.id, "decrease")} className="px-2 bg-gray-200 text-black rounded-md">-</Button>
                <span className="font-medium">{product.quantity}</span>
                <Button onClick={() => onQuantityChange(product.id, "increase")} className="px-2 bg-gray-200 text-black rounded-md">+</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
