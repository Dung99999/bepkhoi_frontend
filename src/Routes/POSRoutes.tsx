import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Manage/MenuPage";
import SettingPricePage from "../pages/Manage/SettingPricePage";


interface RouteItem {
    path?: string;
    index?: boolean;
    element: React.ReactNode;
    roles: string[];
}

const posRoutes: RouteItem[] = [
    { index: true, element: <Navigate to="cashier" replace />, roles: ["admin", "employee"] },
];

export default posRoutes;