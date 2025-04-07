import React, { useState } from "react";
import { Table, Tag, Empty, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

interface RoomProps {
  roomId: number;
  roomName: string;
  roomAreaId: number;
  ordinalNumber: number;
  seatNumber: number;
  roomNote: string;
  status: boolean;
  isUse: boolean;
  isDelete: boolean;
  qrCodeUrl: string | undefined;
}

interface RoomListProps {
  data: RoomProps[];
  loading: boolean;
  onRowClick: (record: RoomProps, action?: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({
  data = [],
  loading,
  onRowClick,
}) => {
  const columns: ColumnsType<RoomProps> = [
    {
      title: "ID",
      dataIndex: "roomId",
      key: "roomId",
      width: 80,
      render: (id) => <span className="font-mono">#{id}</span>,
    },
    {
      title: "Tên bàn",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Khu vực",
      dataIndex: "roomAreaName",
      key: "roomAreaName",
    },
    {
      title: "Số chỗ",
      dataIndex: "seatNumber",
      key: "seatNumber",
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag color={record.isDelete ? "red" : record.status ? "green" : "orange"}>
          {record.isDelete ? "Đã xóa" : record.status ? "Hoạt động" : "Tạm dừng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(record, 'qr');
          }}
        >
          Quản lý QR
        </Button>
      ),
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper bg-white rounded-lg shadow">
      <Table<RoomProps>
        rowKey="roomId"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          total: data.length,
        }}
        locale={{
          emptyText: (
            <Empty
              description={loading ? "Đang tải..." : "Không có dữ liệu"}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          className: `cursor-pointer hover:bg-gray-50 ${record.isDelete ? 'opacity-60' : ''}`,
        })}
        className="custom-table"
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default RoomList;