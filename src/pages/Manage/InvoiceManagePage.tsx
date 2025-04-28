import React, { useEffect, useState } from "react";
import { FileTextOutlined } from "@ant-design/icons";
import InvoiceList from "../../components/Manage/Invoice/InvoiceList";
import FilterSidebar from "../../components/Manage/Invoice/FilterSidebar";
import { Card, Spin, message } from "antd";
import { useAuth } from "../../context/AuthContext";

interface Invoice {
  invoiceId: number;
  paymentMethod: string;
  orderId: number;
  orderType: string;
  cashier: string;
  shipper: string | null;
  customer: string;
  room: string;
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
  invoiceDetails: {
    invoiceDetailId: number;
    productName: string;
    quantity: number;
    price: number;
    productVat: number;
    productNote: string | null;
  }[];
}

export interface InvoiceFilterParams {
  invoiceId?: number;
  customerKeyword?: string;
  cashierKeyword?: string;
  fromDate?: string;
  toDate?: string;
  status?: boolean;
  paymentMethod?: number;
}

const InvoiceManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterParams, setFilterParams] = useState<InvoiceFilterParams>({});

  const fetchInvoices = async (params: InvoiceFilterParams = {}) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Invoice/filter-invoices`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authInfo?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        setInvoices([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error("Lỗi khi tải dữ liệu hóa đơn");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (values: InvoiceFilterParams) => {
    setFilterParams(values);
    fetchInvoices(values);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const calculateTotalRevenue = () => {
    return invoices
      .filter(invoice => invoice.status)
      .reduce((sum, invoice) => sum + invoice.amountDue, 0);
  };

  const calculateTotalInvoices = () => {
    return invoices.length;
  };

  return (
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-4">
      <div className="h-fit">
        <FilterSidebar
          onFilterSubmit={handleFilterSubmit}
          loading={loading}
        />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold flex items-center">
              <FileTextOutlined className="mr-2 text-blue-600" />
              Quản lý hóa đơn
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="shadow-sm">
              <div className="text-gray-500">Tổng số hóa đơn</div>
              <div className="text-2xl font-bold">{calculateTotalInvoices()}</div>
            </Card>
            <Card className="shadow-sm">
              <div className="text-gray-500">Tổng doanh thu</div>
              <div className="text-2xl font-bold text-green-600">
                {calculateTotalRevenue().toLocaleString("vi-VN")}₫
              </div>
            </Card>
            <Card className="shadow-sm">
              <div className="text-gray-500">Hóa đơn chưa thanh toán</div>
              <div className="text-2xl font-bold text-red-500">
                {invoices.filter(i => !i.status).length}
              </div>
            </Card>
          </div>

          <Card className="shadow-sm">
            <Spin spinning={loading}>
              <InvoiceList invoices={invoices} loading={loading} />
            </Spin>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default InvoiceManagePage;