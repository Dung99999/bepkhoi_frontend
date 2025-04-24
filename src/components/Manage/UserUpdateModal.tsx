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
  const [isInfoMode, setIsInfoMode] = useState(true);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
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

  const submitInfo = async () => {
    if (!formData || !userId) return;
    try {
      await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}update-user/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch {
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
      await axios.post(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Passwords/change-password`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      width="40vw"
      centered
      destroyOnClose
    >
      <h2 className="text-xl font-bold text-center">
        CẬP NHẬT THÔNG TIN CÁ NHÂN
      </h2>

      <div className="flex justify-center items-center gap-4 mt-4 select-none">
        <span
          className={`text-sm font-medium cursor-pointer transition-colors ${isInfoMode ? "text-blue-600" : "text-gray-500"
            }`}
          onClick={() => setIsInfoMode(true)}
        >
          Thông tin
        </span>

        <div
          className="relative w-12 h-6 bg-gray-300 rounded-full cursor-pointer"
          onClick={() => setIsInfoMode(!isInfoMode)}
        >
          <div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
            style={{ left: isInfoMode ? "2px" : "calc(100% - 22px)" }}
          />
        </div>

        <span
          className={`text-sm font-medium cursor-pointer transition-colors ${!isInfoMode ? "text-blue-600" : "text-gray-500"
            }`}
          onClick={() => setIsInfoMode(false)}
        >
          Mật khẩu
        </span>
      </div>



      {loading || !formData ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : isInfoMode ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            addonBefore="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            addonBefore="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            addonBefore="Tên đăng nhập"
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
          <DatePicker
            value={
              formData.date_of_Birth
                ? moment(formData.date_of_Birth)
                : undefined
            }
            onChange={(d, s) => handleChange("date_of_Birth", s)}
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
          />
          <Select
            value={formData.province_City}
            onChange={(v, o: any) => {
              handleChange("province_City", o.children);
              fetchDistricts(o.value);
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
            onChange={(v, o: any) => {
              handleChange("district", o.children);
              fetchWards(o.value);
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
            onChange={(v, o: any) =>
              handleChange("ward_Commune", o.children)
            }
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
      ) : (
        <div className="flex flex-col items-center gap-3 mt-4">
          <Input.Password
            className="w-80 h-9 text-sm"
            placeholder="Mật khẩu cũ"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <Input.Password
            className="w-80 h-9 text-sm"
            placeholder="Mật khẩu mới"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <Input.Password
            className="w-80 h-9 text-sm"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

      )}

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
        <Button
          type="primary"
          className="bg-blue-400"
          icon={<SaveOutlined />}
          onClick={isInfoMode ? submitInfo : submitPassword}
        >
          Lưu
        </Button>
        <Button icon={<CloseOutlined />} onClick={onClose}>
          Hủy
        </Button>
      </div>
    </Modal>
  );
};

export default UserUpdateModal;
