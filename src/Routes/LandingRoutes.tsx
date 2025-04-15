import React from "react";
import { Navigate } from "react-router-dom";
import OrderManagePage from "../pages/Manage/OrderManagePage";
import InvoiceManagePage from "../pages/Manage/InvoiceManagePage";
import HomeLanding from "../pages/LandingPage/HomeLanding";
import AboutUsLanding from "../pages/LandingPage/AboutUsLanding";
import ContactUs from "../pages/LandingPage/ContactUs";
interface RouteItem {
  path?: string;
  index?: boolean;
  element: React.ReactNode;
  roles: string[];
}

const landingRoutes: RouteItem[] = [
  { index: true, element: <HomeLanding />, roles: ["admin", "employee"] },
  { path: "/contact", element: <ContactUs />, roles: ["admin"] },
  { path: "/about-us", element: <AboutUsLanding />, roles: ["admin"] },
];

export default landingRoutes;
