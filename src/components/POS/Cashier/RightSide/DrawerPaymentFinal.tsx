import React, { useState } from "react";
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

interface DrawerPaymentFinalProps {
  isVisible: boolean;
  onClose: () => void;
}

const orders = [
  { id: 1, name: "GIN FIZZ", quantity: 1, price: 30000, total: 30000 },
  { id: 2, name: "MOJITO", quantity: 2, price: 35000, total: 70000 },
  { id: 3, name: "WHISKEY SOUR", quantity: 1, price: 40000, total: 40000 },
];

const totalOfPayment = () => {
  return orders
    .reduce((sum, order) => sum + order.total, 0)
    .toLocaleString("vi-VN");
};

const timeExport = new Date().toLocaleDateString("vi-VN", {
  //   weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// Payment Method
const plainOptions: CheckboxGroupProps<string>["options"] = [
  "Tiền mặt",
  "Chuyển khoản",
];

const options: CheckboxGroupProps<string>["options"] = [
  { label: "Tiền mặt", value: "Tiền mặt" },
  { label: "Chuyển khoản", value: "Chuyển khoản" },
];

const optionsWithDisabled: CheckboxGroupProps<string>["options"] = [
  { label: "Tiền mặt", value: "Tiền mặt" },
  { label: "Chuyển khoản", value: "Chuyển khoản" },
];

const bankItems: { label: string; key: string; img: string }[] = [
  {
    label: "MB Bank 11111111",
    key: "MB Bank 11111111",
    img: "https://brandlogos.net/wp-content/uploads/2021/10/mb-bank-logo.png",
  },
  {
    label: "Vietcombank 22222222",
    key: "Vietcombank 22222222",
    img: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png",
  },
  {
    label: "Techcombank 33333333",
    key: "Techcombank 33333333",
    img: "https://static.wixstatic.com/media/9d8ed5_263edd01c0b847059f8035fd531145d6~mv2.png/v1/fill/w_560,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9d8ed5_263edd01c0b847059f8035fd531145d6~mv2.png",
  },
];

const items: MenuProps["items"] = bankItems.map((bank) => ({
  label: bank.label,
  key: bank.key,
}));

const DrawerPaymentFinal: React.FC<DrawerPaymentFinalProps> = ({
  isVisible,
  onClose,
}) => {
  const [selectedBank, setSelectedBank] = useState(bankItems[0]);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const onChangePaymentMethod = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio1 checked", value);
    setPaymentMethod(value);
  };
  const [paymentAmount, setPaymentAmount] = useState(totalOfPayment());

  const handleFinalPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPaymentAmount(value);
  };

  const onClick: MenuProps["onClick"] = ({ key }) => {
    const bank = bankItems.find((b) => b.key === key);
    if (bank) {
      setSelectedBank(bank);
      message.info(`Bạn đã chọn: ${bank.label}`);
    }
  };

  return (
    <div className="rounded-lg">
      <Drawer
        title="Phiếu thanh toán 2-2 - bàn 10/ lầu 1"
        placement="right"
        width="60%"
        onClose={onClose}
        open={isVisible}
      >
        <div className="flex w-full grid-cols-2 justify-between">
          {/* Order infomation */}
          <div className="flex-1 pr-2 flex-col h-[100vh]">
            {/* Customer infomation */}
            <div className="flex pb-3 flex-row justify-between">
              <div className="justify-start flex">
                <UserOutlined />
                <p className="ml-2">Anh Tùng</p>
              </div>
              <div className="flex-1"></div>
              <div className="justify-end border border-green-400 px-3 rounded-full text-green-600 font-medium">
                $ Thanh toán tất cả
              </div>
            </div>
            {/* List of order */}
            <div className="pt-3 border-t-2">
              <div className="font-semibold bg-gray-200 w-full p-2">
                Thông tin Order
              </div>
              {/* List of order */}
              <table className="w-full mt-2">
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className="border-b-2">
                      <td className="p-2 font-semibold">{index + 1}</td>
                      <td className="p-2 font-semibold">{order.name}</td>
                      <td className="p-2">{order.quantity}</td>
                      <td className="p-2">{order.price.toLocaleString()}đ</td>
                      <td className="p-2 font-semibold">
                        {order.total.toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Payment and payment method */}
          <div className="ml-3 flex-1 flex flex-col h-full">
            <div className="">
              {/* Time */}
              <div className="flex flex-1 justify-end">
                <div className="text-gray-600 mr-2">{timeExport}</div>
                <ClockCircleOutlined />
              </div>
              {/* Payment */}
              <div className="pt-4 flex flex-col">
                {/* total payment */}
                <div className="flex flex-row pb-2">
                  <p className="justify-start font-medium">Tổng tiền hàng</p>
                  <div className="flex-1"></div>
                  <p className="justify-end font-medium">{totalOfPayment()}</p>
                </div>
                {/* discount payment */}
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">Giảm giá</p>
                  <div className="flex-1"></div>
                  <p className="justify-end font-medium">20,000</p>
                </div>
                {/* customer payment */}
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-bold">Khách cần trả</p>
                  <div className="flex-1"></div>
                  <p className="justify-end font-medium">{120000}</p>
                </div>
                {/* final payment */}
                <div className="flex flex-row pt-2 pb-2">
                  <p className="justify-start font-medium">Khách thanh toán</p>
                  <div className="flex-1"></div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={`${totalOfPayment()}`}
                    className="border-b border-gray-400 focus:outline-none px-2 py-1 text-right"
                    value={paymentAmount}
                    onChange={handleFinalPaymentChange}
                  />
                </div>
              </div>
              {/* Payment method */}
              <div>
                <Radio.Group
                  options={plainOptions}
                  onChange={onChangePaymentMethod}
                  value={paymentMethod}
                />
              </div>
              <div className="mt-3 py-3 rounded-lg">
                {paymentMethod === "Tiền mặt" && (
                  <div className=" text-gray-800 p-2 rounded">
                    <p>
                      Khách cần thanh toán: <strong>{paymentAmount} đ</strong>
                    </p>
                  </div>
                )}

                {paymentMethod === "Chuyển khoản" && (
                  <div>
                    <Dropdown menu={{ items, onClick }}>
                      <div className="cursor-pointer w-full flex items-center justify-between border border-gray-300 rounded-md px-2 py-1">
                        <div className="flex items-center">
                          <img
                            src={selectedBank?.img}
                            alt="Bank Logo"
                            className="w-8 h-8 mr-2 rounded-full object-contain"
                          />
                          <span className="font-medium">
                            {selectedBank?.label}
                          </span>
                        </div>
                        <DownOutlined />
                      </div>
                    </Dropdown>

                    {/* Hiển thị ảnh ngân hàng đã chọn bên dưới */}
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
            <div className="flex-1"></div>
            <div className="mt-auto">
              <button
                className="px-5 bg-green-500 text-white py-3 rounded-lg
               font-semibold hover:bg-green-600"
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
