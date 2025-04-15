import React from "react";
import { Modal, Input, Button, Form, InputNumber, Select } from "antd";

interface AddRoomModalProps {
  visible: boolean;
  onClose: () => void;
  roomAreas: {
    roomAreaId: number;
    roomAreaName: string;
  }[];
  onSubmit: (values: {
    roomName: string;
    roomAreaId: number;
    ordinalNumber: number;
    seatNumber: number;
    roomNote: string;
  }) => void;
  loading?: boolean;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  visible,
  onClose,
  roomAreas,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thêm Phòng Mới"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width="30%"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="roomName"
          label="Tên bàn"
          rules={[
            { required: true, message: "Vui lòng nhập tên bàn" },
            { max: 100, message: "Tên phòng không quá 100 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên bàn" />
        </Form.Item>

        <Form.Item
          name="roomAreaId"
          label="Khu vực"
          rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
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
          rules={[{ required: true, message: "Vui lòng nhập số thứ tự" }]}
        >
          <InputNumber className="w-full" min={1} placeholder="Nhập số thứ tự" />
        </Form.Item>

        <Form.Item
          name="seatNumber"
          label="Số chỗ ngồi"
          rules={[{ required: true, message: "Vui lòng nhập số chỗ ngồi" }]}
        >
          <InputNumber className="w-full" min={1} placeholder="Nhập số chỗ ngồi" />
        </Form.Item>

        <Form.Item
          name="roomNote"
          label="Ghi chú"
          rules={[{ max: 500, message: "Ghi chú không quá 500 ký tự" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
        </Form.Item>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Lưu
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            disabled={loading}
            className="bg-gray-300 px-6 py-2 rounded-md"
          >
            Bỏ qua
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRoomModal;