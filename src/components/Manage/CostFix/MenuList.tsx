import React, { useEffect, useState } from "react";
import { Table, Tag, Input, message } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import './../Menu/MenuList.css';

interface MenuListProps {
  search: string;
  category: string[];
  status: string[];
}

interface MenuItem {
  productId: number;
  productName: string;
  productCategoryId: number;
  costPrice: number;
  sellPrice: number;
  salePrice: number;
  productVat: number;
  description: string;
  unitId: number;
  isAvailable: boolean;
  status: boolean;
  isDelete: boolean;
}

const MenuList: React.FC<MenuListProps> = ({ search, category, status }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const apiEndpoint = process.env.REACT_APP_API_APP_ENDPOINT;

  useEffect(() => {
    setLoading(true);
    fetch(`${apiEndpoint}api/Menu/menus?page=1&pageSize=10&sortBy=ProductId&sortDirection=asc`)
      .then((response) => response.json())
      .then((data) => setItems(data.data))
      .catch((error) => console.error("Error fetching menu:", error))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchSearch = item.productName.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category.length === 0 ||
      category.includes("all") ||
      category.includes(item.productCategoryId.toString());

    const matchStatus =
      status.length === 0 ||
      status.includes("all") ||
      (status.includes("visible") && item.status) ||
      (status.includes("hidden") && !item.status);

    return matchSearch && matchCategory && matchStatus;
  });

  const handleSavePrice = async (id: number) => {
    if (!newPrice) return;

    try {
      const response = await fetch(`${apiEndpoint}api/Menu/updatePrice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, sellPrice: parseFloat(newPrice) })
      });

      if (response.ok) {
        message.success("Cập nhật giá thành công!");
        setItems(prevItems => prevItems.map(item => item.productId === id ? { ...item, sellPrice: parseFloat(newPrice) } : item));
      } else {
        message.error("Cập nhật giá thất bại!");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      message.error("Đã xảy ra lỗi khi cập nhật giá!");
    } finally {
      setEditingId(null);
      setNewPrice("");
    }
  };

  // Cột
  const columns: TableColumnsType<MenuItem> = [
    { title: "ID", dataIndex: "productId", key: "productId", width: 60 },
    { title: "Tên món", dataIndex: "productName", key: "productName", render: (text) => <span className="font-medium">{text}</span> },
    {
      title: "Giá bán",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (price, record) =>
        editingId === record.productId ? (
          <Input
            defaultValue={price}
            onChange={(e) => setNewPrice(e.target.value)}
            onPressEnter={() => handleSavePrice(record.productId)}
            onBlur={() => setEditingId(null)}
          />
        ) : (
          <span onClick={() => setEditingId(record.productId)}>{price.toLocaleString()}đ</span>
        )
    },
    {
      title: "Giá KM", dataIndex: "salePrice", key: "salePrice",
      render: (price) => price != null ? <span>{price.toLocaleString()}đ</span> : <span>Không có KM</span>
    },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", render: (value: boolean) =>
        value ? <Tag color="green">Đang bán</Tag> : <Tag color="red">Ngừng bán</Tag>,
    },
  ];

  // Row selection
  const rowSelection: TableProps<MenuItem>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table<MenuItem>
        rowKey="productId"
        loading={loading}
        columns={columns}
        dataSource={filteredItems}
        pagination={{ pageSize: 10 }}
        rowSelection={{ type: "checkbox", ...rowSelection }}
        locale={{ emptyText: "Không có dữ liệu phù hợp." }}
        className="custom-table"
      />
    </div>
  );
};

export default MenuList;
