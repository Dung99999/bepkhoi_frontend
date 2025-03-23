import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import type { TableColumnsType } from "antd";
import './../Menu/MenuList.css';
import CustomerDetailModal from "./CustomerDetailModal";

interface MenuListProps {
  search: string;
}

interface MenuItem {
  customerId: number;
  customerName: string;
  phone: string;
  totalAmountSpent: string;
}

const MenuList: React.FC<MenuListProps> = ({ search }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<MenuItem | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const fetchMenuList = () => {  
    setLoading(true);
    const apiUrl = search.trim()
      ? `https://localhost:7257/api/Customer/search?searchTerm=${encodeURIComponent(search.trim())}`
      : `https://localhost:7257/api/Customer`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setItems(data ?? []);
        setTotal(data.length || 0);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenuList();
  }, [search, page]);

  const handleRowClick = (record: MenuItem) => {
    setOpenDetail(true);
    setLoadingDetail(true);

    fetch(`https://localhost:7257/api/Customer/${record.customerId}`)
      .then((response) => response.json())
      .then((res) => setDetailData(res))
      .catch((error) => console.error("Error fetching detail:", error))
      .finally(() => setLoadingDetail(false));
  }

  const columns: TableColumnsType<MenuItem> = [
    { title: "ID", dataIndex: "customerId", key: "customerId", width: 60 },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Tổng tiền sử dụng", dataIndex: "totalAmountSpent", key: "totalAmountSpent" },
  ];

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table<MenuItem>
        rowKey="customerId"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{
          pageSize: 10,
          total: total,
          current: page,
          onChange: (page) => setPage(page),
        }}
        locale={{ emptyText: "Không có dữ liệu phù hợp." }}
        className="custom-table"
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Bắt sự kiện click vào hàng
        })}
      />

      <CustomerDetailModal
        open={openDetail}
        loading={loadingDetail}
        data={detailData}
        onClose={() => setOpenDetail(false)}
        onReloadCustomerList={fetchMenuList}
      />
    </div>
  );
};

export default MenuList;
