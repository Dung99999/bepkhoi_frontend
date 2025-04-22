import React from "react";
import { Table, Empty, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CaretRightOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  DollarOutlined,
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
  invoiceDetails: InvoiceDetail[];
}

interface Props {
  invoices: Invoice[];
  loading: boolean;
}

const InvoiceList: React.FC<Props> = ({ invoices, loading }) => {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<number[]>([]);

  const calculateTotal = (invoice: Invoice) => {
    return invoice.invoiceDetails.reduce((sum, item) => {
      return sum + item.price * item.quantity * (1 + item.productVat / 100);
    }, 0);
  };

  const handleExpand = (expanded: boolean, record: Invoice) => {
    const keys = expanded
      ? [...expandedRowKeys, record.invoiceId]
      : expandedRowKeys.filter((key) => key !== record.invoiceId);
    setExpandedRowKeys(keys);
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: (
        <div className="flex items-center">
          <FileTextOutlined className="mr-[1vw] text-[1vw] text-blue-500" />
          <span className="text-[1vw]">Mã hóa đơn</span>
        </div>
      ),
      dataIndex: "invoiceId",
      key: "invoiceId",
      width: "20vw",
      render: (id) => (
        <span className="font-mono font-semibold text-gray-800">#{id}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <ShoppingOutlined className="mr-2 text-blue-500" />
          <span className="text-[1vw]">Số món</span>
        </div>
      ),
      key: "itemCount",
      width: "5vw",
      render: (_, record) => (
        <Tag color="blue" className="flex items-center font-medium">
          {record.invoiceDetails.length}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          <DollarOutlined className="mr-2 text-blue-500" />
          <span className="text-[1vw]">Tổng tiền</span>
        </div>
      ),
      key: "total",
      width: "10vw",
      render: (_, record) => (
        <span className="font-semibold text-green-600">
          {calculateTotal(record).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
  ];

  const expandedRowRender = (record: Invoice) => {
    return (
      <div className="bg-gray-50 p-[0.5vw] rounded-[1.5vw] border border-gray-200">
        <div className="grid grid-cols-1 gap-[0.5vw] mb-[0.5vw]">
          <div className="bg-white p-[0.75vw] rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-[0.5vw]">
              Thông tin hóa đơn
            </h3>
            <div className="space-y-1">
              <p className="text-[1vw]">
                <span className="font-medium text-gray-600">Mã hóa đơn:</span>
                <span className="ml-2 font-semibold">#{record.invoiceId}</span>
              </p>
              <p className="text-[1vw]">
                <span className="font-medium text-gray-600">Tổng món:</span>
                <span className="ml-2">{record.invoiceDetails.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-[0.75vw] rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-[0.5vw]">
              Tổng thanh toán
            </h3>
            <p className="text-[1vw] font-bold text-green-600">
              {calculateTotal(record).toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-[0.5vw]">
          Chi tiết đơn hàng
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Món
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VAT
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {record.invoiceDetails.map((item) => (
                <tr key={item.invoiceDetailId} className="hover:bg-blue-50">
                  <td className="text-[1vw] px-[0.5vw] py-[0.37vw] whitespace-nowrap font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="text-[1vw] px-[0.5vw] py-[0.37vw] whitespace-nowrap text-gray-500 text-center">
                    {item.quantity}
                  </td>
                  <td className="text-[1vw] px-[0.5vw] py-[0.37vw] whitespace-nowrap text-gray-500 text-right">
                    {item.price.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="text-[1vw] px-[0.5vw] py-[0.37vw] whitespace-nowrap text-gray-500 text-center">
                    {item.productVat}%
                  </td>
                  <td className="text-[1vw] px-[0.5vw] py-[0.37vw] whitespace-nowrap font-medium text-gray-900 text-right">
                    {Math.round(
                      item.price * item.quantity * (1 + item.productVat / 100)
                    ).toLocaleString("vi-VN")}
                    ₫
                  </td>
                  <td className="px-[0.5vw] py-[0.37vw] whitespace-nowrap text-[1vw] text-gray-500">
                    {item.productNote || (
                      <span className="text-gray-400">Không có</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      pagination={{
        pageSize: 10,
        total: invoices.length,
      }}
      locale={{
        emptyText: (
          <Empty
            description={
              loading ? "Đang tải dữ liệu..." : "Không có hóa đơn nào"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ),
      }}
      className="custom-invoice-table"
    />
  );
};

export default InvoiceList;
