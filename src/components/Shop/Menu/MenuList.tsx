import React from "react";
import "../Styles/MenuList.css";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface MenuListProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

const MenuList: React.FC<MenuListProps> = ({ products, onProductClick }) => {
    return (
        <div className="menu-list-wrapper grid grid-cols-2 gap-4 px-3">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white p-2 rounded-lg shadow-md cursor-pointer"
                    onClick={() => onProductClick(product)} // Kích hoạt sự kiện click
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md"
                    />
                    <div className="mt-2 text-center">
                        <h3 className="text-sm font-semibold">{product.name}</h3>
                        <p className="text-xs text-gray-500">{product.price.toLocaleString()}đ</p>
                        <button className="mt-2 w-full py-1 text-xs font-semibold text-black bg-yellow-300 rounded-full">
                            Chọn
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuList;