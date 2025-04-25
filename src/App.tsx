// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import ManageLayout from "./layouts/ManageLayout";
// import ShopLayout from "./layouts/ShopLayout";
// import LoginPage from "./pages/POS/LoginPage";
// import VerifyAccount from "./pages/POS/VerifyAccount";
// import manageRoutes from "./Routes/ManageRoutes";
// import shopRoutes from "./Routes/ShopRoutes";
// import ForbiddenPage from "./pages/Error/403";
// import NotFoundPage from "./pages/Error/404";
// import ServerErrorPage from "./pages/Error/500";
// import "./pages/Manage/SettingPricePage.css";
// import POSLayout from "./layouts/POSLayout";
// import GuessPage from "./pages/Shop/GuessPage";
// import ShopNavi from "./pages/Shop/ShopNavi";
// import ShopMenuRedirect from "./pages/Shop/ShopMenuRedirect";
// import landingRoutes from "./Routes/LandingRoutes";
// import LandingPageLayout from "./layouts/LandingPageLayout";
// import { startConnection } from "../src/services/signalRService";
// import VnpayTransactionResult from "./pages/POS/VnpayTransactionResult";
// import posRoutes from "./Routes/POSRoutes";


// const App: React.FC = () => {

//   const [modelMode, setModelMode] = useState<string>("0");

//   useEffect(() => {
//     const getModelMode = () => {
//       const ua = navigator.userAgent.toLowerCase();
//       const isTouchDevice = "ontouchend" in window || navigator.maxTouchPoints > 0;
//       if (/iphone|android.*mobile/.test(ua)) return "1";
//       if (/ipad/.test(ua)
//         || (ua.includes("macintosh") && isTouchDevice)
//         || (/android/.test(ua) && !/mobile/.test(ua)))
//         return "2";
//       return "0";
//     };
//     const mode = getModelMode();
//     setModelMode(mode);
//     console.log(`Model Mode: ${mode} (${mode === "1" ? "Điện thoại" : mode === "2" ? "Máy tính bảng" : "PC"})`);
//   }, []);

//   const ShopRouteWrapper: React.FC<{ modelMode: string }> = ({ modelMode }) => {
//     const location = useLocation();
//     const roomId = sessionStorage.getItem('roomId');
//     const customerInfo = sessionStorage.getItem('customerInfo');
//     if (!roomId || !customerInfo) {
//       if (!location.pathname.startsWith('/guess') &&
//         !location.pathname.startsWith('/navi') &&
//         !location.pathname.startsWith('/shopRedirect')) {
//         return <Navigate to="/navi" replace />;
//       }
//     }
//     return <ShopLayout modelMode={modelMode} />;
//   };
//   useEffect(() => {
//     // Khởi tạo kết nối SignalR khi ứng dụng bắt đầu
//     startConnection().catch((err) => {
//       console.error("Khởi tạo SignalR thất bại:", err);
//     });
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/verify" element={<VerifyAccount />} />

//         <Route path="/manage" element={<ManageLayout />}>
//           <Route index element={<Navigate to="/manage/dashboard" replace />} />
//           {manageRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.element} />
//           ))}
//         </Route>
//         {/* Group page of POS site */}
//         <Route path="/pos">
//           <Route index element={<Navigate to="cashier" replace />} />
//           {posRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.element} />
//           ))}
//         </Route>

//         <Route path="/shop" element={<ShopRouteWrapper modelMode={modelMode} />}>
//           <Route index element={<Navigate to="/shop/menu" replace />} />
//           {shopRoutes.map((route, index) => (
//             <Route key={index} path={route.path} element={route.element} />
//           ))}
//         </Route>

//         <Route path="/" element={<LandingPageLayout />}>
//           {landingRoutes.map((route, index) =>
//             route.index ? (
//               <Route key={index} index element={route.element} />
//             ) : (
//               <Route key={index} path={route.path} element={route.element} />
//             )
//           )}
//         </Route>

