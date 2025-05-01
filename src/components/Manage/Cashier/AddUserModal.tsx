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

  const validateForm = () => {
    if (!formData.userName.trim()) {
      message.error("Tên nhân viên không được để trống!");
      return false;
    }

    if (!formData.email.trim()) {
      message.error("Email không được để trống!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Email không đúng định dạng!");
      return false;
    }

    if (!formData.phone.trim()) {
      message.error("Số điện thoại không được để trống!");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      message.error("Số điện thoại phải có 10 chữ số!");
      return false;
    }

    if (!formData.password.trim()) {
      message.error("Mật khẩu không được để trống!");
      return false;
    }

    if (formData.password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
            placeholder="Nhập tên nhân viên"
          />
        </div>

        <div>
          <label>Email:</label>
          <Input
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <div>
          <label>Số điện thoại:</label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Nhập số điện thoại"
            maxLength={10}
          />
        </div>

        <div>
          <label>Mật khẩu:</label>
          <Input.Password
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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