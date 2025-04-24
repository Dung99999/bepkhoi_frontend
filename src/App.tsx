import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import ShopLayout from "./layouts/ShopLayout";
import LoginPage from "./pages/POS/LoginPage";
import VerifyAccount from "./pages/POS/VerifyAccount";
import manageRoutes from "./Routes/ManageRoutes";
import shopRoutes from "./Routes/ShopRoutes";
import ForbiddenPage from "./pages/Error/403";
import NotFoundPage from "./pages/Error/404";
import ServerErrorPage from "./pages/Error/500";
import "./pages/Manage/SettingPricePage.css";
import POSLayout from "./layouts/POSLayout";
import GuessPage from "./pages/Shop/GuessPage";
import ShopNavi from "./pages/Shop/ShopNavi";
import ShopMenuRedirect from "./pages/Shop/ShopMenuRedirect";
import posRoutes from "./Routes/POSRoutes";
import landingRoutes from "./Routes/LandingRoutes";
import LandingPageLayout from "./layouts/LandingPageLayout";
import { startConnection } from "../src/services/signalRService";
import VnpayTransactionResult from "./pages/POS/VnpayTransactionResult";
// // import POSRoutes from "./Routes/POSRoutes";
// import { POSTableList } from "./components/POS/POSTableList";
// import { POSMenuList } from "./components/POS/POSMenuList";
// import POSOrderSummary from "./components/POS/POSOrderSummary";
// import { POSPaymentSection } from "./components/POS/POSPaymentSection";

const App: React.FC = () => {

  const [modelMode, setModelMode] = useState<string>("0");

  useEffect(() => {
    const getModelMode = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isTouchDevice = "ontouchend" in window || navigator.maxTouchPoints > 0;
      if (/iphone|android.*mobile/.test(ua)) return "1";
      if (/ipad/.test(ua)
        || (ua.includes("macintosh") && isTouchDevice)
        || (/android/.test(ua) && !/mobile/.test(ua)))
        return "2";
      return "0";
    };
    const mode = getModelMode();
    setModelMode(mode);
    console.log(`Model Mode: ${mode} (${mode === "1" ? "Điện thoại" : mode === "2" ? "Máy tính bảng" : "PC"})`);
  }, []);

  const ShopRouteWrapper: React.FC<{ modelMode: string }> = ({ modelMode }) => {
    const location = useLocation();
    const roomId = sessionStorage.getItem('roomId');
    const customerInfo = sessionStorage.getItem('customerInfo');
    if (!roomId || !customerInfo) {
      if (!location.pathname.startsWith('/guess') &&
        !location.pathname.startsWith('/navi') &&
        !location.pathname.startsWith('/shopRedirect')) {
        return <Navigate to="/navi" replace />;
      }
    }
    return <ShopLayout modelMode={modelMode} />;
  };
  useEffect(() => {
    // Khởi tạo kết nối SignalR khi ứng dụng bắt đầu
    startConnection().catch((err) => {
      console.error("Khởi tạo SignalR thất bại:", err);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyAccount />} />

        <Route path="/manage" element={<ManageLayout />}>
          <Route index element={<Navigate to="/manage/menu" replace />} />
          {manageRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
        {/* Group page of POS site */}
        <Route path="/pos/*" element={<POSLayout />} />

        <Route path="/shop" element={<ShopRouteWrapper modelMode={modelMode} />}>
          <Route index element={<Navigate to="/shop/menu" replace />} />
          {shopRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="/" element={<LandingPageLayout />}>
          {landingRoutes.map((route, index) =>
            route.index ? (
              <Route key={index} index element={route.element} />
            ) : (
              <Route key={index} path={route.path} element={route.element} />
            )
          )}
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/guess" element={<GuessPage />} />
        <Route path="/navi" element={<ShopNavi />} />
        <Route path="/shopRedirect/:roomId" element={<ShopMenuRedirect />} />
        <Route path="/vnpay-result" element={<VnpayTransactionResult />} />
      </Routes>
    </Router>
  );
};

export default App;
