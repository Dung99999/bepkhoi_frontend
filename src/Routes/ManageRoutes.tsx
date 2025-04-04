import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Manage/MenuPage";
import SettingPricePage from "../pages/Manage/SettingPricePage";
import CustomerManagePage from "../pages/Manage/CustomerManagePage";
import CashierManagePage from "../pages/Manage/CashierManagePage";
import ShipperManagePage from "../pages/Manage/ShipperManagePage";
import RoomAreaManagePage from "../pages/Manage/RoomAreaManagePage";
import RoomsManagePage from "../pages/Manage/RoomsManagePage";

interface RouteItem {
    path?: string; // Có thể là path hoặc index
    index?: boolean;
    element: React.ReactNode;
    roles: string[];
}

const manageRoutes: RouteItem[] = [
    { index: true, element: <Navigate to="menu" replace />, roles: ["admin", "employee"] },
    { path: "/manage", element: <Navigate to="/manage/menu" replace />, roles: ["admin", "employee"] }, 
    { path: "/manage/menu", element: <MenuPage />, roles: ["admin"] },
    { path: "/manage/settingPrice", element: <SettingPricePage />, roles: ["admin"] },
    { path: "/manage/customer", element: <CustomerManagePage />, roles: ["admin"] },
    { path: "/manage/cashier", element: <CashierManagePage />, roles: ["admin"] },
    { path: "/manage/shipper", element: <ShipperManagePage />, roles: ["admin"] },
    { path: "/manage/roomArea", element: <RoomAreaManagePage />, roles: ["admin"] },
    { path: "/manage/rooms", element: <RoomsManagePage />, roles: ["admin"] },
];

export default manageRoutes;
