import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import MenuPage from "./pages/Manage/MenuPage";
import manangeRoutes from "./Routes/ManageRoutes";
import ForbiddenPage from "./pages/Error/403";
import NotFoundPage from "./pages/Error/404";
import ServerErrorPage from "./pages/Error/500";
import "./pages/Manage/SettingPricePage.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
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
