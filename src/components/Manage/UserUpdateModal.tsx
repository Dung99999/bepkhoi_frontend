import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message, DatePicker, Spin } from "antd";
import { SaveOutlined, CloseOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

interface User {
  userId: number;
  email: string;
  phone: string;
  userName: string;
  address: string;
  province_City: string;
  district: string;
  ward_Commune: string;
  date_of_Birth: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
}

const UserUpdateModal: React.FC<Props> = ({ open, onClose, onReload }) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (open && userId) {
      fetchUserData(userId);
    }
  }, [open]);

  const fetchUserData = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_APP_ENDPOINT}get-user-by-id/${id}`);
      const user = response.data.data;
      setFormData({
        ...user,
        date_of_Birth: user.date_of_Birth ? moment(user.date_of_Birth).format("YYYY-MM-DD") : "",
      });
    } catch (error: any) {
      message.error("Không thể tải dữ liệu người dùng!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof User, value: any) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSubmit = async () => {
    if (!formData || !userId) return;

    const payload = {
      userName: formData.userName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      province_City: formData.province_City,
      district: formData.district,
      ward_Commune: formData.ward_Commune,
      date_of_Birth: formData.date_of_Birth,
    };

    try {
      await axios.put(`${process.env.REACT_APP_API_APP_ENDPOINT}update-user/${userId}`, payload);
      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      message.error("Cập nhật thất bại!");
      console.error(error);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT THÔNG TIN CÁ NHÂN</h2>

      {loading || !formData ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input addonBefore="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
            <Input addonBefore="Số điện thoại" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            <Input addonBefore="Tên đăng nhập" value={formData.userName} onChange={(e) => handleChange("userName", e.target.value)} />
            <Input addonBefore="Địa chỉ" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
            <Input addonBefore="Tỉnh / Thành phố" value={formData.province_City} onChange={(e) => handleChange("province_City", e.target.value)} />
            <Input addonBefore="Quận / Huyện" value={formData.district} onChange={(e) => handleChange("district", e.target.value)} />
            <Input addonBefore="Phường / Xã" value={formData.ward_Commune} onChange={(e) => handleChange("ward_Commune", e.target.value)} />
            <DatePicker
              value={formData.date_of_Birth ? moment(formData.date_of_Birth) : undefined}
              onChange={(date, dateString) => handleChange("date_of_Birth", dateString)}
              format="YYYY-MM-DD"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="primary"
              className="bg-blue-300 hover:bg-gray-500"
              icon={<KeyOutlined />}
              onClick={() => {
                localStorage.clear(); // Xóa toàn bộ localStorage
                navigate("/login"); // Redirect sang /login
              }}
            >
              Đăng Xuất
            </Button>
            <Button type="primary" className="bg-blue-400" icon={<SaveOutlined />} onClick={handleSubmit}>
              Lưu
            </Button>
            <Button icon={<CloseOutlined />} onClick={onClose}>
              Hủy
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default UserUpdateModal;
