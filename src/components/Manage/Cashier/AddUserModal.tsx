import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<boolean>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      title="Thêm Nhân Viên Quầy"
      open={visible}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      footer={null}
      width="30%"
      destroyOnClose
    >
      <div className="space-y-4">
        <div>
          <label>Tên nhân viên:</label>
          <Input
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <Input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <label>Số điện thoại:</label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <label>Mật khẩu:</label>
          <Input.Password
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            className="bg-green-600 text-white px-6 py-2 rounded-md"
            onClick={handleSubmit}
            loading={loading}
          >
            Lưu
          </Button>
          <Button
            className="bg-gray-300 px-6 py-2 rounded-md"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={loading}
          >
            Bỏ qua
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;