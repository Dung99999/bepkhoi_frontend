import React from "react";
import SearchFilter from "../../Manage/Filters/SearchFilter";
import MenuCategoryFilter from "../Filters/MenuCategoryFilter";
import MenuStatusFilter from "../Filters/MenuStatusFilter";

interface MenuSidebarProps {
  search: string;
  setSearch: (value: string) => void;
  category: string[];
  setCategory: (value: string[]) => void;
  status: string;
  setStatus: (value: string) => void;
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
    <aside className="w-1/5 min-w-[20%] max-w-[20%] p-4 rounded-lg overflow-auto mt-[-0.5vw]">
      <div className="flex flex-col gap-[0.5vw]">
        {showSearch && <SearchFilter search={search} setSearch={setSearch} />}
        {showCategory && (
          <MenuCategoryFilter category={category} setCategory={setCategory} />
        )}
        {showStatus && (
          <MenuStatusFilter
            status={String(status)}
            setStatus={(value) => setStatus(value)}
          />
        )}
      </div>
    </aside>
  );
};

export default MenuSidebar;
