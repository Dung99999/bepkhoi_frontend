import React, { useEffect, useState } from "react";
import MenuList from "../../components/Shop/Menu/MenuList";
import MenuTop from "../../components/Shop/Menu/MenuTop";
import ProductModal from "../../components/Shop/Menu/ProductModal";
import { Drawer } from "antd";
import axios from "axios";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    unit?: string;
    status?: string;
}

interface Category {
    productCategoryId: number;
    productCategoryTitle: string;
}

// Dữ liệu giả
const fakeData: Product[] = [
    { id: 1, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 2, name: "Gà", price: 10000, image: "https://image.plo.vn/w1000/Uploaded/2025/tmuihk/2024_04_19/tac-hai-cua-do-an-vat-toi-suc-khoe-tre-em-7845.png", description: "Trà đào nguyên chất 500ml" },
    { id: 3, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 4, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 5, name: "Trà chanh", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 6, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 7, name: "Trà đào", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 8, name: "Trà chanh", price: 10000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
    { id: 9, name: "Trà hoa cúc", price: 15000, image: "https://images.immediate.co.uk/production/volatile/sites/30/2021/11/Summer-cup-mocktail-5c22b8e.jpg", description: "Trà đào nguyên chất 500ml" },
];

const MenuPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(fakeData);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_APP_ENDPOINT}api/product-categories/get-all-categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };

    const handleSearch = (value: string) => {
        const filtered = fakeData.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleCategorySelect = (categoryTitle: string) => {
        setSelectedCategory(categoryTitle);
        setDrawerVisible(false);
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

    useEffect(() => {
        fetchCategories();
    }, []);

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
            <h1 className="text-lg font-bold pt-4 px-4">{selectedCategory}</h1>
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
                    <li
                        className={`p-2 cursor-pointer hover:bg-gray-200 rounded-md ${selectedCategory === "Tất cả" ? "font-bold" : ""}`}
                        onClick={() => handleCategorySelect("Tất cả")}
                    >
                        Tất cả
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category.productCategoryId}
                            className={`p-2 cursor-pointer hover:bg-gray-200 rounded-md ${selectedCategory === category.productCategoryTitle ? "font-bold" : ""}`}
                            onClick={() => handleCategorySelect(category.productCategoryTitle)}
                        >
                            {category.productCategoryTitle}
                        </li>
                    ))}
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