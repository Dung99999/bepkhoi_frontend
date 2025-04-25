import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Manage/MenuPage";
import SettingPricePage from "../pages/Manage/SettingPricePage";
import CustomerManagePage from "../pages/Manage/CustomerManagePage";
import CashierManagePage from "../pages/Manage/CashierManagePage";
import ShipperManagePage from "../pages/Manage/ShipperManagePage";
import RoomAreaManagePage from "../pages/Manage/RoomAreaManagePage";
import RoomsManagePage from "../pages/Manage/RoomsManagePage";
import OrderManagePage from "../pages/Manage/OrderManagePage";
import InvoiceManagePage from "../pages/Manage/InvoiceManagePage";
import DashboardManagePage from "../pages/Manage/DashboardManagePage";

interface RouteItem {
    path?: string;
    index?: boolean;
    element: React.ReactNode;
    roles: string[];
}

const manageRoutes: RouteItem[] = [
    { index: true, element: <Navigate to="dashboard" replace />, roles: ["manager"] },
    { path: "/manage", element: <Navigate to="/manage/dashboard" replace />, roles: ["manager"] }, 
    { path: "/manage/menu", element: <MenuPage />, roles: ["manager"] },
    { path: "/manage/dashboard", element: <DashboardManagePage />, roles: ["manager"],},
    { path: "/manage/settingPrice", element: <SettingPricePage />, roles: ["manager"] },
    { path: "/manage/customer", element: <CustomerManagePage />, roles: ["manager"] },
    { path: "/manage/cashier", element: <CashierManagePage />, roles: ["manager"] },
    { path: "/manage/shipper", element: <ShipperManagePage />, roles: ["manager"] },
    { path: "/manage/roomArea", element: <RoomAreaManagePage />, roles: ["manager"] },
    { path: "/manage/rooms", element: <RoomsManagePage />, roles: ["manager"] },
    { path: "/manage/order", element: <OrderManagePage />, roles: ["manager"] },
    { path: "/manage/invoice", element: <InvoiceManagePage />, roles: ["manager"] },
];

export default manageRoutes;
