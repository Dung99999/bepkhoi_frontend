import React from "react";
import SearchFilter from "../../Manage/Filters/SearchFilter";
import MenuCategoryFilter from "../Filters/MenuCategoryFilter";
import MenuStatusFilter from "../Filters/MenuStatusFilter";

interface MenuSidebarProps {
  search: string;
  setSearch: (value: string) => void;
  category: string[];
  setCategory: (value: string[]) => void;
  status: string[]; // ✅ Sửa thành mảng string
  setStatus: (value: string[]) => void; // ✅ Sửa thành mảng string
  showSearch?: boolean;
  showCategory?: boolean;
  showStatus?: boolean;
}


const MenuSidebar: React.FC<MenuSidebarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  showSearch = true,
  showCategory = true,
  showStatus = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[250px] max-w-[300px] p-4 rounded-lg overflow-auto mt-[-16px]">
      <div className="flex flex-col gap-[5px]">
        {showSearch && (
          <SearchFilter search={search} setSearch={setSearch} />
        )}
        {showCategory && (
          <MenuCategoryFilter category={category} setCategory={setCategory} />
        )}
        {showStatus && (
          <MenuStatusFilter status={status} setStatus={setStatus} />
        )}
      </div>
    </aside>
  );
};

export default MenuSidebar;
