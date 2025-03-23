import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Manage/MenuPage";
import SettingPricePage from "../pages/Manage/SettingPricePage";
import CustomerManagePage from "../pages/Manage/CustomerManagePage";
// import more routes

interface RouteItem {
    path: string;
    element: React.ReactNode;
    roles: string[];
}

const manangeRoutes: RouteItem[] = [
    { path: "/", element: <Navigate to="/menu" replace />, roles: ["admin", "employee"] }, 
    { path: "menu", element: <MenuPage />, roles: ["admin"] },
    { path: "settingPrice", element: <SettingPricePage />, roles: ["admin"] },
    { path: "customer", element: <CustomerManagePage />, roles: ["admin"] }
];

export default manangeRoutes;