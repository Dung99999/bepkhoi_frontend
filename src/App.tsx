import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import MenuPage from "./pages/Manage/MenuPage";
import LoginPage from "./pages/POS/LoginPage"
import VerifyAccount from "./pages/POS/VerifyAccount"
import manangeRoutes from "./Routes/ManageRoutes";
import ForbiddenPage from "./pages/Error/403";
import NotFoundPage from "./pages/Error/404";
import ServerErrorPage from "./pages/Error/500";
import "./pages/Manage/SettingPricePage.css";
import POSLayout from "./layouts/POSLayout";
import posRoutes from "./Routes/POSRoutes";
// // import POSRoutes from "./Routes/POSRoutes";
// import { POSTableList } from "./components/POS/POSTableList";
// import { POSMenuList } from "./components/POS/POSMenuList";
// import POSOrderSummary from "./components/POS/POSOrderSummary";
// import { POSPaymentSection } from "./components/POS/POSPaymentSection";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login is slice for outside */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyAccount />} />

        {/* Group page of Manage */}
        <Route path="/manage/*" element={<ManageLayout />}>
          {manangeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Group page of POS site */}
        <Route path="/pos/*" element={<POSLayout />}>
          {posRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/manage/menu" replace />} />

        {/* Route for error type */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        {/* Bắt các đường dẫn không hợp lệ và chuyển về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
