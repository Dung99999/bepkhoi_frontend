import React from "react";
import DateRangeFilter from "../Filters/DateRangeFilter";

interface SidebarProps {
  dateFrom: string | null;
  dateTo: string | null;
  setDateFrom: (value: string | null) => void;
  setDateTo: (value: string | null) => void;
  showDateRange?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  showDateRange = true,
}) => {
  return (
    <aside className="w-1/5 min-w-[250px] max-w-[300px] p-4 rounded-lg overflow-auto mt-[-16px]">
      <div className="flex flex-col gap-[5px]">
        {showDateRange && (
          <DateRangeFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
