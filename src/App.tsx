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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Trang Login tách riêng bên ngoài */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyAccount />} />

        {/* Nhóm trang quản lý */}
        <Route path="/manage" element={<ManageLayout />}>
          {/* Nếu vào "/manage" thì tự động chuyển về "/manage/menu" */}
          <Route index element={<Navigate to="/manage/menu" replace />} />
          {/* Trang menu chính */}
          <Route path="menu" element={<MenuPage />} />
        </Route>

        {/* Nếu truy cập đường dẫn không hợp lệ, chuyển hướng về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<ManageLayout />}>
          {manangeRoutes.map((route, index) => (
            <Route 
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* Route for error type */}
        <Route path="/403" element={<ForbiddenPage/>}/>
        <Route path="/404" element={<NotFoundPage/>}/>
        <Route path="/500" element={<ServerErrorPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
