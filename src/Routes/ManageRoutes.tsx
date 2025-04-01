import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Manage/MenuPage";
import SettingPricePage from "../pages/Manage/SettingPricePage";

interface RouteItem {
    path?: string; // Có thể là path hoặc index
    index?: boolean;
    element: React.ReactNode;
    roles: string[];
}

const manangeRoutes: RouteItem[] = [
    { index: true, element: <Navigate to="menu" replace />, roles: ["admin", "employee"] }, // ✅ Route mặc định
    { path: "menu", element: <MenuPage />, roles: ["admin"] },
    { path: "settingPrice", element: <SettingPricePage />, roles: ["admin"] }
];

export default manangeRoutes;
