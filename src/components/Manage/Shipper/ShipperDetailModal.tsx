import React from 'react';
import { Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from 'axios';

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
    onReloadUserList
}) => {
    const handleDelete = async () => {
        if (!data) return;

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa người dùng "${data.userName}" không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { style: { backgroundColor: "#FF4D4F", borderColor: "#FF4D4F", color: "#fff" } },
            onOk: async () => {
                try {
                    const res = await axios.delete(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Shipper/${data.userId}`, {
                        headers: { 'Content-Type': 'application/json; charset=utf-8' }
                    });
                    console.log("Phản hồi từ API:", res.data);
                    message.success('Xóa người dùng thành công!');
                    onClose();
                    onReloadUserList();
                }
                catch (error) {
                    console.error("Lỗi API:", error);
                    message.error('Xóa người dùng thất bại!');
                }
            }
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width="60%"
            closable={true}
            centered={true}
            style={{ padding: 0 }}
        >
            <div className="rounded-lg p-6 bg-white">
                <h2 className="text-2xl font-bold mb-4">CHI TIẾT NHÂN VIÊN</h2>

                {loading ? (
                    <p className="text-center">Đang tải chi tiết...</p>
                ) : data ? (
                    <div className="flex gap-6">
                        <div className="w-7/12 flex flex-col justify-between min-h-[300px] text-sm">
                            <div className="space-y-2">
                                <p><strong>ID nhân viên:</strong> {data.userId}</p>
                                <p><strong>Tên nhân viên:</strong> {data.userName}</p>
                                <p><strong>Số điện thoại:</strong> {data.phone}</p>
                                <p><strong>Email:</strong> {data.email}</p>
                                <p><strong>Ngày sinh:</strong> {data.date_of_Birth}</p>
                                <p><strong>Địa chỉ:</strong> {data.address}</p>
                                <p><strong>Phường/Xã:</strong> {data.ward_Commune}</p>
                                <p><strong>Quận/Huyện:</strong> {data.district}</p>
                                <p><strong>Tỉnh/Thành phố:</strong> {data.province_City}</p>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={onUpdate}
                                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    <EditOutlined className="icon-of-menu-list-button" />
                                    Cập nhật
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    <DeleteOutlined className="icon-of-menu-list-button" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Không có dữ liệu.</p>
                )}
            </div>
        </Modal>
    );
};

export default ShipperDetailModal;
