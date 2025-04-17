import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Switch,
  Select,
} from "antd";
import { UploadOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

interface MenuItem {
  productId: number;
  productName: string;
  productCategoryId: number;
  costPrice: number;
  sellPrice: number;
  salePrice: number;
  productVat: number;
  description: string;
  unitId: number;
  isAvailable: boolean;
  status: boolean;
  isDelete: boolean;
  image?: string;
}

interface MenuUpdateModalProps {
  open: boolean;
  data: MenuItem;
  onClose: () => void;
  onReload: () => void;
}

const MenuUpdateModal: React.FC<MenuUpdateModalProps> = ({
  open,
  data,
  onClose,
  onReload,
}) => {
  const [formData, setFormData] = useState<MenuItem>({ ...data });
  const [emptyField, setEmptyField] = useState<string>("");

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        productId: data.productId,
        status: Boolean(data.status),
      }));
    }
  }, [open, data]);

  const handleChange = (key: keyof MenuItem, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.costPrice || formData.costPrice <= 0) {
      message.error("Giá vốn phải lớn hơn 0!");
      return false;
    }

    if (!formData.sellPrice || formData.sellPrice <= 0) {
      message.error("Giá bán phải lớn hơn 0!");
      return false;
    }

    if (formData.sellPrice < formData.costPrice) {
      message.error("Giá bán phải lớn hơn hoặc bằng giá vốn!");
      return false;
    }

    if (!formData.salePrice || formData.salePrice <= 0) {
      message.error("Giá khuyến mãi phải lớn hơn 0!");
      return false;
    }

    if (
      formData.salePrice < formData.costPrice ||
      formData.salePrice > formData.sellPrice
    ) {
      message.error(
        "Giá khuyến mãi phải nằm trong khoảng giữa giá vốn và giá bán!"
      );
      return false;
    }

    return true;
  };
  const handleSubmit = async () => {
    console.log("Đang gọi handleSubmit...");
    if (!validateForm()) {
      message.warning(`Trường "${emptyField}" không được để trống!`);
      return;
    }

    Modal.confirm({
      title: "Xác nhận cập nhật",
      content: "Bạn có chắc chắn muốn cập nhật món ăn này?",
      okButtonProps: {
        style: {
          backgroundColor: "#4096FF",
          borderColor: "#4096FF",
          color: "#fff",
        },
      },
      onOk: async () => {
        console.log("Xác nhận cập nhật, gửi API...");
        try {
          const res = await axios.put(
            `https://localhost:7257/api/Menu/update-menu/${formData.productId}`,
            formData,
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("Phản hồi từ API:", res.data);
          message.success("Cập nhật thành công!");
          onClose();
          onReload();
        } catch (error) {
          console.error("Lỗi API:", error);
          message.error("Cập nhật thất bại!");
        }
      },
    });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={700} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT MÓN ĂN</h2>
      <h2 className="text-xl font-bold">Mã sản phẩm: {data.productId}</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          required
          addonBefore={
            <span>
              <span className="text-red-500">*</span> Tên món ăn
            </span>
          }
          value={formData.productName}
          onChange={(e) => handleChange("productName", e.target.value)}
        />

        <InputNumber
          required
          addonBefore={
            <span>
              <span className="text-red-500">*</span> Giá vốn
            </span>
          }
          value={formData.costPrice}
          onChange={(value) => handleChange("costPrice", value)}
          className="w-full"
        />

        <InputNumber
          required
          addonBefore={
            <span>
              <span className="text-red-500">*</span> Giá bán
            </span>
          }
          value={formData.sellPrice}
          onChange={(value) => handleChange("sellPrice", value)}
          className="w-full"
        />

        <InputNumber
          required
          addonBefore={
            <span>
              <span className="text-red-500">*</span> Giá khuyến mãi
            </span>
          }
          value={formData.salePrice}
          onChange={(value) => handleChange("salePrice", value)}
          className="w-full"
        />

        <InputNumber
          required
          addonBefore={
            <span>
              <span className="text-red-500">*</span> VAT (%)
            </span>
          }
          value={formData.productVat}
          onChange={(value) => handleChange("productVat", value)}
          className="w-full"
        />
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <span>Hiển thị:</span>
            <Switch
              checked={formData.status}
              onChange={(checked) => handleChange("status", checked)}
              className="ml-2"
            />
          </div>

          <div className="flex items-center">
            <span>Còn hàng:</span>
            <Switch
              checked={formData.isAvailable}
              onChange={(checked) => handleChange("isAvailable", checked)}
              className="ml-2"
            />
          </div>
        </div>
        <div>
          <label className="font-normal">Mô tả:</label>
          <Input.TextArea
            required
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />
        </div>
        <Upload
          action="#"
          listType="picture"
          maxCount={1}
          className="mt-[2vw]"
          defaultFileList={
            formData.image
              ? [{ uid: "-1", name: "image.jpg", url: formData.image }]
              : []
          }
        >
          <Button icon={<UploadOutlined />}>Upload Ảnh</Button>
        </Upload>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          style={{
            backgroundColor: "#4096FF",
          }}
        >
          Lưu
        </Button>
        <Button icon={<CloseOutlined />} onClick={onClose}>
          Hủy
        </Button>
      </div>
    </Modal>
  );
};

export default MenuUpdateModal;
