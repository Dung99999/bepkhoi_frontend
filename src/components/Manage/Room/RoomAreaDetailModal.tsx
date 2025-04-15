import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface RoomAreaProps {
  roomAreaId: number;
  roomAreaName: string;
  roomAreaNote: string;
  isDelete: boolean;
}

interface RoomAreaDetailModalProps {
  visible: boolean;
  onClose: () => void;
  room?: RoomAreaProps | null;
  loading: boolean;
  onDelete: () => void;
  onEdit?: () => void;
}

const RoomAreaDetailModal: React.FC<RoomAreaDetailModalProps> = ({
  visible,
  onClose,
  room,
  loading,
  onDelete,
  onEdit
}) => {
  return (
    <Modal
      title="Chi tiết khu vực phòng"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {room && (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{room.roomAreaId}</Descriptions.Item>
            <Descriptions.Item label="Tên khu vực">
              {room.roomAreaName}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {room.roomAreaNote || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={room.isDelete ? "red" : "green"}>
                {room.isDelete ? "Đã xóa" : "Hoạt động"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onEdit}
              disabled={!onEdit}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <EditOutlined className="icon-of-menu-list-button mr-2" />
              Cập nhật
            </button>
            <button
              onClick={onDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <DeleteOutlined className="icon-of-menu-list-button mr-2" />
              {loading ? 'Đang xử lý...' : 'Xóa'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RoomAreaDetailModal;