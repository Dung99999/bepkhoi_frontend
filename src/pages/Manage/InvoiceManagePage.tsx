import React, { useEffect, useState } from "react";
import { FileTextOutlined } from "@ant-design/icons";
import InvoiceList from "../../components/Manage/Invoice/InvoiceList";

// Thêm token ở đầu file
const token = localStorage.getItem("Token");

interface Invoice {
  invoiceId: number;
  invoiceDetails: InvoiceDetail[];
}

interface InvoiceDetail {
  invoiceDetailId: number;
  productName: string;
  quantity: number;
  price: number;
  productVat: number;
  productNote: string | null;
}

const InvoiceManagePage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Invoice`,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
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
  }, []);

  return (
    <div className="w-[83.33vw] mx-auto px-[2vw] py-[2vw]">
      <div className="bg-white rounded-[1.25vw] shadow-[1vw] overflow-hidden">
        <div className="px-[2vw] py-[1.25vw] border-b border-gray-200">
          <h1 className="text-[1.5vw] font-semibold text-gray-800 flex items-center">
            <FileTextOutlined className="mr-2 text-blue-600" />
            Quản lý hóa đơn
          </h1>
        </div>

        <InvoiceList invoices={invoices} loading={loading} />
      </div>
    </div>
  );
};

export default InvoiceManagePage;
