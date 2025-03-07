import React, { useState } from "react";
import config from "../config/config";
import Header from "./../components/Common/Header.tsx";
import MenuList from "./../components/MenuPage/MenuList.tsx";
import MenuSidebar from "./../components/MenuPage/MenuSidebar.tsx";
import "./../style/MenuPage/menuPage.css";

const allItems = [
    { id: 1, code: "SP001", name: "Bánh mì", category: "Đồ ăn", price: 20000, cost: 15000, order: 2, imageUrl: ["https://e7.pngegg.com/pngimages/361/627/png-clipart-leaf-logo-green-leaves-green-and-teal-leaf-logo-text-maple-leaf-thumbnail.png", "https://img.freepik.com/premium-vector/free-vector-beautiful-flying-hummingbird-design-element-banners-posters-leaflets-brochur_1009653-1.jpg"] },
    { id: 2, code: "SP002", name: "Trà sữa", category: "Đồ uống", price: 30000, cost: 20000, stock: 5, order: 1 },
    { id: 3, code: "SP003", name: "Mì gói", category: "Đồ ăn", price: 10000, cost: 8000, stock: 20, order: 5 },
];

export default function MenuPage() {

    const [filters, setFilters] = useState<string[]>(["Đồ ăn"]);

    const handleFilterChange = (selectedFilters: string[]) => {
        setFilters(selectedFilters);
    };

    const filteredItems = allItems.filter((item) =>
        filters.length === 0 || filters.includes(item.category)
    );

    return (
        <>
            <div className="menu">
                <Header />
                <div className="menu-container">
                    <MenuSidebar selectedFilters={filters} onFilterChange={handleFilterChange} />
                    <div className="menu-content">
                        <MenuList items={filteredItems} />
                    </div>
                </div>
            </div>
        </>
    );
}
