import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Spin, message } from "antd";
import { useAuth } from "../../context/AuthContext";
const token = localStorage.getItem("Token");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [summary, setSummary] = useState({
    completedOrders: 0,
    inProgressOrders: 0,
    customers: 0,
  });
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!authInfo.token) {
        message.error("Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }

      setLoading(true);
      try {
        // Fetch orders data
        const ordersResponse = await fetch(
          "https://localhost:7257/api/orders/get-all-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authInfo.token}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        if (ordersResponse.status === 401) {
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          clearAuthInfo();
          return;
        }
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await ordersResponse.json();
        const orders = ordersData.data;
        // Process data to group by date and calculate total revenue
        const revenueByDate = orders.reduce(
          (acc: { [key: string]: number }, order: any) => {
            const date = new Date(order.createdTime)
              .toISOString()
              .split("T")[0]; // Extract date (YYYY-MM-DD)
            acc[date] = (acc[date] || 0) + order.amountDue;
            return acc;
          },
          {}
        );

        // Calculate summary
        const completedOrders = orders.filter(
          (order: any) => order.orderStatusId === 2
        ).length;
        const inProgressOrders = orders.filter(
          (order: any) => order.orderStatusId === 1
        ).length;
        const customers = new Set(orders.map((order: any) => order.customerId))
          .size;

        setSummary({
          completedOrders,
          inProgressOrders,
          customers,
        });

        // Prepare data for the chart
        const labels = Object.keys(revenueByDate).sort(); // Sort dates
        const revenues = labels.map((date) => revenueByDate[date]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh thu theo ngày",
              data: revenues,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Fetch top customers data
        const customersResponse = await fetch(
          "https://localhost:7257/api/Customer",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authInfo.token}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );
        if (customersResponse.status === 401) {
          message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          clearAuthInfo();
          return;
        }
        if (!customersResponse.ok) {
          throw new Error("Failed to fetch top customers");
        }
        const customersData = await customersResponse.json();
        // Sắp xếp khách hàng theo totalAmountSpent giảm dần và lấy top 5
        const sortedCustomers = customersData
          .sort((a: any, b: any) => b.totalAmountSpent - a.totalAmountSpent)
          .slice(0, 5);

        setTopCustomers(sortedCustomers);
      } catch (error) {
        message.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row w-[90vw] justify-between  mx-auto">
      <div className="flex flex-col justify-center items-center">
        {/* Summary Section */}
        <div className="w-[60vw] bg-white shadow-md rounded-lg px-[2vw] py-[1vw] mt-[1vw] mb-[1vw]">
          <h3 className="text-lg font-bold mb-4">KẾT QUẢ BÁN HÀNG HÔM NAY</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-blue-500 text-2xl font-bold">
                {summary.completedOrders}
              </div>
              <div className="text-gray-600">Đơn đã xong</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-green-500 text-2xl font-bold">
                {summary.inProgressOrders}
              </div>
              <div className="text-gray-600">Đơn đang phục vụ</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-2xl font-bold">
                {summary.customers}
              </div>
              <div className="text-gray-600">Khách hàng</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              Thống kê doanh thu theo ngày
            </h2>
          </div>
          {loading ? (
            <Spin
              tip="Đang tải dữ liệu..."
              style={{ display: "block", margin: "20px auto" }}
            />
          ) : chartData ? (
            <div className="w-[60vw] h-auto bg-white shadow-md rounded-lg px-[8vw] py-[2vw]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Doanh thu theo ngày",
                    },
                  },
                }}
              />
              <p className="text-gray-800 pt-[4vw]">
                Bảng thống kê doanh thu cửa hàng theo ngày
              </p>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>Không có dữ liệu để hiển thị</p>
          )}
        </div>
      </div>

      <div className="w-[25vw] h-[30vw] bg-white shadow-md rounded-lg px-[2vw] py-[1vw] mt-[1vw] mb-[1vw]">
        <h3 className="text-lg font-bold mb-[1vw]">
          TOP 5 KHÁCH HÀNG MUA NHIỀU NHẤT
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-2 text-left text-[0.9vw]">
                  Tên khách hàng
                </th>
                <th className="px-4 py-2 text-left text-[0.9vw]">
                  Số điện thoại
                </th>
                <th className="px-4 py-2 text-right text-[0.9vw]">
                  Tổng chi tiêu
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-[1vw]">
                    <Spin tip="Đang tải..." />
                  </td>
                </tr>
              ) : (
                topCustomers.map(
                  (customer: {
                    customerId: string;
                    customerName: string;
                    phone: string;
                    totalAmountSpent: number;
                  }) => (
                    <tr key={customer.customerId} className="border-b">
                      <td className="px-4 py-2 text-[0.9vw]">
                        {customer.customerName}
                      </td>
                      <td className="px-4 py-2 text-[0.9vw]">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-2 text-right text-[0.9vw]">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(customer.totalAmountSpent)}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardManagePage;
