import React from "react";
import { Modal, Input, Button, Form } from "antd";

interface AddRoomAreaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { roomAreaName: string; roomAreaNote: string }) => void;
  loading?: boolean;
}

const AddRoomAreaModal: React.FC<AddRoomAreaModalProps> = ({ 
  visible, 
  onClose,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thêm Khu Vực Phòng Mới"
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
          name="roomAreaName"
          label="Tên khu vực"
          rules={[
            { required: true, message: "Vui lòng nhập tên khu vực" },
            { max: 100, message: "Tên khu vực không quá 100 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên khu vực phòng" />
        </Form.Item>

        <Form.Item
          name="roomAreaNote"
          label="Ghi chú"
          rules={[
            { required: true, message: "Vui lòng nhập tên khu vực" },
            { max: 500, message: "Ghi chú không quá 500 ký tự" }
          ]}
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

export default AddRoomAreaModal;