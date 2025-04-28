import React, { useEffect, useState } from "react";
import { Modal, Input, Button, message, DatePicker, Spin, Select } from "antd";
import { SaveOutlined, CloseOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
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
  const { authInfo, clearAuthInfo } = useAuth()
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isInfoMode, setIsInfoMode] = useState(true);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const userId = authInfo.userId;
  const navigate = useNavigate();
  const ghnToken = process.env.REACT_APP_GHN_TOKEN;

  useEffect(() => {
    if (open && userId) {
      fetchUserData(userId);
      fetchProvinces();
    }
  }, [open, userId]);

  const fetchUserData = async (id: string) => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Manager/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      const user = response.data;
      setFormData({
        userId: user.userId,
        email: user.email,
        phone: user.phone,
        userName: user.userName,
        address: user.address,
        province_City: user.province_City,
        district: user.district,
        ward_Commune: user.ward_Commune,
        date_of_Birth: user.date_of_Birth
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

  const submitInfo = async () => {
    if (!formData || !userId) return;
    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        userName: formData.userName,
        address: formData.address,
        provinceCity: formData.province_City,
        district: formData.district,
        wardCommune: formData.ward_Commune,
        dateOfBirth: formData.date_of_Birth
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Manager/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${authInfo.token}` } }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    }
  };

  const submitPassword = async () => {
    if (!formData) return;
    if (newPass !== confirmPass) {
      message.error("Xác nhận mật khẩu không khớp!");
      return;
    }

    const payload = {
      email: formData.email,
      oldPassword: oldPass,
      newPassword: newPass,
      rePassword: confirmPass,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Passwords/change-password`,
        payload,
        { headers: { Authorization: `Bearer ${authInfo.token}` } }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      message.success("Đổi mật khẩu thành công!");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setIsInfoMode(true);
    } catch {
      message.error("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
      className="user-update-modal"
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
          CẬP NHẬT THÔNG TIN CÁ NHÂN
        </h2>

        {/* Toggle switch */}
        <div className="flex justify-center items-center mb-8">
          <button
            className={`px-4 py-2 rounded-l-lg font-medium ${isInfoMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsInfoMode(true)}
          >
            Thông tin
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-medium ${!isInfoMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsInfoMode(false)}
          >
            Mật khẩu
          </button>
        </div>

        {loading || !formData ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : isInfoMode ? (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                <Input
                  value={formData.userName}
                  onChange={(e) => handleChange("userName", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <DatePicker
                  value={formData.date_of_Birth ? moment(formData.date_of_Birth) : undefined}
                  onChange={(d, s) => handleChange("date_of_Birth", s)}
                  format="YYYY-MM-DD"
                  className="w-full"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Địa chỉ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                  <Select
                    value={formData.province_City}
                    onChange={(v, o: any) => {
                      handleChange("province_City", o.children);
                      fetchDistricts(o.value);
                    }}
                    className="w-full"
                  >
                    {provinces.map((p) => (
                      <Option key={p.ProvinceID} value={p.ProvinceID}>
                        {p.ProvinceName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <Select
                    value={formData.district}
                    onChange={(v, o: any) => {
                      handleChange("district", o.children);
                      fetchWards(o.value);
                    }}
                    className="w-full"
                  >
                    {districts.map((d) => (
                      <Option key={d.DistrictID} value={d.DistrictID}>
                        {d.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                  <Select
                    value={formData.ward_Commune}
                    onChange={(v, o: any) => handleChange("ward_Commune", o.children)}
                    className="w-full"
                  >
                    {wards.map((w) => (
                      <Option key={w.WardCode} value={w.WardCode}>
                        {w.WardName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <Input value={formData.address} disabled className="w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
              <Input.Password
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <Input.Password
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
              <Input.Password
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-8">
          <Button
            icon={<KeyOutlined />}
            onClick={() => clearAuthInfo()}
            className="flex items-center bg-red-500 hover:bg-red-600"
          >
            Đăng xuất
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={isInfoMode ? submitInfo : submitPassword}
            className="flex items-center bg-blue-500 hover:bg-blue-600"
          >
            Lưu thay đổi
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={onClose}
            className="flex items-center"
          >
            Hủy
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default UserUpdateModal;
