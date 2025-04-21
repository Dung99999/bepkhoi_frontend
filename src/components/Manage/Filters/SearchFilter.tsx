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
    console.log("Search from:", info?.source, value);
    setSearch(value);
  };

  return (
    <div className="search-filter-wrapper p-[1vw] mb-[1vw] border border-solid border-gray-200 rounded-[0.5vw]">
      <label className="block font-semibold mb-[0.5vw] text-[1vw]">
        Tìm kiếm
      </label>
      <Space direction="vertical" className="w-full rounded-[0.3vw]">
        <Search
          placeholder="Theo mã, tên hàng"
          enterButton={<SearchOutlined className="text-[1vw]" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
          className="custom-search text-[1vw] z-50"
          style={{
            fontSize: "1vw",
            height: "2.5vw",
            borderRadius: "1vw",
          }}
        />
      </Space>
    </div>
  );
};

export default SearchFilter;
