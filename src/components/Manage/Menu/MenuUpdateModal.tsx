import React, { useState, useEffect } from 'react';
import { Modal, Input, InputNumber, Upload, Button, message, Switch, Select } from 'antd';
import { UploadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface MenuItem {
  productId: number;
  productName: string;
  productCategoryId: number;
  costPrice: number;
  sellPrice: number;
  salePrice: number;
  productVat: number;
  description: string;
  unitId: number;
  isAvailable: boolean;
  status: boolean;
  isDelete: boolean;
  image?: string;
}

interface MenuUpdateModalProps {
  open: boolean;
  data: MenuItem;
  onClose: () => void;
  onReload: () => void;
}

const MenuUpdateModal: React.FC<MenuUpdateModalProps> = ({ open, data, onClose, onReload }) => {
  const [formData, setFormData] = useState<MenuItem>({ ...data });
  const [emptyField, setEmptyField] = useState<string>('');

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        productId: data.productId,
        status: Boolean(data.status),
      }));
    }
  }, [open, data]);

  const handleChange = (key: keyof MenuItem, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const requiredFields: (keyof MenuItem)[] = ['productName', 'costPrice', 'salePrice'];
    for (let field of requiredFields) {
      const value = formData[field];
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        setEmptyField(field as string);
        return false;
      }
    }
    setEmptyField('');
    return true;
  };

  const handleSubmit = async () => {
    console.log("Đang gọi handleSubmit...");
    if (!validateForm()) {
      message.warning(`Trường "${emptyField}" không được để trống!`);
      return;
    }

    Modal.confirm({
      title: 'Xác nhận cập nhật',
      content: 'Bạn có chắc chắn muốn cập nhật món ăn này?',
      okButtonProps: { style: { backgroundColor: "#4096FF", borderColor: "#4096FF", color: "#fff" } },
      onOk: async () => {
        console.log("Xác nhận cập nhật, gửi API...");
        try {
            const res = await axios.put(
                `https://localhost:7257/api/Menu/update-menu/${formData.productId}`,
                formData, 
                { headers: { 'Content-Type': 'application/json' } }
              );
              console.log("Phản hồi từ API:", res.data);
          message.success('Cập nhật thành công!');
          onClose();
          onReload();
        } catch (error) {
            console.error("Lỗi API:", error);
          message.error('Cập nhật thất bại!');
        }
      }
    });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT MÓN ĂN</h2>
      <h2 className="text-xl font-bold">Mã sản phẩm: {data.productId}</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input required addonBefore="Tên món ăn" value={formData.productName} onChange={e => handleChange('productName', e.target.value)} />
        <Select value={formData.productCategoryId} onChange={value => handleChange('productCategoryId', value)}>
          <Option value={1}>Đồ ăn</Option>
          <Option value={2}>Đồ ăn nhanh</Option>
          <Option value={3}>Đồ uống</Option>
        </Select>
        <InputNumber required addonBefore="Giá vốn" value={formData.costPrice} onChange={value => handleChange('costPrice', value)} className="w-full" />
        <InputNumber required addonBefore="Giá bán" value={formData.salePrice} onChange={value => handleChange('salePrice', value)} className="w-full" />
        <InputNumber required addonBefore="VAT (%)" value={formData.productVat} onChange={value => handleChange('productVat', value)} className="w-full" />

        <div className="flex items-center">
          <span>Hiển thị:</span>
          <Switch checked={formData.status} onChange={checked => handleChange('status', checked)} className="ml-2" />
        </div>

        <Input.TextArea required value={formData.description} onChange={e => handleChange('description', e.target.value)} rows={2} />
        <div className="flex items-center">
          <span>Còn hàng:</span>
          <Switch checked={formData.isAvailable} onChange={checked => handleChange('isAvailable', checked)} className="ml-2" />
        </div>
      </div>

        <Upload
              action="#"
              listType="picture"
              maxCount={1}
              defaultFileList={formData.image ? [{ uid: '-1', name: 'image.jpg', url: formData.image }] : []}
          >
              <Button icon={<UploadOutlined />}>Upload Ảnh</Button>
        </Upload>

      <div className="flex justify-end gap-4 mt-6">

              <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "#4096FF",
                  }}
              >
                  Lưu
              </Button>
              <Button 
                icon={<CloseOutlined />} 
                onClick={onClose}
              >
                Hủy
              </Button>
      </div>
    </Modal>
  );
};

export default MenuUpdateModal;
