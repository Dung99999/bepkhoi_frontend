import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import './../Menu/MenuList.css';
import ShipperDetailModal from "./ShipperDetailModal";
import UserUpdateModal from "./UserUpdateModal";

interface UserListProps {
  search: string;
  status: string;
}

interface UserProps {
  userId: number;
  userName: string;
  phone: string;
  status: string;
  email: string;
  date_of_Birth: string;
  address: string;
  ward_Commune: string;
  district: string;
  province_City: string;
  roleName: string;
}

const UserList: React.FC<UserListProps> = ({ search, status }) => {
  const [items, setItems] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<UserProps | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState<UserProps | null>(null);

  const fetchMenuList = () => {
    setLoading(true);
    let apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/Shipper/search?searchTerm=${encodeURIComponent(search.trim())}`;
    if (status === "1" || status === "0") {
      const statusValue = status === "1" ? "true" : "false";
      apiUrl += `&status=${statusValue}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setItems(data ?? []);
        setTotal(data.length || 0);
      })
      .catch((error) => {
        console.error("Error fetching: ", error);
        setItems([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenUpdate = (record: UserProps) => {
    setUpdateData(record);
    setOpenUpdate(true);
  };
  useEffect(() => {
    fetchMenuList();
  }, [search, status, page]);

  const handleRowClick = (record: UserProps) => {
    setOpenDetail(true);
    setLoadingDetail(true);

    fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Shipper/${record.userId}`)
      .then((response) => response.json())
      .then((res) => setDetailData(res))
      .catch((error) => console.error("Error fetching detail:", error))
      .finally(() => setLoadingDetail(false));
  }

  const columns: TableColumnsType<UserProps> = [
    { title: "ID", dataIndex: "userId", key: "userId", width: 60 },
    { title: "Tên nhân viên", dataIndex: "userName", key: "userName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: boolean) =>
        value ? <Tag color="green">Đang sử dụng</Tag> : <Tag color="red">Ngừng sử dụng</Tag>,
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table<UserProps>
        rowKey="userId"
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

      <ShipperDetailModal
        open={openDetail}
        loading={loadingDetail}
        data={detailData}
        onClose={() => setOpenDetail(false)}
        onUpdate={() => {
          if (!detailData) {
            message.warning("Không có dữ liệu nhân viên để cập nhật!");
            return;
          }
          handleOpenUpdate(detailData);
        }}
        onReloadUserList={fetchMenuList}
      />
      {openUpdate && updateData && (
        <UserUpdateModal
          open={openUpdate}
          data={updateData}
          onClose={() => {
            setOpenUpdate(false);
            setUpdateData(null);
          }}
          onReload={fetchMenuList}
        />
      )}
    </div>
  );
};

export default UserList;
