import React from "react";
import { Table, Tag, Empty, TableProps } from "antd";
import type { ColumnsType, SorterResult } from "antd/es/table/interface";

interface RoomAreaProps {
  roomAreaId: number;
  roomAreaName: string;
  roomAreaNote: string;
  isDelete: boolean;
}

interface RoomAreaListProps {
  data: RoomAreaProps[];
  loading: boolean;
  onRowClick: (record: RoomAreaProps) => void;
}

const RoomAreaList: React.FC<RoomAreaListProps> = ({
  data = [],
  loading,
  onRowClick,
}) => {
  const columns: ColumnsType<RoomAreaProps> = [
    {
      title: "ID",
      dataIndex: "roomAreaId",
      key: "roomAreaId",
      width: 80,
      render: (id) => <span className="font-mono">#{id}</span>,
    },
    {
      title: "Tên khu vực",
      dataIndex: "roomAreaName",
      key: "roomAreaName",
    },
    {
      title: "Ghi chú",
      dataIndex: "roomAreaNote",
      key: "roomAreaNote",
      render: (note) => note || <span className="text-gray-400">Không có</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isDelete",
      key: "status",
      width: 120,
      render: (isDelete: boolean) => (
        <Tag color={isDelete ? "red" : "green"} className="capitalize">
          {isDelete ? "Đã xóa" : "Hoạt động"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="mt-4 custom-table-wrapper bg-white rounded-lg shadow">
      <Table<RoomAreaProps>
        rowKey="roomAreaId"
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
          className: "cursor-pointer hover:bg-gray-50",
        })}
        className="custom-table"
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default RoomAreaList;