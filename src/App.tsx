import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import MenuPage from "./pages/Manage/MenuPage";
import LoginPage from "./pages/POS/LoginPage"
import VerifyAccount from "./pages/POS/VerifyAccount"

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
      </Routes>
    </Router>
  );
};

export default App;
