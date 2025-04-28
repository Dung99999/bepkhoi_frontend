import React from "react";
import { Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import "./../Menu/MenuList.css";

interface UserListProps {
  items: any[];
  loading: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick: (record: any) => void;
}

const UserList: React.FC<UserListProps> = ({
  items,
  loading,
  page,
  total,
  onPageChange,
  onRowClick,
}) => {
  const columns: TableColumnsType<any> = [
    { title: "ID", dataIndex: "userId", key: "userId", width: 60 },
    { title: "Tên nhân viên", dataIndex: "userName", key: "userName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: boolean) =>
        value ? (
          <Tag color="green">Đang sử dụng</Tag>
        ) : (
          <Tag color="red">Ngừng sử dụng</Tag>
        ),
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper">
      <Table
        rowKey="userId"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{
          pageSize: 10,
          total: total,
          current: page,
          onChange: onPageChange,
        }}
        locale={{ emptyText: "Không có dữ liệu phù hợp." }}
        className="custom-table"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
    </div>
  );
};

export default UserList;