import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  open: boolean;
  onClose: () => void;
}

interface CustomerData {
  customerId: number;
  customerName: string;
  phone: string;
}

async function fetchCreateNewCustomer(
  customerName: string,
  phone: string,
  token: string,
  clearAuthInfo: () => void
): Promise<CustomerData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Customer/create-new-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerName,
        phone,
      }),
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create customer: ${errorText}`);
    }

    const result = await response.json();
    if (result.message === "Customer created successfully" && result.data) {
      return result.data as CustomerData;
    } else {
      throw new Error("Failed to create customer: " + result.message);
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    message.error("Tạo khách hàng thất bại. Vui lòng kiểm tra lại thông tin và thử lại.");
    return null;
  }
}

const ModalCreateCustomer: React.FC<Props> = ({ open, onClose }) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    try {
      const values = await form.validateFields();
      const newCustomer = await fetchCreateNewCustomer(
        values.customerName,
        values.phone,
        authInfo.token,
        clearAuthInfo
      );

      if (newCustomer) {
        message.success("Tạo khách hàng thành công!");
        form.resetFields();
        onClose();
      }
    } catch (error) {
      // Lỗi đã được xử lý trong fetchCreateNewCustomer
    }
  };

  return (
    <Modal
      title="Thêm khách hàng"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="flex flex-col w-full"
      >
        <div className="flex flex-col gap-4">
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
              { whitespace: true, message: "Tên không được để trống" },
            ]}
          >
            <Input
              className="border-b border-gray-400 p-1 focus:outline-none focus:border-gray-500"
              placeholder="Nhập tên khách hàng"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^(0|\+84)[0-9]{9}$/,
                message: "Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 10 chữ số",
              },
            ]}
          >
            <Input
              className="border-b border-gray-400 p-1 focus:outline-none focus:border-gray-500"
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
        </div>
        <div className="text-end my-5">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#fccb77] mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-[#fab848]"
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>
          <Button
            className="bg-gray-300 mx-3 px-3 py-2 rounded-lg font-semibold hover:bg-gray-400"
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            icon={<StopOutlined />}
          >
            Bỏ qua
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateCustomer;