import React, { useContext } from "react";
import "../Styles/MenuList.css";
import { ModelModeContext } from "../../../context/ModelModeContext";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    salePrice?: number;
    sellPrice: number;
}

interface MenuListProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

const MenuList: React.FC<MenuListProps> = ({ products, onProductClick }) => {
    const modelMode = useContext(ModelModeContext);
    return (
        <>
            {modelMode === "1" ? (
                <div className="menu-list-wrapper grid grid-cols-2 gap-4 px-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-2 rounded-lg shadow-md cursor-pointer"
                            onClick={() => onProductClick(product)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <div className="mt-2 text-center">
                                <h3 className="text-sm font-semibold">{product.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {product.salePrice && product.salePrice > 0 ? (
                                        <span>
                                            <span className="line-through mr-1 text-red-500">
                                                {product.sellPrice.toLocaleString()}đ
                                            </span>
                                            <span className="mx-1">➜</span>
                                            <span className="text-green-600 font-semibold">
                                                {product.salePrice.toLocaleString()}đ
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{product.price.toLocaleString()}đ</span>
                                    )}
                                </p>
                                <button className="mt-2 w-full py-1 text-xs font-semibold text-black bg-yellow-300 rounded-full">
                                    Chọn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="menu-list-wrapper grid grid-cols-4 gap-4 px-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-2 rounded-lg shadow-md cursor-pointer"
                            onClick={() => onProductClick(product)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <div className="mt-2 text-center">
                                <h3 className="text-sm font-semibold">{product.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {product.salePrice && product.salePrice > 0 ? (
                                        <span>
                                            <span className="line-through mr-1 text-red-500">
                                                {product.sellPrice.toLocaleString()}đ
                                            </span>
                                            <span className="mx-1">➜</span>
                                            <span className="text-green-600 font-semibold">
                                                {product.salePrice.toLocaleString()}đ
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{product.price.toLocaleString()}đ</span>
                                    )}
                                </p>
                                <button className="mt-2 w-full py-1 text-xs font-semibold text-black bg-yellow-300 rounded-full">
                                    Chọn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MenuList;
