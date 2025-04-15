import React, { useEffect, useState } from "react";
import { message, Table,  Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import './MenuList.css';
import MenuDetailModal from "./MenuDetailModal";
import MenuUpdateModal from "./MenuUpdateModal";
import axios from 'axios';

interface MenuListProps {
  search: string;
  category: string[];
  status: string;
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
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<MenuItem | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState<MenuItem | null>(null);

  // Function create query params
  const createQueryParams = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("productNameOrId", search.trim());

    if (category.length > 0 && !category.includes("all")) params.append("categoryId", category[0]);

    if (status.length > 0 && !status.includes("all")) params.append("isActive", status[0] === "1" ? "true" : "false");

    params.append("sortBy", "ProductId");
    params.append("sortDirection", "asc");

    return params.toString();
  };

  // API call when search, category, status, page change
  useEffect(() => {
    setLoading(true);
    const queryParams = createQueryParams();
    console.log("Query Params call to API:", queryParams);

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
  }, [search, category , status, page]);

  // Handle close row to close detail modal
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDetailData(null); // reset data
  }

  const fetchMenuList = async () => {
    setLoading(true);
    try {
      const queryParams = createQueryParams();
      const response = await fetch(`https://localhost:7257/api/Menu/get-all-menus?${queryParams}`);
      const data = await response.json();
      setItems(data.data ?? []);
      setTotal(data.totalRecords || 0);
    } catch (error) {
      console.error("Lỗi tải menu:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, [search, category, status, page]);

  // Handle delete 
  const handleDelete = async () => {
    if (detailData && window.confirm(`Bạn chắc chắn muốn xóa món \"${detailData.productName}\"?`)) {
      try {
        const response = await fetch(`https://localhost:7257/api/Menu/delete-menu/${detailData.productId}`, {
          method: "DELETE"
        });
        if (response.ok) {
          message.success("Xóa món thành công!");
          handleCloseDetail();
          await fetchMenuList();
        } else {
          message.error("Xóa thất bại, thử lại sau!");
        }
      } catch {
        message.error("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  // Handle click row to open detail modal
  const handleRowClick = (record: MenuItem) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    // Fetch APT Get Product By Id
    fetch(`https://localhost:7257/api/Menu/get-menu-by-id/${record.productId}`)
      .then((response) => response.json())
      .then((res) => setDetailData(res.data))
      .catch((error) => console.error("Error fetching detail:", error))
      .finally(() => setLoadingDetail(false));
  }
  
  // Handle update
  const handleOpenUpdate = (record : MenuItem) => {
    setUpdateData(record);
    setOpenUpdate(true);
  };

  // Column of table
  const columns: TableColumnsType<MenuItem> = [
    { title: "ID", dataIndex: "productId", key: "productId", width: 60 },
    {
      title: "Tên món",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <span 
          className="font-medium cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(record);
          }}>
            {text}
        </span>),
    },
    {
      title: "Giá bán",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (price) => <span>{price?.toLocaleString()}đ</span>,
    },
    {
      title: "Giá KM",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (price) => <span>{price?.toLocaleString()}đ</span>,
    },
    { title: "VAT (%)", dataIndex: "productVat", key: "productVat" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: boolean) =>
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
        dataSource={items}
        pagination={{
          pageSize: 10,
          total: total,
          current: page,
          onChange: (page) => setPage(page),
        }}
        rowSelection={{ type: "checkbox", ...rowSelection }}
        locale={{ emptyText: "Không có dữ liệu phù hợp." }}
        className="custom-table"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <MenuDetailModal 
        open={openDetail}
        loading={loadingDetail}
        data={detailData}
        onClose={() => setOpenDetail(false)}
        onUpdate={() => detailData && handleOpenUpdate(detailData)}
        onDelete={handleDelete} 
        onReloadMenuList={fetchMenuList}
      />

      {updateData && (
        <MenuUpdateModal
          open={openUpdate}
          data={updateData}
          onClose={() => setOpenUpdate(false)}
          onReload={() => {
            const queryParams = createQueryParams();
            fetch(`https://localhost:7257/api/Menu/get-all-menus?${queryParams}`)
              .then((response) => response.json())
              .then((data) => {
                setItems(data.data ?? []);
                setTotal(data.totalRecords || 0);
              });
          }}
        />
      )}
    </div>
  );
};

export default MenuList;
