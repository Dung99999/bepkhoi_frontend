import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message, DatePicker, Select } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

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

interface AddressData {
  ProvinceID: number;
  ProvinceName: string;
  DistrictID?: number;
  DistrictName?: string;
  WardName?: string;
}

interface UserUpdateModalProps {
  open: boolean;
  data: User;
  onClose: () => void;
  onSubmit: (userId: number, data: any) => Promise<boolean>;
  addressData?: {
    provinces: AddressData[];
    districts: AddressData[];
    wards: AddressData[];
    fetchDistricts: (provinceId: number) => void;
    fetchWards: (districtId: number) => void;
  };
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({
  open,
  data,
  onClose,
  onSubmit,
  addressData
}) => {
  const [formData, setFormData] = useState<User>({ ...data });
  const [loading, setLoading] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      const parseDate = (dateString: string): string => {
        if (!dateString) return '';
        const formats = [
          'DD/MM/YYYY',
          'YYYY-MM-DD',
          'YYYY-MM-DDTHH:mm:ss',
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        ];

        const parsedDate = moment(dateString, formats, true);
        return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : '';
      };

      setFormData({
        ...data,
        date_of_Birth: parseDate(data.date_of_Birth),
      });
      setSelectedProvinceId(null);
      setSelectedDistrictId(null);
    }
  }, [open, data]);

  useEffect(() => {
    const addressParts = [];
    if (formData.ward_Commune) addressParts.push(formData.ward_Commune);
    if (formData.district) addressParts.push(formData.district);
    if (formData.province_City) addressParts.push(formData.province_City);

    const newAddress = addressParts.join(', ');
    if (newAddress) {
      setFormData(prev => ({ ...prev, address: newAddress }));
    }
  }, [formData.ward_Commune, formData.district, formData.province_City]);

  const handleChange = (key: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleProvinceChange = (value: number) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId(null);
    addressData?.fetchDistricts(value);
    const provinceName = addressData?.provinces.find(p => p.ProvinceID === value)?.ProvinceName || '';
    setFormData(prev => ({
      ...prev,
      province_City: provinceName,
      district: '',
      ward_Commune: ''
    }));
  };

  const handleDistrictChange = (value: number) => {
    setSelectedDistrictId(value);
    addressData?.fetchWards(value);
    const districtName = addressData?.districts.find(d => d.DistrictID === value)?.DistrictName || '';
    setFormData(prev => ({
      ...prev,
      district: districtName,
      ward_Commune: ''
    }));
  };

  const handleWardChange = (value: string) => {
    setFormData(prev => ({ ...prev, ward_Commune: value }));
  };

  const validateForm = () => {
    if (!formData.userName || !formData.userName.trim()) {
      message.error("Tên đăng nhập không được để trống");
      return false;
    }

    if (!formData.email || !formData.email.trim()) {
      message.error("Email không được để trống");
      return false;
    }

    if (!formData.date_of_Birth || !formData.date_of_Birth.trim()) {
      message.error("Năm sinh không được để trống");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Email không đúng định dạng");
      return false;
    }

    if (!formData.phone || !formData.phone.trim()) {
      message.error("Số điện thoại không được để trống");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      message.error("Số điện thoại phải có đúng 10 chữ số");
      return false;
    }

    if (formData.date_of_Birth) {
      const dob = moment(formData.date_of_Birth, 'DD/MM/YYYY', true);
      if (!dob.isValid()) {
        message.error("Ngày sinh không hợp lệ");
        return false;
      }
      if (dob.isAfter(moment(), 'day')) {
        message.error("Ngày sinh không được ở tương lai");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!formData.userId) {
      message.error("Không tìm thấy userId!");
      return;
    }
    setLoading(true);
    const formattedData = {
      email: formData.email,
      phone: formData.phone,
      userName: formData.userName,
      address: formData.address,
      provinceCity: formData.province_City,
      district: formData.district,
      wardCommune: formData.ward_Commune,
      dateOfBirth: formData.date_of_Birth
        ? moment(formData.date_of_Birth, 'DD/MM/YYYY').toISOString()
        : '',
    };

    const success = await onSubmit(formData.userId, formattedData);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT THÔNG TIN NHÂN VIÊN</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input addonBefore="Email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
        <Input addonBefore="Số điện thoại" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
        <Input addonBefore="Tên nhân viên" value={formData.userName} onChange={e => handleChange('userName', e.target.value)} />
        <DatePicker
          placeholder="Chọn ngày sinh"
          value={formData.date_of_Birth ? moment(formData.date_of_Birth, 'DD/MM/YYYY') : null}
          format="DD/MM/YYYY"
          onChange={(date, dateString) => handleChange('date_of_Birth', dateString)}
          onFocus={() => {
            handleChange('date_of_Birth', '');
          }}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
          style={{ width: '100%' }}
        />
        {addressData && (
          <>
            <Select
              placeholder="Chọn Tỉnh/Thành phố"
              value={selectedProvinceId || undefined}
              onChange={handleProvinceChange}
              options={addressData.provinces.map(p => ({
                value: p.ProvinceID,
                label: p.ProvinceName
              }))}
              showSearch
              optionFilterProp="label"
            />

            <Select
              placeholder="Chọn Quận/Huyện"
              value={selectedDistrictId || undefined}
              onChange={handleDistrictChange}
              options={addressData.districts.map(d => ({
                value: d.DistrictID,
                label: d.DistrictName
              }))}
              disabled={!selectedProvinceId}
              showSearch
              optionFilterProp="label"
            />

            <Select
              placeholder="Chọn Phường/Xã"
              value={formData.ward_Commune || undefined}
              onChange={handleWardChange}
              options={addressData.wards.map(w => ({
                value: w.WardName,
                label: w.WardName
              }))}
              disabled={!selectedDistrictId}
              showSearch
              optionFilterProp="label"
            />
          </>
        )}

        <Input
          addonBefore="Địa chỉ"
          value={formData.address}
          readOnly
          onClick={() => {
            if (!formData.address) {
              message.info('Vui lòng chọn đầy đủ thông tin địa chỉ');
            }
          }}
        />

      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={loading}
          style={{
            backgroundColor: "#4096FF",
          }}
        >Lưu</Button>
        <Button
          icon={<CloseOutlined />}
          onClick={onClose}
          disabled={loading}
        >Hủy</Button>
      </div>
    </Modal>
  );
};

export default UserUpdateModal;