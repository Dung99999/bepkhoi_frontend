import MenuPage from "../pages/MenuPage.tsx";

export const configPage = [
  { pageId: "menuPage", path: "/menu", element: <MenuPage /> },
];

export default {
  menuMessage: {
    mess: "Welcome to Menu Page",
    actor: "Admin",
  }
};
