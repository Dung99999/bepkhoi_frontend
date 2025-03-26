import React from "react";
import SearchFilter from "../Filters/SearchCustomer";
import UserStatusFilter from "../Filters/UserStatusFilter";

interface SidebarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  showSearch?: boolean;
  showStatus?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  showSearch = true,
  showStatus = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[250px] max-w-[300px] p-4 rounded-lg overflow-auto mt-[-16px]">
      <div className="flex flex-col gap-[5px]">
        {showSearch && (
          <SearchFilter search={search} setSearch={setSearch} />
        )}
        {showStatus && (
          <UserStatusFilter
            status={String(status)}
            setStatus={(value) => setStatus(value)}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
