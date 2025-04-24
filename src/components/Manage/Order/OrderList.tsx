import React from "react";
import { Table, Tag, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Order {
    orderId: number;
    customerId: number;
    createdTime: string;
    totalQuantity: number;
    amountDue: number;
    orderNote: string;
    customerName?: string;
    deliveryInformationId: number | null;
}

interface OrderListProps {
    data: Order[];
    loading: boolean;
    onRowClick: (record: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ data, loading, onRowClick }) => {
    const columns: ColumnsType<Order> = [
        {
            title: "Mã đơn",
            dataIndex: "orderId",
            key: "orderId",
            width: 100,
            render: (id) => <span className="font-mono">#{id}</span>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Thời gian",
            dataIndex: "createdTime",
            key: "createdTime",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Số lượng",
            dataIndex: "totalQuantity",
            key: "totalQuantity",
            align: 'center',
        },
        {
            title: "Tổng tiền",
            dataIndex: "amountDue",
            key: "amountDue",
            render: (amount) => amount.toLocaleString('vi-VN') + '₫',
        },
        {
            title: "Ghi chú",
            dataIndex: "orderNote",
            key: "orderNote",
            ellipsis: true,
        },
    ];

    return (
        <div className="mt-4 custom-table-wrapper bg-white rounded-lg shadow">
            <Table<Order>
                rowKey="orderId"
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 10,
                    total: data.length,
                }}
                locale={{
                    emptyText: (
                        <Empty
                            description={loading ? "Đang tải..." : "Không có dữ liệu đơn hàng"}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' }
                })}
                className="custom-table"
                scroll={{ x: "70%" }}
            />
        </div>
    );
};

export default OrderList;