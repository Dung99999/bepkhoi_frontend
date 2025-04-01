import React from "react";
import SearchFilter from "../Filters/SearchCustomer";

interface SidebarProps {
  search: string;
  setSearch: (value: string) => void;
  showSearch?: boolean;
}


const CustomerSidebar: React.FC<SidebarProps> = ({
  search,
  setSearch,
  showSearch = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[250px] max-w-[300px] p-4 rounded-lg overflow-auto mt-[-16px]">
      <div className="flex flex-col gap-[5px]">
        {showSearch && (
          <SearchFilter search={search} setSearch={setSearch} />
        )}
      </div>
    </aside>
  );
};

export default CustomerSidebar;
