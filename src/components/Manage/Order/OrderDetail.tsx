import React from "react";
import { Modal, Descriptions, Divider, Table, Button } from "antd";

interface OrderDetailItem {
  orderDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string;
}

interface OrderDetailProps {
  visible: boolean;
  orderId?: number;
  customerName?: string;
  createdTime?: string;
  amountDue?: number;
  orderNote?: string;
  items: OrderDetailItem[];
  loading: boolean;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  visible,
  orderId,
  customerName,
  createdTime,
  amountDue,
  orderNote,
  items,
  loading,
  onClose
}) => {
  return (
    <Modal
      title={`Chi tiết đơn hàng #${orderId}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {loading ? (
        <div className="text-center py-8">Đang tải chi tiết đơn hàng...</div>
      ) : (
        <>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Khách hàng" span={2}>
              {customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian đặt">
              {createdTime && new Date(createdTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {amountDue?.toLocaleString('vi-VN')}₫
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {orderNote || 'Không có ghi chú'}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Danh sách món</Divider>
          
          <Table<OrderDetailItem>
            rowKey="orderDetailId"
            dataSource={items}
            pagination={false}
            columns={[
              {
                title: "Tên món",
                dataIndex: "productName",
                key: "productName",
              },
              {
                title: "Số lượng",
                dataIndex: "quantity",
                key: "quantity",
                align: 'center',
              },
              {
                title: "Đơn giá",
                dataIndex: "price",
                key: "price",
                render: (price) => price.toLocaleString('vi-VN') + '₫',
              },
              {
                title: "Thành tiền",
                key: "total",
                render: (_, record) => (record.price * record.quantity).toLocaleString('vi-VN') + '₫',
              },
              {
                title: "Ghi chú",
                dataIndex: "productNote",
                key: "productNote",
                render: (note) => note || 'Không có ghi chú',
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export default OrderDetail;