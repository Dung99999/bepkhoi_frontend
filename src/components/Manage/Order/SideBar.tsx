import React from "react";
import DateRangeFilter from "../Filters/DateRangeFilter";
import SearchFilter from "../Filters/SearchId";

interface SidebarProps {
  dateFrom: string | null;
  dateTo: string | null;
  setDateFrom: (value: string | null) => void;
  setDateTo: (value: string | null) => void;
  showDateRange?: boolean;
  search: string;
  setSearch: (value: string) => void;
  showSearch?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  showDateRange = true,
  search,
  setSearch,
  showSearch = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[20%] max-w-[20%] p-4 rounded-lg overflow-auto mt-[-0.5vw]">
      <div className="flex flex-col gap-[0.5vw]">
        {showDateRange && (
          <DateRangeFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
          />
        )}
        {showSearch && <SearchFilter search={search} setSearch={setSearch} />}
      </div>
    </aside>
  );
};

export default Sidebar;
