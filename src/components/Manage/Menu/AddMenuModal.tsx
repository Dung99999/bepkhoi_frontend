import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";


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
  const { authInfo, clearAuthInfo } = useAuth();
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
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

  const [errors, setErrors] = useState({
    productName: false,
    productCategoryId: false,
    costPrice: false,
    sellPrice: false,
    salePrice: false,
    unitId: false,
  });

  const resetForm = () => {
    setFormData({
      productName: "",
      productCategoryId: null,
      costPrice: null,
      sellPrice: null,
      salePrice: null,
      productVat: 10,
      description: "",
      unitId: null,
      isAvailable: true,
      status: true,
      isDelete: false,
    });
    setFileList([]);
    setErrors({
      productName: false,
      productCategoryId: false,
      costPrice: false,
      sellPrice: false,
      salePrice: false,
      unitId: false,
    });
  };

  useEffect(() => {
    fetchProductCategories();
    fetchUnits();
  }, []);

  useEffect(() => {
    // Set default values for unitId and productCategoryId
    if (units.length > 0 && !formData.unitId) {
      const defaultUnit = units.find((unit) => unit.unitTitle === "cái");
      if (defaultUnit) {
        setFormData((prev) => ({ ...prev, unitId: defaultUnit.unitId }));
      }
    }
    if (productCategories.length > 0 && !formData.productCategoryId) {
      const defaultCategory = productCategories.find(
        (category) => category.productCategoryTitle === "Món khai vị"
      );
      if (defaultCategory) {
        setFormData((prev) => ({
          ...prev,
          productCategoryId: defaultCategory.productCategoryId,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, productCategories]);

  const fetchProductCategories = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/product-categories/get-all-categories`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );

      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setProductCategories(data);
    } catch (error) {
      message.error("Không thể tải danh mục hàng hóa");
    }
  };

  const fetchUnits = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/units/get-all-units`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );

      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch units");
      }

      const data = await response.json();
      setUnits(data);
    } catch (error) {
      message.error("Không thể tải danh sách đơn vị");
    }
  };

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: false }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {
      productName: !formData.productName,
      productCategoryId: !formData.productCategoryId,
      costPrice: !formData.costPrice || formData.costPrice <= 0,
      sellPrice:
        !formData.sellPrice ||
        (formData.costPrice !== null &&
          formData.sellPrice !== null &&
          formData.sellPrice < formData.costPrice)
          ? true
          : false,
      salePrice:
        formData.salePrice !== null &&
        formData.costPrice !== null &&
        formData.sellPrice !== null &&
        (formData.salePrice < formData.costPrice ||
          formData.salePrice > formData.sellPrice)
          ? true
          : false,
      unitId: !formData.unitId,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      if (newErrors.costPrice) message.error("Giá nhập gốc phải lớn hơn 0");
      if (newErrors.sellPrice)
        message.error("Giá bán phải lớn hơn hoặc bằng giá nhập gốc");
      if (newErrors.salePrice)
        message.error(
          "Giá khuyến mãi phải nằm trong khoảng giá gốc và giá bán"
        );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("ProductName", formData.productName);
      formDataToSend.append("ProductCategoryId", formData.productCategoryId!.toString());
      formDataToSend.append("CostPrice", formData.costPrice!.toString());
      formDataToSend.append("SellPrice", formData.sellPrice!.toString());
      if (formData.salePrice !== null) {
        formDataToSend.append("SalePrice", formData.salePrice.toString());
      }
      formDataToSend.append("ProductVat", formData.productVat.toString());
      if (formData.description) {
        formDataToSend.append("Description", formData.description);
      }
      formDataToSend.append("UnitId", formData.unitId!.toString());
      formDataToSend.append("IsAvailable", formData.isAvailable.toString());
      formDataToSend.append("Status", formData.status.toString());

      // Thêm file ảnh nếu có
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formDataToSend.append("Image", fileList[0].originFileObj);
      }

      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
        body: formDataToSend,
      });

      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }

      const result = await response.json();
      if (response.ok) {
        message.success("Món ăn đã được thêm thành công!");
        resetForm();
        onClose();
      } else {
        message.error(result.message || "Lỗi khi thêm món ăn");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến server");
    }
  };

  return (
    <Modal
      title="Thêm hàng hóa"
      open={visible}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      footer={null}
      width={800}
      className="p-4"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Mã hàng hóa:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <span className="text-gray-500">Mã hàng tự động</span>
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Tên hàng:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <Input
              className={`flex-1 ${errors.productName ? "border-red-500" : ""}`}
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
            {errors.productName && (
              <span className="text-red-500">Bắt buộc</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Giá nhập gốc:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <InputNumber
              className={`flex-1 ${errors.costPrice ? "border-red-500" : ""}`}
              min={1}
              value={formData.costPrice}
              onChange={(value) => handleChange("costPrice", value)}
            />
            {errors.costPrice && <span className="text-red-500">Bắt buộc</span>}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Giá bán:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <InputNumber
              className={`flex-1 ${errors.sellPrice ? "border-red-500" : ""}`}
              min={1}
              value={formData.sellPrice}
              onChange={(value) => handleChange("sellPrice", value)}
            />
            {errors.sellPrice && <span className="text-red-500">Bắt buộc</span>}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Giá khuyến mãi:</label>
            <InputNumber
              className={`flex-1 ${errors.salePrice ? "border-red-500" : ""}`}
              min={1}
              value={formData.salePrice}
              onChange={(value) => handleChange("salePrice", value)}
            />
            {errors.salePrice && (
              <span className="text-red-500">Không hợp lệ</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Loại hàng:</label>
            <Select
              className={`flex-1 ${
                errors.productCategoryId ? "border-red-500" : ""
              }`}
              value={formData.productCategoryId}
              onChange={(value) => handleChange("productCategoryId", value)}
            >
              {productCategories.map((category) => (
                <Option
                  key={category.productCategoryId}
                  value={category.productCategoryId}
                >
                  {category.productCategoryTitle}
                </Option>
              ))}
            </Select>
            {errors.productCategoryId && (
              <span className="text-red-500">Bắt buộc</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Thêm ảnh:</label>
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Thuế VAT:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <InputNumber
              className="flex-1"
              min={0}
              max={100}
              value={formData.productVat}
              onChange={(value) => handleChange("productVat", value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Mô tả:</label>
            <Input
              className="flex-1"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Đơn vị:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <Select
              className={`flex-1 ${errors.unitId ? "border-red-500" : ""}`}
              value={formData.unitId}
              onChange={(value) => handleChange("unitId", value)}
            >
              {units.map((unit) => (
                <Option key={unit.unitId} value={unit.unitId}>
                  {unit.unitTitle}
                </Option>
              ))}
            </Select>
            {errors.unitId && <span className="text-red-500">Bắt buộc</span>}
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Còn hàng:</label>
            <Switch
              checked={formData.isAvailable}
              onChange={(checked) => handleChange("isAvailable", checked)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Hiển thị:</label>
            <Switch
              checked={formData.status}
              onChange={(checked) => handleChange("status", checked)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          className="bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={handleSubmit}
        >
          Lưu
        </Button>
        <Button
          className="bg-gray-300 px-6 py-2 rounded-md"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          Bỏ qua
        </Button>
      </div>
    </Modal>
  );
};

export default AddMenuModal;