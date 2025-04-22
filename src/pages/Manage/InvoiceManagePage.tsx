import React, { useEffect, useState } from "react";
import { FileTextOutlined } from "@ant-design/icons";
import InvoiceList from "../../components/Manage/Invoice/InvoiceList";
import Sidebar from "../../components/Manage/Invoice/SideBar";

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
  const [search, setSearch] = useState("");

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
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-[7px]">
        <Sidebar
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

          <div className="bg-white rounded-[1.25vw] shadow-[1vw] overflow-hidden">
            <div className="px-[2vw] py-[1.25vw] border-b border-gray-200">
              <h2 className="text-[1.5vw] font-semibold text-gray-800">
                Danh sách hóa đơn
              </h2>
            </div>

            <InvoiceList invoices={invoices} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default InvoiceManagePage;
