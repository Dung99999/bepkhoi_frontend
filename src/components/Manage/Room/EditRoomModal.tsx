import React from "react";
import { Form, Input, Modal, Button, InputNumber, Select } from "antd";

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
}

interface RoomArea {
  roomAreaId: number;
  roomAreaName: string;
}

interface EditRoomModalProps {
  visible: boolean;
  onClose: () => void;
  room?: RoomProps | null;
  roomAreas: RoomArea[];
  loading: boolean;
  onSubmit: (values: {
    roomName: string;
    roomAreaId: number;
    ordinalNumber: number;
    seatNumber: number;
    roomNote: string;
    status: boolean;
  }) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({
  visible,
  onClose,
  room,
  roomAreas,
  loading,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (room) {
      form.setFieldsValue({
        roomName: room.roomName,
        roomAreaId: room.roomAreaId,
        ordinalNumber: room.ordinalNumber,
        seatNumber: room.seatNumber,
        roomNote: room.roomNote,
        status: room.status,
      });
    }
  }, [room, form]);

  return (
    <Modal
      title="Cập nhật thông tin bàn"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="roomName"
          label="Tên bàn"
          rules={[{ required: true, message: 'Vui lòng nhập tên bàn' }]}
        >
          <Input placeholder="Nhập tên bàn" />
        </Form.Item>

        <Form.Item
          name="roomAreaId"
          label="Khu vực"
          rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
        >
          <Select placeholder="Chọn khu vực">
            {roomAreas.map(area => (
              <Select.Option key={area.roomAreaId} value={area.roomAreaId}>
                {area.roomAreaName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ordinalNumber"
          label="Số thứ tự"
          rules={[{ required: true, message: 'Vui lòng nhập số thứ tự' }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item
          name="seatNumber"
          label="Số chỗ ngồi"
          rules={[{ required: true, message: 'Vui lòng nhập số chỗ ngồi' }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>

        <Form.Item
          name="roomNote"
          label="Ghi chú"
        >
          <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={2} />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value={true}>Hoạt động</Select.Option>
            <Select.Option value={false}>Tạm dừng</Select.Option>
          </Select>
        </Form.Item>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
          >
            Lưu
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            disabled={loading}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md"
          >
            Bỏ qua
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditRoomModal;