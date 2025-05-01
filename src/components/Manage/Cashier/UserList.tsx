import React from "react";
import { Table, Tag, Button, Space } from "antd";
import type { TableColumnsType } from "antd";
import "./../Menu/MenuList.css";

interface UserListProps {
  items: any[];
  loading: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick: (record: any) => void;
  onUpdateStatus: (userId: number, currentStatus: boolean) => void;
}

const UserList: React.FC<UserListProps> = ({
  items,
  loading,
  page,
  total,
  onPageChange,
  onRowClick,
  onUpdateStatus,
}) => {
  const columns: TableColumnsType<any> = [
    { title: "ID", dataIndex: "userId", key: "userId", width: 60 },
    { title: "Tên nhân viên", dataIndex: "userName", key: "userName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: 'center',
      render: (value: boolean, record: any) => (
        <Space align="center">
          <Tag color={value ? "green" : "red"}>
            {value ? "Đang sử dụng" : "Ngừng sử dụng"}
          </Tag>
          <Button 
            size="small" 
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(record.userId, value);
            }}
            style={{
              color: value ? '#ff4d4f' : '#52c41a',
              border: `1px solid ${value ? '#ff4d4f' : '#52c41a'}`,
              marginLeft: 8
            }}
          >
            {value ? "Ngừng" : "Kích hoạt"}
          </Button>
        </Space>
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