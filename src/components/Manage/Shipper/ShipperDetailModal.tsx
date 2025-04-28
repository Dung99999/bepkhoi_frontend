import React from "react";
import { Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface CustomerItem {
    userId: number;
    userName: string;
    phone: string;
    email: string;
    date_of_Birth: string;
    address: string;
    ward_Commune: string;
    district: string;
    province_City: string;
    roleName: string;
}

interface CustomerDetailModalProps {
    open: boolean;
    loading: boolean;
    data: CustomerItem | null;
    onClose: () => void;
    onUpdate: () => void;
    onReloadUserList: () => void;
}

const ShipperDetailModal: React.FC<CustomerDetailModalProps> = ({
    open,
    loading,
    data,
    onClose,
    onUpdate,
    onReloadUserList,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();

  const handleDelete = async () => {
    if (!data) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa shipper "${data.userName}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          backgroundColor: "#FF4D4F",
          borderColor: "#FF4D4F",
          color: "#fff",
        },
      },
      onOk: async () => {
        try {
          const res = await axios.delete(
            `${process.env.REACT_APP_API_APP_ENDPOINT}api/shipper/${data.userId}`,
            {
              headers: { 
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${authInfo?.token}`,
              },
            }
          );
          console.log("Phản hồi từ API:", res.data);
          message.success("Xóa shipper thành công!");
          onClose();
          onReloadUserList();
        } catch (error: any) {
          if (error.response?.status === 401) {
            clearAuthInfo();
            message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
            return;
          }
          console.error("Lỗi API:", error);
          message.error("Xóa shipper thất bại!");
        }
      },
    });
  };

  const handleUpdate = () => {
    onUpdate();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="30%"
      closable={true}
      centered={true}
    >
      <div className="rounded-lg p-6 bg-white">
        <h2 className="text-xl font-bold text-center mb-6">Thông Tin Shipper</h2>

        {loading ? (
          <p className="text-center">Đang tải chi tiết...</p>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p>
                <strong>ID Shipper:</strong> {data.userId}
              </p>
              <p>
                <strong>Tên Shipper:</strong> {data.userName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {data.phone}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{" "}
                {new Date(data.date_of_Birth).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {data.address}
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <strong>Phường/Xã:</strong> {data.ward_Commune}
              </p>
              <p>
                <strong>Quận/Huyện:</strong> {data.district}
              </p>
              <p>
                <strong>Tỉnh/Thành phố:</strong> {data.province_City}
              </p>
              <p>
                <strong>Vai trò:</strong>{" "}
                {data.roleName === "shipper" ? "Nhân viên giao hàng" : data.roleName}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center">Không có dữ liệu.</p>
        )}

        {!loading && data && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <EditOutlined />
              Cập nhật
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
            >
              <DeleteOutlined />
              Xóa
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShipperDetailModal;