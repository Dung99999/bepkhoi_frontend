import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { configPage } from "./config/config";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        {configPage.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </Router>
  );
}
