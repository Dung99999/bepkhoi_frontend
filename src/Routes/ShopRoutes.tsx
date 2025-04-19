import React from "react";
import { Navigate } from "react-router-dom";
import MenuPage from "../pages/Shop/MenuPage";
import CartPage from "../pages/Shop/CartPage";
import PaymentPage from "../pages/Shop/PaymentPage";
import CartStatus from "../pages/Shop/CartStatus";
import OrderStatus from "../pages/Shop/OrderStatus";

interface RouteItem {
    path: string;
    element: React.ReactNode;
    roles: string[];
}

const shopRoutes: RouteItem[] = [
    { path: "/shop", element: <Navigate to="/shop/menu" replace />, roles: ["customer"] },
    { path: "/shop/menu", element: <MenuPage />, roles: ["customer"] },
    { path: "/shop/cart", element: <CartPage />, roles: ["customer"] },
    { path: "/shop/payment", element: <PaymentPage />, roles: ["customer"] },
    { path: "/shop/status", element: <OrderStatus />, roles: ["customer"] },
];

export default shopRoutes;
