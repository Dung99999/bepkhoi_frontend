import React from 'react';
import { Modal, Skeleton, Tag } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined, DollarOutlined } from '@ant-design/icons';

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
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(Number(amount));
    };

    const getCustomerStatus = (amount: string) => {
        const amountNumber = Number(amount);
        if (amountNumber > 0) {
            return { text: 'Đã sử dụng dịch vụ', color: 'green' };
        }
        return { text: 'Khách hàng đăng ký', color: 'blue' };
    };

    const status = data ? getCustomerStatus(data.totalAmountSpent) : null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={500}
            closable={true}
            centered={true}
            className="customer-detail-modal"
            bodyStyle={{ padding: '20px' }}
        >
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <UserOutlined className="mr-2 text-blue-500" />
                    CHI TIẾT KHÁCH HÀNG
                </h2>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 4 }} />
                ) : data ? (
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <IdcardOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">ID Khách hàng</p>
                                <p className="font-medium">{data.customerId}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <UserOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Họ và tên</p>
                                <p className="font-medium text-lg">{data.customerName}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <PhoneOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{data.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <DollarOutlined className="text-lg text-blue-500 mr-3 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-lg text-green-600">
                                        {formatCurrency(data.totalAmountSpent)}
                                    </p>
                                    {status && (
                                        <Tag color={status.color} className="text-xs">
                                            {status.text}
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        Không tìm thấy thông tin khách hàng
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CustomerDetailModal;