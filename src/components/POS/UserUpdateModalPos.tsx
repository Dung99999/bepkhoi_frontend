import React, { useEffect, useState, useCallback } from "react";
import { Modal, Input, Button, message, DatePicker, Spin, Select } from "antd";
import { SaveOutlined, CloseOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

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

interface UpdateCashierDTO {
  email: string;
  phone: string;
  userName: string;
  address: string;
  provinceCity: string;
  district: string;
  wardCommune: string;
  dateOfBirth: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
}

const UserUpdateModalPos: React.FC<Props> = ({ open, onClose, onReload }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isInfoMode, setIsInfoMode] = useState(true);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();
  const ghnToken = process.env.REACT_APP_GHN_TOKEN;

  const fetchUserData = useCallback(
    async (id: string) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_APP_ENDPOINT}get-user-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authInfo.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          clearAuthInfo();
          message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
          return;
        }

        const user = response.data.data;
        setFormData({
          ...user,
          date_of_Birth: user.date_of_Birth ? moment(user.date_of_Birth).format("YYYY-MM-DD") : "",
        });
      } catch (error: any) {
        if (error.response?.status === 401) {
          clearAuthInfo();
          message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          message.error("Không thể tải dữ liệu người dùng!");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [authInfo?.token, clearAuthInfo]
  );

  const fetchProvinces = useCallback(async () => {
    try {
      const res = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: ghnToken || "" },
      });
      setProvinces(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy tỉnh/thành:", err);
    }
  }, [ghnToken]);

  const fetchDistricts = useCallback(
    async (provinceId: number) => {
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
    },
    [ghnToken]
  );

  const fetchWards = useCallback(
    async (districtId: number) => {
      try {
        const res = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
          { headers: { Token: ghnToken || "" } }
        );
        setWards(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy phường/xã:", err);
      }
    },
    [ghnToken]
  );

  const handleChange = useCallback(
    (key: keyof User, value: any) => {
      if (!formData) return;
      const updated = { ...formData, [key]: value };
      if (key === "ward_Commune" || key === "district" || key === "province_City") {
        updated.address = `${updated.ward_Commune || ""}, ${updated.district || ""}, ${updated.province_City || ""}`;
      }
      setFormData(updated);
    },
    [formData]
  );

  const submitInfo = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!formData || !authInfo.userId) {
      message.error("Dữ liệu không hợp lệ!");
      return;
    }
    const payload: UpdateCashierDTO = {
      email: formData.email,
      phone: formData.phone,
      userName: formData.userName,
      address: formData.address,
      provinceCity: formData.province_City,
      district: formData.district,
      wardCommune: formData.ward_Commune,
      dateOfBirth: formData.date_of_Birth
        ? moment(formData.date_of_Birth).toISOString()
        : new Date().toISOString(),
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/cashiers/${authInfo.userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      message.success("Cập nhật thành công!");
      onClose();
      onReload();
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 400) {
        message.error("Cập nhật thất bại. Kiểm tra lại thông tin!");
      } else {
        message.error("Cập nhật thất bại!");
      }
    }
  }, [authInfo?.token, authInfo?.userId, formData, clearAuthInfo, onClose, onReload]);

  const submitPassword = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!formData) {
      message.error("Dữ liệu không hợp lệ!");
      return;
    }
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
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      message.success("Đổi mật khẩu thành công!");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setIsInfoMode(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        message.error("Đổi mật khẩu thất bại!");
      }
    }
  }, [
    authInfo?.token,
    formData,
    oldPass,
    newPass,
    confirmPass,
    clearAuthInfo,
  ]);

  useEffect(() => {
    if (open && authInfo?.userId) {
      fetchUserData(authInfo.userId);
      fetchProvinces();
    }
  }, [open, authInfo?.userId, fetchUserData, fetchProvinces]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="40vw"
      centered
      destroyOnClose
    >
      <h2 className="text-xl font-bold text-center">CẬP NHẬT THÔNG TIN CÁ NHÂN</h2>

      <div className="flex justify-center items-center gap-4 mt-4 select-none">
        <span
          className={`text-sm font-medium cursor-pointer transition-colors ${
            isInfoMode ? "text-blue-600" : "text-gray-500"
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
          className={`text-sm font-medium cursor-pointer transition-colors ${
            !isInfoMode ? "text-blue-600" : "text-gray-500"
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
            disabled
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
            value={formData.date_of_Birth ? moment(formData.date_of_Birth) : undefined}
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
            onChange={(v, o: any) => handleChange("ward_Commune", o.children)}
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
            clearAuthInfo();
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

export default UserUpdateModalPos;