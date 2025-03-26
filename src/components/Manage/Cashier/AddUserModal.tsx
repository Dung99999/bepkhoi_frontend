import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/cashiers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Nhân viên đã được thêm thành công!");
        onClose();
      } else {
        message.error(result.message || "Lỗi khi thêm nhân viên");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server");
    }
  };

  return (
    <Modal
      title="Thêm Nhân Viên Quầy"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
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
          <Button className="bg-green-600 text-white px-6 py-2 rounded-md" onClick={handleSubmit}>
            Lưu
          </Button>
          <Button className="bg-gray-300 px-6 py-2 rounded-md" onClick={onClose}>
            Bỏ qua
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
