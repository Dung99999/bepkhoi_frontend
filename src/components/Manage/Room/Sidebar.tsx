import React from "react";
import SearchFilter from "../Filters/SearchRoom";
import RoomStatusFilter from "../Filters/RoomStatusFilter";
import { message } from "antd";

interface SidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
  showSearch?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  search,
  onSearchChange,
  showSearch = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[15vw] max-w-[20vw] p-4 rounded-lg overflow-auto">
      <div className="flex flex-col gap-[1.25vw]">
        {showSearch && (
          <SearchFilter search={search} setSearch={onSearchChange} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
