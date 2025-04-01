import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const SearchFilter: React.FC<Props> = ({ search, setSearch }) => {
  return (
    <div className="relative w-full">
      <Input
        placeholder="Tìm kiếm sản phẩm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined className="text-gray-500 text-lg" />}
        className="w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchFilter;
