import React from "react";
import { Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface ShipperDetailModalProps {
    open: boolean;
    loading: boolean;
    data: any;
    onClose: () => void;
    onUpdate: () => void;
    onDelete: (userId: number, userName: string) => Promise<boolean>;
}

const ShipperDetailModal: React.FC<ShipperDetailModalProps> = ({
    open,
    loading,
    data,
    onClose,
    onUpdate,
    onDelete,
}) => {
    const handleDelete = () => {
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
                const success = await onDelete(data.userId, data.userName);
                if (success) {
                    onClose();
                }
            },
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="40%"
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
                                {data.date_of_Birth ? (
                                    new Date(data.date_of_Birth).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                ) : (
                                    <span>Chưa cập nhật</span>
                                )}
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
                            onClick={onUpdate}
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