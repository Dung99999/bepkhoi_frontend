import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import type { TableColumnsType } from "antd";
import "./../Menu/MenuList.css";
import CustomerDetailModal from "./CustomerDetailModal";

const token = localStorage.getItem("Token");

interface CustomerListProps {
  search: string;
}

interface CustomerItem {
  customerId: number;
  customerName: string;
  phone: string;
  totalAmountSpent: string;
}

const CustomerList: React.FC<CustomerListProps> = ({ search }) => {
  const [items, setItems] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<CustomerItem | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const fetchMenuList = () => {
    setLoading(true);
    const apiUrl = search.trim()
      ? `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${encodeURIComponent(search.trim())}`
      : `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data ?? []);
        setTotal(data.length || 0);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        message.error("Không thể tải danh sách khách hàng.");
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenuList();
  }, [search, page]);

  const handleRowClick = (record: CustomerItem) => {
    setOpenDetail(true);
    setLoadingDetail(true);

    fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/${record.customerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customer detail");
        }
        return response.json();
      })
      .then((res) => setDetailData(res))
      .catch((error) => {
        console.error("Error fetching detail:", error);
        message.error("Không thể tải chi tiết khách hàng.");
      })
      .finally(() => setLoadingDetail(false));
  };

  const columns: TableColumnsType<CustomerItem> = [
    { title: "ID", dataIndex: "customerId", key: "customerId", width: 60 },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Tổng tiền sử dụng",
      dataIndex: "totalAmountSpent",
      key: "totalAmountSpent",
      render: (value) => `${Number(value).toLocaleString()}đ`,
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table<CustomerItem>
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
          onClick: () => handleRowClick(record),
        })}
      />

      <CustomerDetailModal
        open={openDetail}
        loading={loadingDetail}
        data={detailData}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
};

export default CustomerList;
