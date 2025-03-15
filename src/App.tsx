import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import MenuPage from "./pages/Manage/MenuPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/manage" element={<ManageLayout />}>
          {/* Nếu vào "/" thì tự động chuyển về "/menu" */}
          <Route index element={<Navigate to="/manage/menu" replace />} />
          {/* Trang menu chính */}
          <Route path="/manage/menu" element={<MenuPage />} />
          {/* Có thể thêm các route khác ở đây nếu cần */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
