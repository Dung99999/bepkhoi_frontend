import React from "react";
import { Modal, Descriptions, Divider, Table, Button, Skeleton, Collapse } from "antd";
import type { ColumnsType } from "antd/es/table";

interface OrderDetailItem {
  orderDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string;
}

interface DeliveryInformation {
  deliveryInformationId: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  deliveryNote: string;
}

interface CancellationHistoryItem {
  orderCancellationHistoryId: number;
  orderId: number;
  cashierId: number;
  cashierName: string;
  productId: number;
  productName: string;
  quantity: number;
  reason: string;
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
  deliveryInfo?: DeliveryInformation | null;
  deliveryLoading?: boolean;
  cancellationHistory: CancellationHistoryItem[];
  historyLoading: boolean;
  onClose: () => void;
}

const { Panel } = Collapse;

const OrderDetail: React.FC<OrderDetailProps> = ({
  visible,
  orderId,
  customerName,
  createdTime,
  amountDue,
  orderNote,
  items,
  loading,
  deliveryInfo,
  deliveryLoading,
  cancellationHistory,
  historyLoading,
  onClose
}) => {
  const cancellationColumns: ColumnsType<CancellationHistoryItem> = [
    {
      title: "Món đã hủy",
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
      title: "Nhân viên",
      dataIndex: "cashierName",
      key: "cashierName",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => reason || 'Không có lý do',
    },
  ];

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

          {deliveryLoading ? (
            <div className="mt-4">
              <Divider orientation="left">Thông tin giao hàng</Divider>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : deliveryInfo ? (
            <>
              <Divider orientation="left">Thông tin giao hàng</Divider>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Người nhận">
                  {deliveryInfo.receiverName}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {deliveryInfo.receiverPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {deliveryInfo.receiverAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú giao hàng" span={2}>
                  {deliveryInfo.deliveryNote || 'Không có ghi chú'}
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : null}

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

          {cancellationHistory.length > 0 && (
            <>
              <Divider orientation="left">Lịch sử hủy món</Divider>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="Xem chi tiết các món đã hủy" key="1">
                  <Table<CancellationHistoryItem>
                    rowKey="orderCancellationHistoryId"
                    dataSource={cancellationHistory}
                    loading={historyLoading}
                    pagination={false}
                    columns={cancellationColumns}
                    size="small"
                  />
                </Panel>
              </Collapse>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default OrderDetail;