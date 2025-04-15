import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface RoomProps {
  roomId: number;
  roomName: string;
  roomAreaId: number;
  ordinalNumber: number;
  seatNumber: number;
  roomNote: string;
  qrCodeUrl: string | undefined;
  status: boolean;
  isUse: boolean;
  isDelete: boolean;
  roomAreaName?: string;
}

interface RoomDetailModalProps {
  visible: boolean;
  onClose: () => void;
  room?: RoomProps | null;
  loading: boolean;
  onDelete: () => void;
  onEdit?: () => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  visible,
  onClose,
  room,
  loading,
  onDelete,
  onEdit
}) => {
  return (
    <Modal
      title={`Chi tiết phòng ${room?.isDelete ? '(Đã xóa)' : ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {room && (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{room.roomId}</Descriptions.Item>
            <Descriptions.Item label="Tên bàn">
              {room.roomName}
            </Descriptions.Item>
            <Descriptions.Item label="Khu vực">
              {room.roomAreaName || `${room.roomAreaId}`}
            </Descriptions.Item>
            <Descriptions.Item label="Số thứ tự">
              {room.ordinalNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Số chỗ ngồi">
              {room.seatNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {room.roomNote || 'Không có'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={room.isDelete ? "red" : room.status ? "green" : "orange"}>
                {room.isDelete ? "Đã xóa" : room.status ? "Hoạt động" : "Tạm dừng"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div className="flex justify-end gap-4 mt-6">
            {!room.isDelete && (
              <button
                onClick={onEdit}
                disabled={!onEdit}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <EditOutlined className="icon-of-menu-list-button mr-2" />
                Cập nhật
              </button>
            )}
            <button
              onClick={onDelete}
              disabled={loading || room.isDelete}
              className={`px-6 py-2 ${room.isDelete ? 'bg-gray-500' : 'bg-red-500'} text-white rounded hover:${room.isDelete ? 'bg-gray-600' : 'bg-red-600'} disabled:bg-gray-300 disabled:cursor-not-allowed`}
            >
              <DeleteOutlined className="icon-of-menu-list-button mr-2" />
              {room.isDelete ? 'Đã xóa' : (loading ? 'Đang xử lý...' : 'Xóa')}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RoomDetailModal;