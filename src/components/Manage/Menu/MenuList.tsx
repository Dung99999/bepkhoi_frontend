import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import "./MenuList.css";
import MenuDetailModal from "./MenuDetailModal";
import MenuUpdateModal from "./MenuUpdateModal";
import { useAuth } from "../../../context/AuthContext";

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

interface MenuDetail {
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
  imageUrl: string;
}

const MenuList: React.FC<MenuListProps> = ({ search, category, status }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<MenuDetail | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<MenuDetail | null>(null);

  // Function create query params
  const createQueryParams = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("productNameOrId", search.trim());

    if (category.length > 0 && !category.includes("all"))
      params.append("categoryId", category[0]);

    if (status.length > 0 && !status.includes("all"))
      params.append("isActive", status[0] === "1" ? "true" : "false");

    params.append("sortBy", "ProductId");
    params.append("sortDirection", "asc");

    return params.toString();
  };

  const fetchMenuList = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    setLoading(true);
    try {
      const queryParams = createQueryParams();
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/get-all-menus?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.data ?? []);
      setTotal(data.totalRecords || 0);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // API call when search, category, status, page change
  useEffect(() => {
    fetchMenuList();
  }, [search, category, status , page, authInfo.token]);

  // Handle close row to close detail modal
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDetailData(null); // reset data
  };

  // Handle click row to open detail modal
  const handleRowClick = async (record: MenuItem) => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }
    setOpenDetail(true);
    setLoadingDetail(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/get-menu-by-id/${record.productId}`,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();
      setDetailData(res.data || null);
    } catch (error) {
      message.error("Không thể tải chi tiết món!");
      setDetailData(null);
    } finally {
      setLoadingDetail(false);
    }
  };
  // Fetch menu detail (used by MenuUpdateModal)
  const fetchMenuDetail = async (productId: number) => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }
    if (openDetail && detailData?.productId === productId) {
      setLoadingDetail(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/get-menu-by-id/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${authInfo.token}`,
            },
          }
        );
        if (response.status === 401) {
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          clearAuthInfo();
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        setDetailData(res.data || null);
      } catch (error) {
        setDetailData(null);
      } finally {
        setLoadingDetail(false);
      }
    }
  };
  // Handle update
  const handleOpenUpdate = (record: MenuDetail) => {
    setUpdateData(record);
    setOpenUpdate(true);
  };

  // Column of table
  const columns: TableColumnsType<MenuItem> = [
    {
      title: "ID",
      dataIndex: "productId",
      key: "productId",
      width: 60,
      className: "text-[0.8vw]",
    },
    {
      title: "Tên món",
      dataIndex: "productName",
      key: "productName",
      className: "text-[0.8vw]",
      render: (text, record) => (
        <span
          className="font-medium cursor-pointer text-[0.8vw]"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(record);
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "sellPrice",
      key: "sellPrice",
      className: "text-[0.8vw]",
      render: (price) => (
        <span className="text-[0.8vw]">{price?.toLocaleString()}đ</span>
      ),
    },
    {
      title: "Giá KM",
      dataIndex: "salePrice",
      key: "salePrice",
      className: "text-[0.8vw]",
      render: (price) => (
        <span className="text-[0.8vw]">{price?.toLocaleString()}đ</span>
      ),
    },
    {
      title: "VAT (%)",
      dataIndex: "productVat",
      key: "productVat",
      className: "text-[0.8vw]",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      className: "text-[0.8vw]",
    },
    {
      title: "Tình trạng",
      dataIndex: "isAvailable",
      key: "isAvailable",
      className: "text-[0.8vw]",
      render: (value: boolean) =>
        value ? (
          <Tag color="green" className="text-[0.8vw]">
            Còn hàng 
          </Tag>
        ) : (
          <Tag color="red" className="text-[0.8vw]">
            Hết hàng
          </Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      className: "text-[0.8vw]",
      render: (value: boolean) =>
        value ? (
          <Tag color="green" className="text-[0.8vw]">
            Đang kinh doanh
          </Tag>
        ) : (
          <Tag color="red" className="text-[0.8vw]">
            Ngừng kinh doanh
          </Tag>
        ),
    },
  ];

  // Row selection
  const rowSelection: TableProps<MenuItem>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
  };

  return (
    <div className="mt-[0.5vw] custom-table-wrapper">
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
        onReloadMenuList={fetchMenuList}
      />

      {updateData && (
        <MenuUpdateModal
          open={openUpdate}
          data={updateData}
          onClose={() => {
            setOpenUpdate(false);
            setUpdateData(null);
          }}
          onReload={fetchMenuList}
          onFetchDetail={fetchMenuDetail}
        />
      )}
    </div>
  );
};

export default MenuList;