import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import "./PriceMenuList.css";
import ModalSettingPriceById from "./ModalSettingPriceById";
import { EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";

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

const PriceMenuList: React.FC<PriceMenuListProps> = ({
  search,
  category,
  menuStatus,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [items, setItems] = useState<PriceMenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PriceMenuItem | null>(null);

  const createQueryParams = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("productNameOrId", search.trim());
    if (category.length > 0 && !category.includes("all"))
      params.append("categoryId", category[0]);
    if (menuStatus !== "all") params.append("status", menuStatus);
    params.append("sortBy", "ProductId");
    params.append("sortDirection", "asc");
    return params.toString();
  };

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData();
  }, [search, category, menuStatus, page, authInfo.token]);

  const handleOpenModal = (record: PriceMenuItem) => {
    setSelectedItem(record);
    setOpenModal(true);
  };

  const columns: TableColumnsType<PriceMenuItem> = [
    {
      title: <span className="text-[0.95vw] font-semibold">Mã hàng hóa</span>,
      dataIndex: "productId",
      key: "productId",
      width: "8vw",
      render: (text) => <span className="text-[0.9vw]">{text}</span>,
    },
    {
      title: <span className="text-[0.95vw] font-semibold">Tên hàng</span>,
      dataIndex: "productName",
      key: "productName",
      width: "20vw",
      render: (text) => (
        <span className="font-medium text-[0.9vw]">{text}</span>
      ),
    },
    {
      title: <span className="text-[0.95vw] font-semibold">Giá vốn</span>,
      dataIndex: "costPrice",
      key: "costPrice",
      width: "12vw",
      render: (price) => (
        price != null
        ? <span className="text-[0.9vw]">{price.toLocaleString()}đ</span>
        : <span className="text-[0.9vw] text-gray-400 italic">--</span>
      ),
    },
    {
      title: <span className="text-[0.95vw] font-semibold">Đơn giá</span>,
      dataIndex: "sellPrice",
      key: "sellPrice",
      width: "12vw",
      render: (price) => (
        price != null
        ? <span className="text-[0.9vw]">{price.toLocaleString()}đ</span>
        : <span className="text-[0.9vw] text-gray-400 italic">--</span>
      ),
    },
    {
      title: <span className="text-[0.95vw] font-semibold">Giá sau KM</span>,
      dataIndex: "salePrice",
      key: "salePrice",
      width: "12vw",
      render: (price) => (
        price != null
        ? <span className="text-[0.9vw]">{price.toLocaleString()}đ</span>
        : <span className="text-[0.9vw] text-gray-400 italic">--</span>
      ),
    },
    {
      title: <span className="text-[0.95vw] font-semibold">Chỉnh sửa</span>,
      key: "action",
      width: "10vw",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="edit-button text-[0.9vw] flex items-center"
        >
          <EditOutlined className="mr-[0.5vw]" /> Cập nhật
        </button>
      ),
    },
  ];

  return (
    <div className="mt-[1vw] custom-table-wrapper">
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
          className: "custom-pagination text-[0.9vw]",
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => (
            <span className="text-[0.9vw]">Tổng {total} mục</span>
          ),
          itemRender: (_, type, originalElement) => {
            if (type === "prev") {
              return <LeftOutlined className="text-[0.9vw]" />;
            }
            if (type === "next") {
              return <RightOutlined className="text-[0.9vw]" />;
            }
            return <div className="text-[0.9vw]">{originalElement}</div>;
          },
        }}
        locale={{
          emptyText: (
            <span className="text-[0.9vw]">Không có dữ liệu phù hợp.</span>
          ),
        }}
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
