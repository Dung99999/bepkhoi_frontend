import MenuPage from "../pages/MenuPage.tsx";
import CostConfigPage from "../pages/CostConfigPage.tsx";
import { FaStore, FaWallet } from "react-icons/fa";

export const configPage = [
  { pageId: "menuPage", path: "/menu", element: <MenuPage /> },
  { pageId: "costConfigPage", path: "/cost-config", element: <CostConfigPage />}
];

export default {
  menuButton: {
    btnKitchen: { label: "Nhà bếp", path: "/kitchen", icon: FaStore },
    btnCashier: { label: "Thu ngân", path: "/cashier", icon: FaWallet },
  },
  menuItem: [
    { id: 1, label: "Tổng quan", path: "/dashboard" },
    {
      id: 2,
      label: "Hàng hóa",
      subMenu: [
        { label: "Danh mục", path: "/menu" },
        { label: "Thiết lập giá", path: "/cost-config" },
      ],
    },
    {
      id: 3,
      label: "Giao dịch",
      subMenu: [
        { label: "Lịch sử đơn hàng", path: "/orders-history" },
        { label: "Quản lý thanh toán", path: "/payment-management" },
      ],
    },
    { id: 4, label: "Phòng/Bàn", path: "/rooms" },
  ],
};
