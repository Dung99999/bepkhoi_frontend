import React from "react";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { SearchProps } from "antd/es/input/Search";
import "./SearchFilter.css";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const { Search } = Input;

const SearchFilter: React.FC<Props> = ({ search, setSearch }) => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setSearch(value);
  };

  return (
    <div className="search-filter-wrapper">
      <label className="block font-semibold mb-1">Tìm kiếm</label>
      <Space direction="vertical" className="w-full">
        <Search
          placeholder="Tên, số điện thoại"
          enterButton={<SearchOutlined />} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
          className="custom-search"
        />
      </Space>
    </div>
  );
};

export default SearchFilter;
