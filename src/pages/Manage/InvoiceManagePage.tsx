import React, { useEffect, useState } from "react";
import { FileTextOutlined } from "@ant-design/icons";
import InvoiceList from "../../components/Manage/Invoice/InvoiceList";
import Sidebar from "../../components/Manage/Invoice/SideBar";
import { Card, Spin } from "antd";

const token = localStorage.getItem("Token");

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

const InvoiceManagePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_APP_ENDPOINT}api/Invoice`;

      const params = new URLSearchParams();
      if (dateFrom) params.append('fromDate', dateFrom);
      if (dateTo) params.append('toDate', dateTo);
      if (search) params.append('search', search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [dateFrom, dateTo, search]);

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
        <Sidebar
          dateFrom={dateFrom}
          dateTo={dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          search={search}
          setSearch={setSearch}
        />
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