import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, DatePicker } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from "../../../context/AuthContext";

interface User {
  userId: number,
  email: string;
  phone: string;
  userName: string;
  address: string;
  province_City: string;
  district: string;
  ward_Commune: string;
  date_of_Birth: string;
}

interface UserUpdateModalProps {
  open: boolean;
  data: User;
  onClose: () => void;
  onReload: () => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ open, data, onClose, onReload }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [formData, setFormData] = useState<User>({ ...data });

  useEffect(() => {
    if (open) {
      setFormData(data);
    }
  }, [open, data]);

  const handleChange = (key: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.userId) {
      message.error("Không tìm thấy userId!");
      return;
    }
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const formattedData = {
      email: formData.email,
      phone: formData.phone,
      userName: formData.userName,
      address: formData.address,
      provinceCity: formData.province_City,
      district: formData.district,
      wardCommune: formData.ward_Commune,
      dateOfBirth: formData.date_of_Birth,
    };

    try {
      console.log("Dữ liệu gửi lên API:", formattedData);

      const response = await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/cashiers/${formData.userId}`,
        formattedData,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authInfo?.token}` } }
      );

      console.log("Phản hồi từ API:", response.data);
      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }
      console.error("Lỗi API:", error.response?.data || error.message);
      message.error(`Cập nhật thất bại! Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT THÔNG TIN NHÂN VIÊN</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input addonBefore="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
        <Input addonBefore="Số điện thoại" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
        <Input addonBefore="Tên đăng nhập" value={formData.userName} onChange={e => handleChange('userName', e.target.value)} />
        <Input addonBefore="Địa chỉ" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
        <Input addonBefore="Tỉnh / Thành phố" value={formData.province_City} onChange={e => handleChange('province_City', e.target.value)} />
        <Input addonBefore="Quận / Huyện" value={formData.district} onChange={e => handleChange('district', e.target.value)} />
        <Input addonBefore="Phường / Xã" value={formData.ward_Commune} onChange={e => handleChange('ward_Commune', e.target.value)} />
        <DatePicker
          value={formData.date_of_Birth ? moment(formData.date_of_Birth) : undefined}
          onChange={(date, dateString) => handleChange('date_of_Birth', dateString)}
          format="YYYY-MM-DD"
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          style={{
            backgroundColor: "#4096FF",
          }}
        >Lưu</Button>
        <Button
          icon={<CloseOutlined />}
          onClick={onClose}
        >Hủy</Button>
      </div>
    </Modal>
  );
};

export default UserUpdateModal;