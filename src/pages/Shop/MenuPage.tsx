import React, { useState } from "react";
import MenuList from "../../components/Shop/Menu/MenuList";
import MenuTop from "../../components/Shop/Menu/MenuTop";
import ProductModal from "../../components/Shop/Menu/ProductModal";
import { Drawer } from "antd";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    unit?: string;
    status?: string;
}

// Dữ liệu giả
const fakeData: Product[] = [
    { id: 1, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 2, name: "Gà", price: 10000, image: "https://image.plo.vn/w1000/Uploaded/2025/tmuihk/2024_04_19/tac-hai-cua-do-an-vat-toi-suc-khoe-tre-em-7845.png" },
    { id: 3, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 4, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 5, name: "Trà chanh", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 6, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 7, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 8, name: "Trà chanh", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
    { id: 9, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg" },
];

const MenuPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(fakeData);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSearch = (value: string) => {
        const filtered = fakeData.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const showModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    return (
        <div>
            <MenuTop
                search={search}
                setSearch={(value) => {
                    setSearch(value);
                    handleSearch(value);
                }}
                toggleDrawer={toggleDrawer}
            />

            <h1 className="text-lg font-bold">Đồ uống</h1>

            <MenuList products={filteredProducts}
                onProductClick={showModal}
            />

            <Drawer
                title="Bộ lọc danh mục"
                placement="right"
                onClose={toggleDrawer}
                open={drawerVisible}
            >
                <ul>
                    <li className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">Tất cả</li>
                    <li className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">Đồ uống</li>
                    <li className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">Thức ăn</li>
                    <li className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">Khác</li>
                </ul>
            </Drawer>
            <ProductModal
                visible={isModalVisible}
                product={selectedProduct}
                onClose={closeModal}
            />

        </div>
    );
};

export default MenuPage;