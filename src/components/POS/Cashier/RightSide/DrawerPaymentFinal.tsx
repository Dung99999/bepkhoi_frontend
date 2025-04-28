import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Dropdown,
  MenuProps,
  message,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { useAuth } from "../../../../context/AuthContext";
import useSignalR from "../../../../CustomHook/useSignalR";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface DrawerPaymentFinalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedOrder: number | null;
  isReloadAfterPayment: boolean;
  setIsReloadAfterPayment: (isReload: boolean) => void;
}

interface OrderModel {
  orderId: number;
  customerId: number | null;
  shipperId: number | null;
  deliveryInformationId: number | null;
  orderTypeId: number;
  roomId: number | null;
  createdTime: string;
  totalQuantity: number;
  amountDue: number;
  orderStatusId: number;
  orderNote: string | null;
}

interface CustomerPaymentDto {
  customerId: number;
  phone: string;
  customerName: string;
}

interface OrderDetailPaymentDto {
  orderDetailId: number;
  orderId: number;
  status: boolean | null;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productNote: string | null;
  productVat: number;
}

interface OrderPaymentDto {
  orderId: number;
  customerId: number | null;
  shipperId: number | null;
  deliveryInformationId: number | null;
  orderTypeId: number;
  roomId: number | null;
  createdTime: string;
  totalQuantity: number;
  amountDue: number;
  orderStatusId: number;
  orderNote: string | null;
  customer: CustomerPaymentDto | null;
  orderDetails: OrderDetailPaymentDto[];
}

interface InvoiceForPaymentDto {
  paymentMethodId: number;
  orderId: number;
  orderTypeId: number;
  cashierId: number;
  shipperId?: number;
  customerId?: number;
  roomId?: number;
  checkInTime: string;
  checkOutTime: string;
  totalQuantity: number;
  subtotal: number;
  otherPayment?: number;
  invoiceDiscount?: number;
  totalVat?: number;
  amountDue: number;
  status?: boolean;
  invoiceNote?: string;
}

interface InvoiceDetailForPaymentDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productVat?: number;
  productNote?: string;
}

async function fetchCreateInvoiceForPayment(
  invoiceInfo: InvoiceForPaymentDto,
  invoiceDetails: InvoiceDetailForPaymentDto[],
  token: string,
  clearAuthInfo: () => void
): Promise<{ success: boolean; message: string; invoiceId?: number; error?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Invoice/create-invoice-for-payment`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceInfo,
        invoiceDetails,
      }),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return {
        success: false,
        message: "Phiên làm việc đã hết hạn.",
        error: "Unauthorized",
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Đã xảy ra lỗi trong quá trình tạo hóa đơn.",
        error: data.error || null,
      };
    }

    return {
      success: true,
      message: data.message || "Tạo hóa đơn thành công.",
      invoiceId: data.invoiceId,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Lỗi khi kết nối đến máy chủ.",
      error: error.message || error,
    };
  }
}

async function fetchOrderPayment(
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<OrderPaymentDto | null> {
  if (!orderId || isNaN(orderId) || orderId <= 0) {
    console.log("Invalid orderId provided.");
    return null;
  }
  try {
    const url = `${API_BASE_URL}api/orders/Get-order-payment-information/${orderId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      switch (response.status) {
        case 400:
          console.log("Bad request: The provided orderId may be invalid.");
          break;
        case 404:
          console.log("Order not found.");
          break;
        case 500:
          console.log("Server error occurred while fetching order.");
          break;
        default:
          console.log(`Unexpected API error: ${response.status}`);
      }
      return null;
    }

    const data: OrderPaymentDto = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.log("Network error. Please check your internet connection.");
    } else {
      console.log(`Unexpected error: ${(error as Error).message}`);
    }
    return null;
  }
}

async function fetchVnPayUrl(
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Invoice/vnpay-url?Id=${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Lỗi khi tạo URL thanh toán:", errorMessage);
      message.error(errorMessage || "Không thể tạo URL thanh toán.");
      return null;
    }

    const paymentUrl = await response.text();
    return paymentUrl;
  } catch (error) {
    console.error("Lỗi kết nối đến server:", error);
    message.error("Không thể kết nối đến server.");
    return null;
  }
}

