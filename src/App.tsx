import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import ShopLayout from "./layouts/ShopLayout";
import LoginPage from "./pages/POS/LoginPage";
import VerifyAccount from "./pages/POS/VerifyAccount";
import manageRoutes from "./Routes/ManageRoutes";
import shopRoutes from "./Routes/ShopRoutes";
import ForbiddenPage from "./pages/Error/403";
import NotFoundPage from "./pages/Error/404";
import ServerErrorPage from "./pages/Error/500";

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

        <Route path="/shop" element={<ShopLayout modelMode={modelMode} />}>
          <Route index element={<Navigate to="/shop/menu" replace />} />
          {shopRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
