import React from "react";
import { Table, Empty, Tag, Descriptions, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CaretRightOutlined,
  FileTextOutlined,
  DollarOutlined,
  UserOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface InvoiceDetail {
  invoiceDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  productVat: number;
  productNote: string | null;
}

export interface Invoice {
  invoiceId: number;
  paymentMethod: string;
  orderId: number;
  orderType: string;
  cashier: string;
  shipper: string | null;
  customer: string | null;
  room: string | null;
  checkInTime: string;
  checkOutTime: string;
  totalQuantity: number;
  subtotal: number;
  otherPayment: number | null;
  invoiceDiscount: number | null;
  totalVat: number;
  amountDue: number;
  status: boolean;
  invoiceNote: string | null;
  invoiceDetails: InvoiceDetail[];
}

interface Props {
  invoices: Invoice[];
  loading: boolean;
}

const InvoiceList: React.FC<Props> = ({ invoices, loading }) => {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<number[]>([]);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  const handleExpand = (expanded: boolean, record: Invoice) => {
    const keys = expanded
      ? [...expandedRowKeys, record.invoiceId]
      : expandedRowKeys.filter((key) => key !== record.invoiceId);
    setExpandedRowKeys(keys);
  };

  const parseCustomerInfo = (customer: string | null) => {
    if (!customer) return { name: "Khách vãng lai", phone: "" };
    
    const parts = customer.split('-');
    return {
      name: parts[0] || "Khách vãng lai",
      phone: parts.length > 1 ? parts[1] : ""
    };
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: (
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-blue-500" />
          <span>Mã hóa đơn</span>
        </div>
      ),
      dataIndex: "invoiceId",
      key: "invoiceId",
      width: 150,
      render: (id) => (
        <Tag color="blue" className="font-semibold">
          #{id}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          <span>Khách hàng</span>
        </div>
      ),
      key: "customer",
      render: (_, record) => {
        const customerInfo = parseCustomerInfo(record.customer);
        return (
          <div className="truncate max-w-[200px]">
            {customerInfo.name}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center">
          <CreditCardOutlined className="mr-2 text-blue-500" />
          <span>Thanh toán</span>
        </div>
      ),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color={method === "Tiền mặt" ? "green" : "cyan"}>
          {method || "Không xác định"}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <DollarOutlined className="mr-2 text-blue-500" />
          <span>Tổng tiền</span>
        </div>
      ),
      key: "amountDue",
      render: (_, record) => (
        <span className="font-semibold text-green-600">
          {record.amountDue.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <CheckCircleOutlined className="mr-2 text-blue-500" />
          <span>Trạng thái</span>
        </div>
      ),
      key: "status",
      render: (_, record) => (
        <Tag color={record.status ? "green" : "red"}>
          {record.status ? "Thành công" : "Thất bại"}
        </Tag>
      ),
    },
  ];

  const expandedRowRender = (record: Invoice) => {
    const customerInfo = parseCustomerInfo(record.customer);

    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã hóa đơn" span={2}>
            <Tag color="blue">#{record.invoiceId}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mã đơn hàng">
            {record.orderId}
          </Descriptions.Item>
          <Descriptions.Item label="Loại đơn">
            <Tag color="orange">{record.orderType || "Không xác định"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thu ngân">
            {record.cashier || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Shipper">
            {record.shipper || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Khách hàng">
            {customerInfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {customerInfo.phone || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Khu vực">
            {record.room || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian vào">
            {formatDateTime(record.checkInTime)}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian ra">
            {formatDateTime(record.checkOutTime)}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            <Tag color={record.paymentMethod === "Tiền mặt" ? "green" : "cyan"}>
              {record.paymentMethod || "Không xác định"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={record.status ? "green" : "red"}>
              {record.status ? "Đã thanh toán" : "Chưa thanh toán"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {/* ... rest of the expanded row content remains the same ... */}
      </div>
    );
  };

  return (
    <Table
      rowKey="invoiceId"
      loading={loading}
      columns={columns}
      dataSource={invoices}
      expandable={{
        expandedRowRender,
        expandIcon: ({ expanded, onExpand, record }) => (
          <CaretRightOutlined
            className={`transition-transform duration-200 ${
              expanded ? "transform rotate-90" : ""
            } text-blue-500`}
            onClick={(e) => onExpand(record, e)}
          />
        ),
        expandedRowKeys,
        onExpand: handleExpand,
        rowExpandable: () => true,
      }}
      locale={{
        emptyText: (
          <Empty
            description={loading ? "Đang tải dữ liệu..." : "Không có hóa đơn nào"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      className="custom-invoice-table"
    />
  );
};

export default InvoiceList;