async function printInvoicePdf(
  invoiceId: number,
  token: string,
  clearAuthInfo: () => void
) {
  try {
    const response = await fetch(`${API_BASE_URL}api/invoice/${invoiceId}/print-pdf`, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    if (!response.ok) {
      throw new Error("Không thể tải hóa đơn");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 7000); 
    };
  } catch (err) {
    console.error("Lỗi khi in hóa đơn:", err);
    message.error("Lỗi khi in hóa đơn.");
  }
}

const timeExport = new Date().toLocaleDateString("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const paymentOptions = [
  { label: "Tiền mặt", value: 1 },
  { label: "Chuyển khoản", value: 2 },
];

const bankItems: { label: string; key: string; img: string }[] = [
  {
    label: "VNPAY",
    key: "1",
    img: "https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg",
  },
];

const items: MenuProps["items"] = bankItems.map((bank) => ({
  label: bank.label,
  key: bank.key,
}));

const DrawerPaymentFinal: React.FC<DrawerPaymentFinalProps> = ({
  isVisible,
  onClose,
  selectedOrder,
  isReloadAfterPayment,
  setIsReloadAfterPayment,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [selectedBank, setSelectedBank] = useState(bankItems[0]);
  const [paymentMethod, setPaymentMethod] = useState<number>(1);
  const [orderPaymentInfo, setOrderPaymentInfo] = useState<OrderPaymentDto | null>(null);
  const [totalVat, setTotalVat] = useState<number>();
  const [otherPayment, setOtherPayment] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>();
  const [customerPayAmount, setCustomerPayAmount] = useState<number>(0);
  const [currentVnpayInvoice, setCurrentVnpayInvoice] = useState<number | null>(null);

  const debounceOrderListUpdate = useCallback(() => {
    let timeout: NodeJS.Timeout;
    return (data: { invoiceId: number; status: boolean }) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (Number(currentVnpayInvoice) === Number(data.invoiceId)) {
          if (data.status) {
            message.info("Đơn hàng đã được thanh toán thành công!");
            printInvoicePdf(data.invoiceId, authInfo?.token || "", clearAuthInfo);
            setIsReloadAfterPayment(true);
            onClose();
          } else {
            message.warning("Thanh toán đơn hàng thất bại. Vui lòng thử lại!");
          }
        }
      }, 500);
    };
  }, [currentVnpayInvoice, authInfo?.token, clearAuthInfo]);

  useSignalR(
    {
      eventName: "PaymentStatus",
      groupName: "payment",
      callback: debounceOrderListUpdate(),
    },
    [debounceOrderListUpdate]
  );

  const getOrderPayment = async (orderId: number) => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const result = await fetchOrderPayment(orderId, authInfo.token, clearAuthInfo);
    if (result === null) {
      message.error("Truy xuất thông tin đơn đặt hàng thất bại");
      setOrderPaymentInfo(null);
      setTotalVat(0);
      setFinalAmount(0);
      return;
    }
    setOrderPaymentInfo(result);
    if (!result?.orderDetails) {
      setTotalVat(0);
      setFinalAmount(0);
    } else {
      let vatCalculate = result.orderDetails.reduce((total, item) => {
        const vatAmount = item.price * item.quantity * (item.productVat / 100);
        return total + vatAmount;
      }, 0);
      setTotalVat(vatCalculate);
      setFinalAmount(result.amountDue + vatCalculate);
    }
  };

  useEffect(() => {
    if (isVisible && selectedOrder != null) {
      getOrderPayment(selectedOrder);
      setOtherPayment(0);
      setDiscount(0);
      setCurrentVnpayInvoice(null);
    }
  }, [isVisible, selectedOrder]);

  useEffect(() => {
    if (orderPaymentInfo != null) {
      const safeNumber = (value: any): number => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };
      const totalVatSafe = safeNumber(totalVat);
      const otherPaymentSafe = safeNumber(otherPayment);
      const discountSafe = safeNumber(discount);
      setFinalAmount(
        orderPaymentInfo.amountDue +
          totalVatSafe +
          otherPaymentSafe -
          discountSafe
      );
    }
  }, [otherPayment, discount, orderPaymentInfo, totalVat]);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    const bank = bankItems.find((b) => b.key === key);
    if (bank) {
      setSelectedBank(bank);
      message.info(`Bạn đã chọn: ${bank.label}`);
    }
  };

  const handleCheckoutCash = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!orderPaymentInfo) {
      message.error("Không có thông tin đơn hàng.");
      return;
    }
    const invoiceInfo: InvoiceForPaymentDto = {
      paymentMethodId: 1,
      orderId: orderPaymentInfo.orderId,
      orderTypeId: orderPaymentInfo.orderTypeId,
      cashierId: Number(authInfo?.userId) || 0,
      shipperId: orderPaymentInfo.shipperId ?? undefined,
      customerId: orderPaymentInfo.customerId ?? undefined,
      roomId: orderPaymentInfo.roomId ?? undefined,
      checkInTime: orderPaymentInfo.createdTime,
      checkOutTime: new Date().toISOString(),
      totalQuantity: orderPaymentInfo.totalQuantity,
      subtotal: orderPaymentInfo.amountDue,
      otherPayment: otherPayment,
      invoiceDiscount: discount,
      totalVat: totalVat,
      amountDue: finalAmount ?? 0,
      invoiceNote: orderPaymentInfo.orderNote ?? "",
      status: true,
    };
    const invoiceDetails: InvoiceDetailForPaymentDto[] = orderPaymentInfo.orderDetails.map((detail) => ({
      productId: detail.productId,
      productName: detail.productName,
      quantity: detail.quantity,
      price: detail.price,
      productVat: detail.productVat,
      productNote: detail.productNote ?? "",
    }));
    const result = await fetchCreateInvoiceForPayment(
      invoiceInfo,
      invoiceDetails,
      authInfo.token,
      clearAuthInfo
    );
    if (result.success && result.invoiceId) {
      message.success("Thanh toán thành công!");
      setIsReloadAfterPayment(true);
      onClose();
      printInvoicePdf(result.invoiceId, authInfo.token, clearAuthInfo);
    } else {
      message.error(`Thanh toán thất bại: ${result.message}`);
      console.error("Chi tiết lỗi:", result.error);
    }
  };

  const handleCheckoutVnpay = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (!orderPaymentInfo) {
      message.error("Không có thông tin đơn hàng.");
      return;
    }
    const invoiceInfo: InvoiceForPaymentDto = {
      paymentMethodId: 2,
      orderId: orderPaymentInfo.orderId,
      orderTypeId: orderPaymentInfo.orderTypeId,
      cashierId: Number(authInfo?.userId) || 0,
      shipperId: orderPaymentInfo.shipperId ?? undefined,
      customerId: orderPaymentInfo.customerId ?? undefined,
      roomId: orderPaymentInfo.roomId ?? undefined,
      checkInTime: orderPaymentInfo.createdTime,
      checkOutTime: new Date().toISOString(),
      totalQuantity: orderPaymentInfo.totalQuantity,
      subtotal: orderPaymentInfo.amountDue,
      otherPayment: otherPayment,
      invoiceDiscount: discount,
      totalVat: totalVat,
      amountDue: finalAmount ?? 0,
      invoiceNote: orderPaymentInfo.orderNote ?? "",
      status: false,
    };
    const invoiceDetails: InvoiceDetailForPaymentDto[] = orderPaymentInfo.orderDetails.map((detail) => ({
      productId: detail.productId,
      productName: detail.productName,
      quantity: detail.quantity,
      price: detail.price,
      productVat: detail.productVat,
      productNote: detail.productNote ?? "",
    }));
    const result = await fetchCreateInvoiceForPayment(
      invoiceInfo,
      invoiceDetails,
      authInfo.token,
      clearAuthInfo
    );
    if (result.success && result.invoiceId) {
      const paymentUrl = await fetchVnPayUrl(result.invoiceId, authInfo.token, clearAuthInfo);
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
        setCurrentVnpayInvoice(result.invoiceId);
      }
    } else {
      message.error(`Thanh toán thất bại: ${result.message}`);
      console.error("Chi tiết lỗi:", result.error);
    }
  };

  return (
    <div className="rounded-lg">
      <Drawer
        title="Phiếu thanh toán"
        placement="right"
        width="60%"
        onClose={onClose}
        open={isVisible}
      >
        <div className="flex w-full grid-cols-2 justify-between">
          <div className="flex-1 pr-2 flex-col h-[100vh]">
            <div className="flex pb-3 flex-row justify-between">
              <div className="justify-start flex">
                <UserOutlined />
                <p className="ml-2">
                  {orderPaymentInfo?.customer?.customerName || "Khách lẻ"}
                </p>
              </div>
              <div className="flex-1" />
              <div className="justify-end border border-green-400 px-3 rounded-full text-green-600 font-medium">
                $ Thanh toán tất cả
              </div>
            </div>
            <div className="pt-3 border-t-2">
              <div className="font-semibold bg-gray-200 w-full p-2">
                Mã Đơn Hàng {selectedOrder}
              </div>
              <table className="w-full mt-2">
                <tbody>
                  {orderPaymentInfo?.orderDetails?.map((order, index) => (
                    <tr key={order.orderDetailId} className="border-b-2">
                      <td className="p-2 font-semibold">{index + 1}</td>
                      <td className="p-2 font-semibold">{order.productName}</td>
                      <td className="p-2">{order.quantity}</td>
                      <td className="p-2">{order.price.toLocaleString()}đ</td>
                      <td className="p-2 font-semibold">
                        {(order.price * order.quantity).toLocaleString()}đ
                      </td>
                      <td className="p-2 font-semibold">{order.productNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="ml-3 flex-1 flex flex-col h-full">
            <div>
              <div className="flex flex-1 justify-end">
                <div className="text-gray-600 mr-2">{timeExport}</div>
                <ClockCircleOutlined />
              </div>
              <div className="pt-4 flex flex-col">
                <div className="flex flex-row pb-2">
                  <p className="justify-start font-medium">Tổng tiền hàng</p>
                  <div className="flex-1" />
                  <p className="justify-end font-medium">
                    {orderPaymentInfo?.amountDue.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">Chi phí khác</p>
                  <div className="flex-1" />
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={otherPayment}
                    className="border-b border-gray-400 focus:outline-none text-right"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) setOtherPayment(val);
                    }}
                  />
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">Giảm giá</p>
                  <div className="flex-1" />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={discount}
                    className="border-b border-gray-400 focus:outline-none text-right"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) setDiscount(val);
                    }}
                  />
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">VAT</p>
                  <div className="flex-1" />
                  <p className="justify-end font-medium">
                    {totalVat?.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-bold">Khách cần trả</p>
                  <div className="flex-1" />
                  <p className="justify-end font-medium">
                    {finalAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">Khách thanh toán</p>
                  <div className="flex-1" />
                  <input
                    type="number"
                    inputMode="numeric"
                    defaultValue={0}
                    className="border-b border-gray-400 focus:outline-none text-right"
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) setCustomerPayAmount(val);
                    }}
                  />
                </div>
              </div>
              <div className="mt-5">
                <Radio.Group
                  options={paymentOptions}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(Number(e.target.value))}
                />
              </div>
              <div className="mt-1 py-3 rounded-lg">
                {paymentMethod === 1 && (
                  <div className="text-gray-800 rounded font-medium">
                    <p>
                      Tiền thừa trả khách:{" "}
                      {(customerPayAmount - (finalAmount ?? 0)).toLocaleString()} đ
                    </p>
                  </div>
                )}
                {paymentMethod === 2 && (
                  <div>
                    <Dropdown menu={{ items, onClick }}>
                      <div className="cursor-pointer w-full flex items-center justify-between border border-gray-300 rounded-md px-2 py-1">
                        <div className="flex items-center">
                          <img
                            src={selectedBank?.img}
                            alt="Bank Logo"
                            className="w-8 h-8 mr-2 rounded-full object-contain"
                          />
                          <span className="font-medium">{selectedBank?.label}</span>
                        </div>
                        <DownOutlined />
                      </div>
                    </Dropdown>
                    <div className="mt-3 flex justify-start">
                      <img
                        src={selectedBank?.img}
                        alt="Selected Bank"
                        className="w-20 h-20 rounded-lg shadow-md object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1" />
            <div className="mt-auto">
              <button
                className="px-5 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                onClick={() => {
                  if (paymentMethod === 1) {
                    handleCheckoutCash();
                  } else if (paymentMethod === 2) {
                    handleCheckoutVnpay();
                  }
                }}
              >
                $ Thanh toán
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerPaymentFinal;