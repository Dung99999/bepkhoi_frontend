import React, { useState, useContext, useEffect } from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { ModelModeContext } from "../../../context/ModelModeContext";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    unit?: string;
    status?: string;
}

interface ProductModalProps {
    visible: boolean;
    product: Product | null;
    onClose: () => void;
    unitTitle: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ visible, product, onClose, unitTitle }) => {
    const [quantity, setQuantity] = useState(1);
    const [productNote, setProductNote] = useState("");
    const modelMode = useContext(ModelModeContext);

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const addToCart = () => {
        const selectedOrderId = sessionStorage.getItem('selectedOrderId');
        if (!selectedOrderId || selectedOrderId === 'null') {
            Modal.error({
                title: 'Bạn chưa có phiếu đặt hàng trong hệ thống!',
                content: 'Vui lòng liên hệ nhân viên quầy để tạo phiếu đặt hàng mới',
                okText: 'Đã hiểu'
            });
            return;
        }
        if (!product) return;
        const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        const existingIndex = cart.findIndex(
            (item: any) => item.id === product.id && item.orderId === parseInt(selectedOrderId)
        );
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += quantity;
            cart[existingIndex].productNote = productNote;
        } else {
            cart.push({
                ...product,
                quantity,
                orderId: parseInt(selectedOrderId),
                productNote
            });
        }

        sessionStorage.setItem("cart", JSON.stringify(cart));
        setQuantity(1);
        setProductNote("");
        animateToCart();
        setTimeout(onClose, 500);
    };

    const animateToCart = () => {
        const productImage = document.getElementById("product-image");
        const cartIcon = document.getElementById("cart-icon");
        if (!productImage || !cartIcon) return;

        const imgClone = productImage.cloneNode(true) as HTMLElement;
        const rectStart = productImage.getBoundingClientRect();
        const rectEnd = cartIcon.getBoundingClientRect();

        imgClone.style.position = "fixed";
        imgClone.style.left = `${rectStart.left}px`;
        imgClone.style.top = `${rectStart.top}px`;
        imgClone.style.width = `${rectStart.width}px`;
        imgClone.style.height = `${rectStart.height}px`;
        imgClone.style.transition = "all 0.5s ease-in-out";
        imgClone.style.zIndex = "1000";
        imgClone.style.borderRadius = "50%";
        imgClone.style.opacity = "1";

        document.body.appendChild(imgClone);

        setTimeout(() => {
            imgClone.style.left = `${rectEnd.left + rectEnd.width / 2}px`;
            imgClone.style.top = `${rectEnd.top + rectEnd.height / 2}px`;
            imgClone.style.width = "20px";
            imgClone.style.height = "20px";
            imgClone.style.opacity = "0";
        }, 50);

        setTimeout(() => {
            document.body.removeChild(imgClone);
            window.dispatchEvent(new Event("storage"));
        }, 550);
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
            width={modelMode === "1" ? "100vw" : "70vw"}
            style={{
                height: modelMode === "1" ? "85vh" : "70vh",
                top: 0,
                padding: 0,
            }}
            styles={{
                body: {
                    padding: 0,
                    margin: 0,
                    height: modelMode === "1" ? "85vh" : "50vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }
            }}
        >
            {product && (
                modelMode === "1" ? (
                    <div className="w-full h-full flex flex-col bg-white">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <button onClick={onClose} className="text-xl">
                                <CloseOutlined />
                            </button>
                        </div>

                        <div className="w-full h-1/3 bg-gray-200">
                            <img
                                id="product-image"
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{product.name}</h2>
                                <p className="text-lg text-gray-700 mt-2">{product.description}</p>
                                <p className="text-lg font-semibold">Giá: {product.price.toLocaleString()}đ</p>

                                <div className="flex items-center mt-4 space-x-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-600">Đơn vị tính</p>
                                        <div className="px-3 py-1 mt-1 rounded-md bg-gray-100 text-black text-sm font-medium w-fit">
                                            {unitTitle}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-600">Tình trạng</p>
                                        <div className="flex items-center px-3 py-1 mt-1 rounded-md bg-gray-100 text-green-700 text-sm font-medium w-fit">
                                            <CheckCircleOutlined className="mr-1 text-sm" />
                                            {product.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <input
                                    type="text"
                                    value={productNote}
                                    onChange={(e) => setProductNote(e.target.value)}
                                    placeholder="Thêm ghi chú cho món này..."
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center pb-6 pt-2">
                                <div className="flex items-center space-x-8 mb-4">
                                    <Button type="default" className="rounded-md px-4 py-2" onClick={decreaseQuantity}>
                                        -
                                    </Button>
                                    <span className="text-xl font-bold">{quantity}</span>
                                    <Button type="default" className="rounded-md px-4 py-2" onClick={increaseQuantity}>
                                        +
                                    </Button>
                                </div>

                                <Button
                                    type="primary"
                                    className="w-full max-w-xs bg-yellow-500 text-black rounded-md py-3"
                                    style={{ fontSize: "18px", fontWeight: "bold" }}
                                    onClick={addToCart}
                                >
                                    Chọn mua
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="new-modal-layout">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <button onClick={onClose} className="text-xl">
                                <CloseOutlined />
                            </button>
                        </div>

                        <div className="flex w-full h-5/6">
                            <div className="w-1/2 bg-gray-200">
                                <img
                                    id="product-image"
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-1/2 p-4 flex flex-col justify-between">
                                <h2 className="text-2xl font-bold">{product.name}</h2>
                                <p className="text-lg text-gray-700 mt-2">{product.description}</p>
                                <p className="text-lg font-semibold">Giá: {product.price.toLocaleString()}đ</p>

                                <div className="flex items-center mt-4 space-x-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-600">Đơn vị tính</p>
                                        <div className="px-3 py-1 mt-1 rounded-md bg-gray-100 text-black text-sm font-medium w-fit">
                                            {unitTitle}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-gray-600">Tình trạng</p>
                                        <div className="flex items-center px-3 py-1 mt-1 rounded-md bg-gray-100 text-green-700 text-sm font-medium w-fit">
                                            <CheckCircleOutlined className="mr-1 text-sm" />
                                            {product.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                    <input
                                        type="text"
                                        value={productNote}
                                        onChange={(e) => setProductNote(e.target.value)}
                                        placeholder="Thêm ghi chú cho món này..."
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>
                                <div className="w-full flex flex-col items-center pb-6 pt-4">
                                    <div className="flex items-center space-x-8 mb-4">
                                        <Button type="default" className="rounded-md px-4 py-2" onClick={decreaseQuantity}>
                                            -
                                        </Button>
                                        <span className="text-xl font-bold">{quantity}</span>
                                        <Button type="default" className="rounded-md px-4 py-2" onClick={increaseQuantity}>
                                            +
                                        </Button>
                                    </div>

                                    <Button
                                        type="primary"
                                        className="w-full max-w-xs bg-yellow-500 text-black rounded-md py-3"
                                        style={{ fontSize: "18px", fontWeight: "bold" }}
                                        onClick={addToCart}
                                    >
                                        Chọn mua
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </Modal>
    );
};

export default ProductModal;
