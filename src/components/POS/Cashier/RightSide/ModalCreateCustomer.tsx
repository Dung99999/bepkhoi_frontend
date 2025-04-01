import React from "react";
import { Modal, Input, Button, Radio } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalCreateCustomer: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal
      title="Thêm khách hàng"
      open={open}
      onCancel={() => {
        // console.log("Closing modal...");
        onClose();
      }}
      footer={null}
    >
      <div className="flex flex-col w-full justify-between">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <p className="w-1/3">Loại khách</p>
            <select className="border p-1 rounded flex-1">
              <option value="ca-nhan">Cá nhân</option>
              <option value="cong-ty">Công ty</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Tên khách hàng</p>
            <input
              type="text"
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Điện thoại</p>
            <input
              type="text"
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Địa chỉ</p>
            <input
              type="text"
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="w-1/3">Email</p>
            <input
              type="text"
              className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
        <div className="text-end my-5 ">
          <button className="bg-[#fccb77] mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-[#fab848]">
            <SaveOutlined />
            <span className="ml-2">Lưu</span>
          </button>
          <button className="bg-gray-300 mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-gray-400">
            <StopOutlined />
            <span className="ml-2">Bỏ qua</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateCustomer;
