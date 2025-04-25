import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { authInfo } = useAuth();

  // Nếu chưa đăng nhập (không có token), chuyển hướng đến /login
  if (!authInfo.token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng role không được phép, chuyển hướng đến /403
  if (!roles.includes(authInfo.roleName || "")) {
    return <Navigate to="/403" replace />;
  }

  // Nếu hợp lệ, render children
  return <>{children}</>;
};

export default ProtectedRoute;