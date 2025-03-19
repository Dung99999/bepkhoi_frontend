import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import './PriceMenuList.css';
import ModalSettingPriceById from "./ModalSettingPriceById";
import { EditOutlined } from "@ant-design/icons"

interface PriceMenuListProps {
  search: string;
  category: string[];
  menuStatus: string;
}

interface PriceMenuItem {
  productId: number;
  productName: string;
  costPrice: number;
  sellPrice: number;
  salePrice: number;
  productVat: number;
}

const PriceMenuList: React.FC<PriceMenuListProps> = ({ search, category, menuStatus }) => {
  const [items, setItems] = useState<PriceMenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PriceMenuItem | null>(null);

  const createQueryParams = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("productNameOrId", search.trim());
    if (category.length > 0 && !category.includes("all")) params.append("categoryId", category[0]);
    if (menuStatus !== "all") params.append("status", menuStatus);
    params.append("sortBy", "ProductId");
    params.append("sortDirection", "asc");
    return params.toString();
  };

  const fetchData = () => {
    setLoading(true);
    const queryParams = createQueryParams();
    fetch(`https://localhost:7257/api/Menu/get-all-menus?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.data ?? []);
        setTotal(data.totalRecords || 0);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };
  

  useEffect(() => {
    setLoading(true);
    const queryParams = createQueryParams();
    fetch(`https://localhost:7257/api/Menu/get-all-menus?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.data ?? []);
        setTotal(data.totalRecords || 0);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [search, category, menuStatus, page]);

  const handleOpenModal = (record: PriceMenuItem) => {
    setSelectedItem(record);
    setOpenModal(true);
  };

  const columns: TableColumnsType<PriceMenuItem> = [
    { title: "Mã hàng hóa", dataIndex: "productId", key: "productId", width: 100 },
    {
      title: "Tên hàng",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Giá vốn",
      dataIndex: "costPrice",
      key: "costPrice",
      render: (price) => <span>{price?.toLocaleString()}đ</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (price) => <span>{price?.toLocaleString()}đ</span>,
    },
    {
      title: "Giá sau KM",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (price) => <span>{price?.toLocaleString()}đ</span>,
    },
    {
      title: "Chỉnh sửa",
      key: "action",
      render: (_, record) => (
        <button 
            onClick={() => handleOpenModal(record)}
            className="edit-button">
            <EditOutlined className="mr-1" /> Cập nhật
        </button>
      ),
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table<PriceMenuItem>
        rowKey="productId"
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
      />

      {selectedItem && (
        <ModalSettingPriceById
          open={openModal}
          product={selectedItem}
          onClose={() => setOpenModal(false)}
          onReload={fetchData}
        />
      )}
    </div>
  );
};

export default PriceMenuList;
