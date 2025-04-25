import React from 'react';
import { Modal, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from 'axios';

interface MenuDetail{
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
    imageUrl: string;
  }
interface MenuDetailModalProps {
  open: boolean;
  loading: boolean;
  data: MenuDetail | null;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onReloadMenuList: () => void;
}

const MenuDetailModal: React.FC<MenuDetailModalProps> = ({ 
    open, 
    loading, 
    data, 
    onClose,
    onUpdate,
    onDelete,
    onReloadMenuList
  }) => {
    const handleDelete = async () => {
        if(!data) return;

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa món "${data.productName}" không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { style: { backgroundColor: "#FF4D4F", borderColor: "#FF4D4F", color: "#fff" } },
            onOk: async () => {
                try {
                    const res = await axios.delete(`https://localhost:7257/api/Menu/${data.productId}`, {
                        headers: { 'Content-Type': 'application/json; charset=utf-8' }
                    });
                    console.log("Phản hồi từ API:", res.data);
                    message.success('Xóa món ăn thành công!');
                    onClose();
                    onReloadMenuList();
                }
                catch (error) {
                    console.error("Lỗi API:", error);
                    message.error('Xóa món ăn thất bại!');
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
            <div className=" rounded-lg p-6 bg-white">
                <h2 className="text-2xl font-bold mb-4">CHI TIẾT MÓN ĂN</h2>

                {loading ? (
                    <p className="text-center">Đang tải chi tiết...</p>
                ) : data ? (
                    <div className="flex gap-6">
                        <div className="w-5/12 flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">{data.productName}</h3>
                            <img
                                src={data.imageUrl}
                                alt={data.productName}
                                className="w-full h-auto rounded-lg object-cover"
                            />
                        </div>

                        <div className="w-7/12 flex flex-col justify-between min-h-[300px] text-sm">
                            <div className="space-y-2">
                                <p><strong>Mã hàng hóa:</strong> {data.productId}</p>
                                <p><strong>Loại thực đơn:</strong> Đồ ăn</p>
                                <p><strong>Giá vốn:</strong> {data.costPrice?.toLocaleString()}đ</p>
                                <p><strong>Giá bán:</strong> {data.salePrice?.toLocaleString()}đ</p>
                                <p><strong>Đơn vị:</strong> Xuất</p>
                                <p><strong>Còn hàng:</strong> {data.isAvailable ? 'Còn' : 'Hết'}</p>
                                <p><strong>Hiển thị:</strong> {data.status ? 'Có' : 'Không'}</p>
                                <p><strong>Mô tả:</strong> {data.description || 'Không có mô tả'}</p>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={onUpdate}
                                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    <EditOutlined className="icon-of-menu-list-button"/>
                                    Cập nhật
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    <DeleteOutlined className="icon-of-menu-list-button"/>
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

export default MenuDetailModal;