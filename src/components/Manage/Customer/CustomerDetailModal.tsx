import React from 'react';
import { Modal } from 'antd';

interface CustomerItem {
  customerId: number;
  customerName: string;
  phone: string;
  totalAmountSpent: string;
}

interface CustomerDetailModalProps {
  open: boolean;
  loading: boolean;
  data: CustomerItem | null;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ 
    open, 
    loading, 
    data, 
    onClose,
  }) => {

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
                <h2 className="text-2xl font-bold mb-4">CHI TIẾT KHÁCH HÀNG</h2>

                {loading ? (
                    <p className="text-center">Đang tải chi tiết...</p>
                ) : data ? (
                    <div className="flex gap-6">
                        <div className="w-7/12 flex flex-col justify-between min-h-[300px] text-sm">
                            <div className="space-y-2">
                                <p><strong>ID Khách hàng:</strong> {data.customerId}</p>
                                <p><strong>Tên khách hàng:</strong> {data.customerName}</p>
                                <p><strong>Số điện thoại:</strong> {data.phone}</p>
                                <p><strong>Tổng tiền đã chi:</strong> {data.totalAmountSpent}</p>
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

export default CustomerDetailModal;
