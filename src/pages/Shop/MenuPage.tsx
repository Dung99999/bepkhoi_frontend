import React, { useCallback, useEffect, useState } from "react";
import MenuList from "../../components/Shop/Menu/MenuList";
import MenuTop from "../../components/Shop/Menu/MenuTop";
import ProductModal from "../../components/Shop/Menu/ProductModal";
import { Drawer } from "antd";
import axios from "axios";
import useSignalR from "../../CustomHook/useSignalR";

interface Product {
    id: number;
    name: string;
    price: number;
    salePrice?: number;
    sellPrice: number;
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
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderIds, setOrderIds] = useState<number[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const fetchUnits = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/units/get-all-units`,
              );
            setUnits(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn vị tính:", error);
        }
    };

    const fetchProducts = async (searchText: string = "", categoryId: number | null = null) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/get-all-menus-customer`,
                {
                  params: {
                    sortBy: "ProductId",
                    sortDirection: "asc",
                    productNameOrId: searchText,
                    ...(categoryId ? { categoryId } : {}),
                  }
                }
              );

            const mappedProducts = response.data.data.map((item: any) => {
                const hasSale = item.salePrice && item.salePrice > 0;
                return {
                    id: item.productId,
                    name: item.productName,
                    price: hasSale ? item.salePrice : item.sellPrice,
                    salePrice: hasSale ? item.salePrice : undefined,
                    sellPrice: item.sellPrice,
                    image: item.productImages?.[0]?.imageUrl || '',
                    description: item.description || 'Không có mô tả',
                    unit: item.unitId?.toString(),
                    status: item.isAvailable ? 'Còn hàng' : 'Hết hàng',
                }
            });

            setFilteredProducts(mappedProducts);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                if (error.response.data?.message === "No product matched the condition.") {
                    setFilteredProducts([]);
                }
            } else {
                console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/product-categories/get-all-categories`
              );
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

    const fetchOrderIds = async () => {
        try {
            const roomId = sessionStorage.getItem('roomId');
            const customerInfo = sessionStorage.getItem('customerInfo');

            if (!roomId || !customerInfo) {
                setOrderIds([]);
                setSelectedOrderId(null);
                sessionStorage.removeItem('selectedOrderId');
                return;
            }
            const { customerId } = JSON.parse(customerInfo);
            const response = await axios.get(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/order-ids-for-qr`,
                {
                  params: {
                    roomId,
                    customerId
                  }
                }
              );
            const orders = response.data || [];
            setOrderIds(orders);
            const maxOrderId = orders.length > 0 ? Math.max(...orders) : null;
            const savedOrderId = sessionStorage.getItem('selectedOrderId');
            const isValidOrder = savedOrderId && orders.includes(parseInt(savedOrderId));
            const orderIdToSet = isValidOrder ? parseInt(savedOrderId) : maxOrderId;
            setSelectedOrderId(orderIdToSet);
            if (orderIdToSet !== null) {
                sessionStorage.setItem('selectedOrderId', orderIdToSet.toString());
            } else {
                sessionStorage.removeItem('selectedOrderId');
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách order IDs:", error);
            setOrderIds([]);
            setSelectedOrderId(null);
            sessionStorage.removeItem('selectedOrderId');
        }
    };

    const getUnitTitle = (unitId: number): string => {
        const unit = units.find(u => u.unitId === unitId);
        return unit ? unit.unitTitle : 'Không xác định';
    };

    const handleCategorySelect = (categoryTitle: string, categoryId: number | null) => {
        setSelectedCategory(categoryTitle);
        setSelectedCategoryId(categoryId);
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
    const debounceOrderListUpdate = useCallback(() => {
        let timeout: NodeJS.Timeout;
        return (data: { customerId: number }) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const customerInfo = sessionStorage.getItem("customerInfo");
                let storedCustomerId: number | null = null;
                if (customerInfo) {
                    try {
                        storedCustomerId = JSON.parse(customerInfo).customerId;
                    } catch (error) {
                        return
                    }
                    if (data.customerId === storedCustomerId) {
                        fetchOrderIds();
                    } else {
                        return
                    }
                }
            }, 500);
        };
    }, [fetchOrderIds]);
      useSignalR(
        {
          eventName: "CustomerOrderListUpdate",
          groupName: "order",
          callback: debounceOrderListUpdate(),
        },
        [debounceOrderListUpdate]
      );

    useEffect(() => {
        fetchAllData();
        fetchOrderIds();
        const savedOrderId = sessionStorage.getItem('selectedOrderId');
        if (savedOrderId) {
            setSelectedOrderId(parseInt(savedOrderId));
        }
    }, []);

    useEffect(() => {
        fetchProducts(search, selectedCategoryId);
    }, [search, selectedCategoryId]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div>
            <MenuTop
                search={search}
                setSearch={(value) => setSearch(value)}
                toggleDrawer={toggleDrawer}
                orderIds={orderIds}
                selectedOrderId={selectedOrderId}
                onOrderIdChange={setSelectedOrderId}
            />
            <h1 className="text-lg font-bold pt-4 px-4">{selectedCategory}</h1>

            {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-500 py-10">Không tìm thấy sản phẩm nào phù hợp.</div>
            ) : (
                <MenuList
                    products={filteredProducts}
                    onProductClick={showModal}
                />
            )}

            <Drawer
                title="Bộ lọc danh mục"
                placement="right"
                onClose={toggleDrawer}
                open={drawerVisible}
            >
                <ul>
                    <li
                        className={`p-2 cursor-pointer hover:bg-gray-200 rounded-md ${selectedCategory === "Tất cả" ? "font-bold" : ""}`}
                        onClick={() => handleCategorySelect("Tất cả", null)}
                    >
                        Tất cả
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category.productCategoryId}
                            className={`p-2 cursor-pointer hover:bg-gray-200 rounded-md ${selectedCategory === category.productCategoryTitle ? "font-bold" : ""}`}
                            onClick={() => handleCategorySelect(category.productCategoryTitle, category.productCategoryId)}
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