//         <Route path="*" element={<Navigate to="/404" replace />} />
//         <Route path="/403" element={<ForbiddenPage />} />
//         <Route path="/404" element={<NotFoundPage />} />
//         <Route path="/500" element={<ServerErrorPage />} />
//         <Route path="/guess" element={<GuessPage />} />
//         <Route path="/navi" element={<ShopNavi />} />
//         <Route path="/shopRedirect/:roomId" element={<ShopMenuRedirect />} />
//         <Route path="/vnpay-result" element={<VnpayTransactionResult />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


///////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import ShopLayout from "./layouts/ShopLayout";
import LoginPage from "./pages/AuthenticationPage/LoginPage";
import VerifyAccount from "./pages/AuthenticationPage/VerifyAccount";
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
import landingRoutes from "./Routes/LandingRoutes";
import LandingPageLayout from "./layouts/LandingPageLayout";
import { startConnection } from "./services/signalRService";
import VnpayTransactionResult from "./pages/POS/VnpayTransactionResult";
import posRoutes from "./Routes/POSRoutes";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

const App: React.FC = () => {
  const [modelMode, setModelMode] = useState<string>("0");

  useEffect(() => {
    const getModelMode = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isTouchDevice = "ontouchend" in window || navigator.maxTouchPoints > 0;
      if (/iphone|android.*mobile/.test(ua)) return "1";
      if (/ipad/.test(ua) || (ua.includes("macintosh") && isTouchDevice) || (/android/.test(ua) && !/mobile/.test(ua)))
        return "2";
      return "0";
    };
    const mode = getModelMode();
    setModelMode(mode);
    console.log(`Model Mode: ${mode} (${mode === "1" ? "Điện thoại" : mode === "2" ? "Máy tính bảng" : "PC"})`);
  }, []);

  const ShopRouteWrapper: React.FC<{ modelMode: string }> = ({ modelMode }) => {
    const location = useLocation();
    const roomId = sessionStorage.getItem("roomId");
    const customerInfo = sessionStorage.getItem("customerInfo");
    if (!roomId || !customerInfo) {
      if (
        !location.pathname.startsWith("/guess") &&
        !location.pathname.startsWith("/navi") &&
        !location.pathname.startsWith("/shopRedirect")
      ) {
        return <Navigate to="/navi" replace />;
      }
    }
    return <ShopLayout modelMode={modelMode} />;
  };

  useEffect(() => {
    startConnection().catch((err) => {
      console.error("Khởi tạo SignalR thất bại:", err);
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Các route công khai, không cần AuthProvider */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/guess" element={<GuessPage />} />
        <Route path="/navi" element={<ShopNavi />} />
        <Route path="/shopRedirect/:roomId" element={<ShopMenuRedirect />} />
        <Route path="/vnpay-result" element={<VnpayTransactionResult />} />

        {/* Các route cần AuthProvider */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <Routes>
                {/* Route cho login và verify */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify" element={<VerifyAccount />} />

                {/* Route cho manage (chỉ admin) */}
                <Route
                  path="/manage"
                  element={
                    <ProtectedRoute roles={["manager"]}>
                      <ManageLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/manage/dashboard" replace />} />
                  {manageRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={<ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>}
                    />
                  ))}
                </Route>

                {/* Route cho pos (admin và cashier) */}
                <Route
                  path="/pos"
                  element={
                    <ProtectedRoute roles={["manager", "cashier"]}>
                      <POSLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="cashier" replace />} />
                  {posRoutes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={<ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>}
                    />
                  ))}
                </Route>

                {/* Route cho shop (giữ nguyên logic hiện có, không dùng ProtectedRoute) */}
                <Route path="/shop" element={<ShopRouteWrapper modelMode={modelMode} />}>
                  <Route index element={<Navigate to="/shop/menu" replace />} />
                  {shopRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                </Route>

                {/* Route cho landing (không cần phân quyền) */}
                <Route path="/" element={<LandingPageLayout />}>
                  {landingRoutes.map((route, index) =>
                    route.index ? (
                      <Route key={index} index element={route.element} />
                    ) : (
                      <Route key={index} path={route.path} element={route.element} />
                    )
                  )}
                </Route>

                {/* Route mặc định */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;