import MenuPage from "../pages/MenuPage.tsx";
import { FaStore, FaWallet } from "react-icons/fa";

export const configPage = [
  { pageId: "menuPage", path: "/menu", element: <MenuPage /> },
];

export default {
  menuButton: {
    btnKitchen: { label: "Nhà bếp", path: "/kitchen", icon: FaStore },
    btnCashier: { label: "Thu ngân", path: "/cashier", icon: FaWallet },
  },
  menuItem: [
    { id: 1, label: "Tổng quan", path: "/dashboard" },
    { id: 2, label: "Hàng hóa", path: "/menu" },
    { id: 3, label: "Phòng/Bàn", path: "/rooms" },
    { id: 4, label: "Giao dịch", path: "/transactions" },
  ],
};
