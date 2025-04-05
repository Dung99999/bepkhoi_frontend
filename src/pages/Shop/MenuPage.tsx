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

interface Unit {
    unitId: number;
    unitTitle: string;
}

const MenuPage: React.FC = () => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [loading, setLoading] = useState(true);

    const fetchUnits = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_APP_ENDPOINT}api/units/get-all-units`);
            setUnits(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn vị tính:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/get-all-menu-qr`);

            const mappedProducts = response.data.map((item: any) => {
                // Lưu unitId dưới dạng string trong trường unit
                return {
                    id: item.productId,
                    name: item.productName,
                    price: item.sellPrice,
                    image: item.productImageUrls?.[0] || '',
                    description: item.description || 'Không có mô tả',
                    unit: item.unitId?.toString(), // Lưu unitId dưới dạng string
                    status: item.isAvailable ? 'Còn hàng' : 'Hết hàng'
                };
            });

            setProducts(mappedProducts);
            setFilteredProducts(mappedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_APP_ENDPOINT}api/product-categories/get-all-categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await fetchUnits();
            await fetchCategories();
            await fetchProducts();
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const getUnitTitle = (unitId: number): string => {
        const unit = units.find(u => u.unitId === unitId);
        return unit ? unit.unitTitle : 'Không xác định';
    };

    const handleSearch = (value: string) => {
        const filtered = products.filter((product) =>
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
        fetchAllData();
    }, []);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

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
            <MenuList
                products={filteredProducts}
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
                unitTitle={selectedProduct ? getUnitTitle(parseInt(selectedProduct.unit || '0')) : ''}
                onClose={closeModal}
            />
        </div>
    );
};

export default MenuPage;