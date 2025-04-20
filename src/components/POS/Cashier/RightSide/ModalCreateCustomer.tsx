import React from "react";
import { useState, useEffect } from "react";
import { Modal, Input, Button, Radio } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
const token = localStorage.getItem("Token");

interface Props {
  open: boolean;
  onClose: () => void;
}

const fetchCreateNewCustomer = async (customerName: string, phone: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/Customer/create-new-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        customerName: customerName,
        phone: phone,
      }),
    });

    if (!response.ok) {
      // Nếu response không thành công, ném lỗi
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }
    const result = await response.json();
    // Kiểm tra xem API trả về kết quả thành công
    if (result.message === "Customer created successfully") {
      console.log("Customer created:", result.data);
      return result.data;
    } else {
      throw new Error("Failed to create customer. " + result.message);
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
};

// async function 

const ModalCreateCustomer: React.FC<Props> = ({ open, onClose }) => {


  const clearFormFields = () => {
    const customerNameInput = document.getElementsByName("customerName")[0] as HTMLInputElement;
    const phoneInput = document.getElementsByName("phone")[0] as HTMLInputElement;
    customerNameInput.value = "";
    phoneInput.value = "";
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customerName = (form.elements.namedItem("customerName") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const newCustomer = await fetchCreateNewCustomer(customerName, phone);
    if (newCustomer) {
      console.log("Tạo khách hàng thành công!");
      form.reset();
      onClose();
    } else {
      console.log("Tạo khách hàng thất bại!");
      alert("Tạo khách hàng thất bại. Vui lòng kiểm tra lại thông tin và thử lại.");
    }
  };

  return (
    <Modal
      title="Thêm khách hàng"
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full justify-between">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="w-1/3">Tên khách hàng</p>
              <input
                name="customerName"
                type="text"
                className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <p className="w-1/3">Điện thoại</p>
              <input
                name="phone"
                type="text"
                className="border-b border-gray-400 p-1 flex-1 focus:outline-none focus:border-gray-500"
                pattern="^(0|\+84)[0-9]{9}$"
                required
              />
            </div>
          </div>
          <div className="text-end my-5 ">
            <button className="bg-[#fccb77] mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-[#fab848]"
              type="submit"
            >
              <SaveOutlined />
              <span className="ml-2">Lưu</span>
            </button>
            <button
              className="bg-gray-300 mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-gray-400"
              type="button"
              onClick={() => {
                clearFormFields();
                onClose();
              }}
            >
              <StopOutlined />
              <span className="ml-2">Bỏ qua</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCreateCustomer;
