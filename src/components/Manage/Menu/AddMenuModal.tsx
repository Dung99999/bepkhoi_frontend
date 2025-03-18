import React, { useState, useEffect } from "react";
import { Modal, Input, InputNumber, Select, Switch, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface ProductCategory {
    productCategoryId: number;
    productCategoryTitle: string;
}

interface Unit {
    unitId: number;
    unitTitle: string;
}

interface AddMenuModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({ visible, onClose }) => {
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [formData, setFormData] = useState({
      productName: "",
      productCategoryId: null as number | null,
      costPrice: null as number | null,
      sellPrice: null as number | null,
      salePrice: null as number | null,
      productVat: 10,
      description: "",
      unitId: null as number | null,
      isAvailable: true,
      status: true,
      isDelete: false,
  });

  useEffect(() => {
    fetchProductCategories();
    fetchUnits();
  }, []);

  const fetchProductCategories = async () => {
    try {
      const response = await fetch("https://localhost:7257/api/product-categories/get-all-categories");
      const data = await response.json();
      setProductCategories(data);
    } catch (error) {
      message.error("Không thể tải danh mục hàng hóa");
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch("https://localhost:7257/api/units/get-all-units");
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      message.error("Không thể tải danh sách đơn vị");
    }
  };

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://localhost:7257/api/Menu/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        message.success("Món ăn đã được thêm thành công!");
        onClose();
      } else {
        message.error(result.message || "Lỗi khi thêm món ăn");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server");
    }
  };

  return (
    <Modal title="Thêm hàng hóa" open={visible} onCancel={onClose} footer={null} width={800} className="p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Mã hàng hóa:</label>
            <span className="text-gray-500">Mã hàng tự động</span>
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Tên hàng:</label>
            <Input className="flex-1" value={formData.productName} onChange={(e) => handleChange("productName", e.target.value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Giá nhập gốc:</label>
            <InputNumber className="flex-1" min={1} value={formData.costPrice} onChange={(value) => handleChange("costPrice", value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Giá bán:</label>
            <InputNumber className="flex-1" min={1} value={formData.sellPrice} onChange={(value) => handleChange("sellPrice", value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Giá khuyến mãi:</label>
            <InputNumber className="flex-1" min={1} value={formData.salePrice} onChange={(value) => handleChange("salePrice", value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Loại hàng:</label>
            <Select className="flex-1" value={formData.productCategoryId} onChange={(value) => handleChange("productCategoryId", value)}>
              {productCategories.map((category) => (
                <Option key={category.productCategoryId} value={category.productCategoryId}>
                  {category.productCategoryTitle}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Thêm ảnh:</label>
            <Upload>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Thuế VAT:</label>
            <InputNumber className="flex-1" min={0} max={100} value={formData.productVat} onChange={(value) => handleChange("productVat", value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Mô tả:</label>
            <Input className="flex-1" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Đơn vị:</label>
            <Select className="flex-1" value={formData.unitId} onChange={(value) => handleChange("unitId", value)}>
              {units.map((unit) => (
                <Option key={unit.unitId} value={unit.unitId}>
                  {unit.unitTitle}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Còn hàng:</label>
            <Switch checked={formData.isAvailable} onChange={(checked) => handleChange("isAvailable", checked)} />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Hiển thị:</label>
            <Switch checked={formData.status} onChange={(checked) => handleChange("status", checked)} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button className="bg-green-600 text-white px-6 py-2 rounded-md" onClick={handleSubmit}>
          Lưu
        </Button>
        <Button className="bg-gray-300 px-6 py-2 rounded-md" onClick={onClose}>
          Bỏ qua
        </Button>
      </div>
    </Modal>
  );
};

export default AddMenuModal;
