import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import type { TableColumnsType } from "antd";
import "./../Menu/MenuList.css";
import CustomerDetailModal from "./CustomerDetailModal";
import { useAuth } from "../../../context/AuthContext";

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
  const { authInfo, clearAuthInfo } = useAuth();
  const [items, setItems] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<CustomerItem | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const fetchCustomerList = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    setLoading(true);
    const apiUrl = search.trim()
      ? `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${encodeURIComponent(search.trim())}`
      : `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setItems(data ?? []);
      setTotal(data.length || 0);
    } catch (error) {
      message.error("Không thể tải danh sách khách hàng.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, [search, page, authInfo.token]);

  const handleRowClick = async (record: CustomerItem) => {
    setOpenDetail(true);
    setLoadingDetail(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/${record.customerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch customer detail");
      }
      const res = await response.json();
      setDetailData(res);
    } catch (error) {
      message.error("Không thể tải chi tiết khách hàng.");
    } finally {
      setLoadingDetail(false);
    }
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
