import {
  BellOutlined,
  CaretDownOutlined,
  DollarOutlined,
  EditOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import React, { useState } from "react";
import DrawerPaymentFinal from "./DrawerPaymentFinal";
import ModalSplitOrder from "./ModalSplitOrders";
// import SplitOrderModal from "./SplitOrderModal";

const POSPayment: React.FC = () => {
  const totalPrice = 140000;
  const salePrice = 120000;

  const [hasProducts, setHasProducts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSplitOrderOpen, setIsModalSplitOrderOpen] = useState(false);
  const [note, setNote] = useState("");
  const [splitNote, setSplitNote] = useState("");
  const [isDrawerPaymentVisible, setIsDrawerPaymentVisible] = useState(false);

  const showDrawerPayment = () => setIsDrawerPaymentVisible(true);
  const onClosePaymentDrawer = () => setIsDrawerPaymentVisible(false);

  return (
    <div className="px-3 w-full bg-white rounded-md ">
      {/* First row */}
      <div className="flex flex-row bg-[#fafafa] w-full border-b  pb-2">
        {/* Left - first row */}
        <div className="justify-start flex items-center">
          {/* Name of discound */}
          <p className="text-gray-600 font-semibold mr-2">
            1. Khai trương cửa hàng
          </p>
          <div
            className="mt-2 p-1 flex items-center bg-gray-100 rounded-full w-6 h-6 cursor-pointer hover:bg-gray-300"
            title="lựa chọn giảm giá"
          >
            <CaretDownOutlined />
          </div>
        </div>

        <div className="flex-1"></div>
        {/* Right - first row */}
        <div className="justify-end flex flex-row">
          <p className="font-thin text-gray-700">20000</p>
          <div className=""></div>
        </div>
      </div>
      {/* Second row */}
      <div className="flex flex-row w-full border-b pt-2 pb-2">
        {/* Left - second row */}
        <div className="justify-start flex items-center">
          {/* Name of employee */}
          <p
            className="text-gray-500 cursor-not-allowed p-1"
            title="bạn không có quyền chỉnh sửa"
          >
            Tùng-ad
          </p>

          {/* editButton */}
          <div
            className="mx-3 p-1 flex items-center bg-gray-100 rounded-full w-6 h-6 cursor-pointer hover:bg-gray-300"
            title="thêm ghi chú"
            onClick={() => setIsModalOpen(true)}
          >
            <EditOutlined />
          </div>

          {/* split order button */}
          <button
            className={`px-3 py-1 rounded-full flex items-center ${
              hasProducts
                ? "bg-white text-gray-700 cursor-pointer hover:bg-gray-200"
                : "text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => setIsModalSplitOrderOpen(true)}
            disabled={!hasProducts}
          >
            <SplitCellsOutlined />
            <span className="pl-2">Tách đơn</span>
          </button>
        </div>

        <div className="flex-1"></div>
        {/* Right - second row */}
        <div className="justify-end flex flex-row">
          <div className="px-3 py-1">
            <span className="pr-2 font-semibold text-gray-700">Gốc:</span>
            <span className="line-through text-gray-500 font-thin">
              {totalPrice}
            </span>
          </div>
          <div className="px-1 py-1">
            <span className="pr-2 font-semibold text-gray-700">Tổng:</span>
            <span className="">{salePrice}</span>
          </div>
          <div className=""></div>
        </div>
      </div>
      {/* Third row */}
      <div className="flex w-full pt-4 pb-2">
        <button
          className={`flex-1 flex w-full items-center gap-2 px-4 mr-2 py-8
          border rounded-2xl justify-center ${
            hasProducts
              ? "bg-white text-lg font-semibold text-yellow-600 border-[#FFE6BC] border-2 cursor-pointer hover:bg-[#FFE6BC] hover:text-black hover:font-semibold"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <BellOutlined />
          <span className="">Thông báo (F10)</span>
        </button>
        <button
          className="flex-1 flex w-full items-center gap-2 px-4 ml-2 py-2
          rounded-2xl justify-center bg-[#FFE6BC] font-semibold text-lg
          hover:bg-[#f7daa8] text-[#4a4133]"
          onClick={showDrawerPayment}
        >
          <DollarOutlined />
          <span className="">Thanh toán (F9)</span>
        </button>
      </div>
      {/* Drawer Thanh toán */}
      <DrawerPaymentFinal
        isVisible={isDrawerPaymentVisible}
        onClose={onClosePaymentDrawer}
      />

      {/* Modal Note */}
      <Modal
        title="Thêm ghi chú"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          console.log("Ghi chú đơn hàng:", note);
          setIsModalOpen(false);
        }}
      >
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
        />
      </Modal>

      {/* Modal split */}
      <ModalSplitOrder
        open={isModalSplitOrderOpen}
        onCancel={() => setIsModalSplitOrderOpen(false)}
        onOk={(note) => {
          console.log("Tách đơn ghi chú:", note);
          setIsModalSplitOrderOpen(false);
        }}
        note={splitNote}
        setNote={setSplitNote}
      />
    </div>
  );
};

export default POSPayment;
