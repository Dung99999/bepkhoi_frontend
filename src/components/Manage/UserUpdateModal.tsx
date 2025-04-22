import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message, DatePicker, Spin, Select } from "antd";
import { SaveOutlined, CloseOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
const token = localStorage.getItem("Token");
const { Option } = Select;

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
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const userId = localStorage.getItem("UserId");
  const navigate = useNavigate();

  const ghnToken = process.env.REACT_APP_GHN_TOKEN;

  useEffect(() => {
    if (open && userId) {
      fetchUserData(userId);
      fetchProvinces();
    }
  }, [open]);

  const fetchUserData = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_APP_ENDPOINT}get-user-by-id/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );
      const user = response.data.data;
      setFormData({
        ...user,
        date_of_Birth: user.date_of_Birth ? moment(user.date_of_Birth).format("YYYY-MM-DD") : "",
      });
    } catch (error) {
      message.error("Không thể tải dữ liệu người dùng!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: ghnToken || "" },
      });
      setProvinces(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy tỉnh/thành:", err);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const res = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: provinceId },
        { headers: { Token: ghnToken || "" } }
      );
      setDistricts(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy quận/huyện:", err);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const res = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        { headers: { Token: ghnToken || "" } }
      );
      setWards(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy phường/xã:", err);
    }
  };

  const handleChange = (key: keyof User, value: any) => {
    if (!formData) return;
    const updated = { ...formData, [key]: value };
    if (key === "ward_Commune" || key === "district" || key === "province_City") {
      updated.address = `${updated.ward_Commune || ""}, ${updated.district || ""}, ${updated.province_City || ""}`;
    }
    setFormData(updated);
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
      await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}update-user/${userId}`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error) {
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
            <DatePicker
              value={formData.date_of_Birth ? moment(formData.date_of_Birth) : undefined}
              onChange={(date, dateString) => handleChange("date_of_Birth", dateString)}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
            <Select
              value={formData.province_City}
              onChange={(val, option: any) => {
                handleChange("province_City", option.children);
                fetchDistricts(option.value);
              }}
              placeholder="Tỉnh / Thành phố"
            >
              {provinces.map((p) => (
                <Option key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </Option>
              ))}
            </Select>
            <Select
              value={formData.district}
              onChange={(val, option: any) => {
                handleChange("district", option.children);
                fetchWards(option.value);
              }}
              placeholder="Quận / Huyện"
            >
              {districts.map((d) => (
                <Option key={d.DistrictID} value={d.DistrictID}>
                  {d.DistrictName}
                </Option>
              ))}
            </Select>
            <Select
              value={formData.ward_Commune}
              onChange={(val, option: any) => handleChange("ward_Commune", option.children)}
              placeholder="Phường / Xã"
            >
              {wards.map((w) => (
                <Option key={w.WardCode} value={w.WardCode}>
                  {w.WardName}
                </Option>
              ))}
            </Select>
            <Input addonBefore="Địa chỉ" value={formData.address} disabled />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="primary"
              className="bg-blue-300 hover:bg-gray-500"
              icon={<KeyOutlined />}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
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
