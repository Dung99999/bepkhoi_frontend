import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthInfo {
  token: string | null;
  userId: string | null;
  roleName: string | null;
  userName: string | null;
}

interface AuthContextType {
  authInfo: AuthInfo;
  setAuthInfo: (info: AuthInfo) => void;
  clearAuthInfo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authInfo, setAuthInfoState] = useState<AuthInfo>(() => {
    const token = localStorage.getItem("Token");
    const userId = localStorage.getItem("UserId");
    const roleName = localStorage.getItem("RoleName");
    const userName = localStorage.getItem("UserName");
    return {
      token: token || null,
      userId: userId || null,
      roleName: roleName || null,
      userName: userName || null,
    };
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        // Kiểm tra nếu key liên quan đến auth bị thay đổi
        if (event.key === "Token" || event.key === null) {
          const token = localStorage.getItem("Token");
          if (!token) {
            // Nếu Token bị xóa (do đăng xuất), cập nhật authInfo
            setAuthInfoState({
              token: null,
              userId: null,
              roleName: null,
              userName: null,
            });
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hàm lưu thông tin người dùng
  const setAuthInfo = (info: AuthInfo) => {
    setAuthInfoState(info);
    if (info.token && info.token.trim()) {
      localStorage.setItem("Token", info.token);
      localStorage.setItem("UserId", info.userId || "");
      localStorage.setItem("RoleName", info.roleName || "");
      localStorage.setItem("UserName", info.userName || "");
    }
  };

  // Hàm xóa thông tin người dùng
  const clearAuthInfo = () => {
    try {
      localStorage.removeItem("Token");
      localStorage.removeItem("UserId");
      localStorage.removeItem("RoleName");
      localStorage.removeItem("UserName");
      setAuthInfoState({
        token: null,
        userId: null,
        roleName: null,
        userName: null,
      });
    } catch (error) {
      console.error("Lỗi khi xóa thông tin từ localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo, clearAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};