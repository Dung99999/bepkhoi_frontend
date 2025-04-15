import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Spin, message } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardManagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [summary, setSummary] = useState({
    completedOrders: 0,
    inProgressOrders: 0,
    customers: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://localhost:7257/api/orders/get-all-orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const orders = data.data;

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
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Không thể tải dữ liệu doanh thu!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
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
            style={{ fontSize: "24px", fontWeight: "bold", textAlign: "left" }}
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
  );
};

export default DashboardManagePage;
