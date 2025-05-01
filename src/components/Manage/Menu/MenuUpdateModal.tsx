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
import { useAuth } from "../../../context/AuthContext";

const { Option } = Select;

interface MenuDetail {
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
  imageUrl: string;
}

interface ProductCategory {
  productCategoryId: number;
  productCategoryTitle: string;
}

interface Unit {
  unitId: number;
  unitTitle: string;
}

interface MenuUpdateModalProps {
  open: boolean;
  data: MenuDetail | null;
  onClose: () => void;
  onReload: () => void;
  onFetchDetail: (productId: number) => void;
}

const MenuUpdateModal: React.FC<MenuUpdateModalProps> = ({
  open,
  data,
  onClose,
  onReload,
  onFetchDetail,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [formData, setFormData] = useState<MenuDetail | null>(null);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (open && data) {
      setFormData({
        ...data,
        status: Boolean(data.status),
        imageUrl: data.imageUrl || "",
      });
      setFileList([]);
      fetchProductCategories();
      fetchUnits();
    } else {
      setFormData(null);
      setFileList([]);
    }
  }, [open, data]);

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
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setProductCategories(result);
    } catch (error) {
      message.error("Không thể tải danh mục hàng hóa");
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/units/get-all-units`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setUnits(result);
    } catch (error) {
      message.error("Không thể tải danh sách đơn vị");
    }
  };

  const handleChange = (key: keyof MenuDetail, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const validateForm = () => {
    if (!formData) {
      message.error("Dữ liệu món ăn không hợp lệ!");
      return false;
    }

    if (!formData.productName) {
      message.error("Tên món ăn không được để trống!");
      return false;
    }

    if (formData.productName.length > 100) {
      message.error("Tên món ăn không được vượt quá 100 ký tự!");
      return false;
    }

    if (!formData.productCategoryId) {
      message.error("Loại món ăn không được để trống!");
      return false;
    }

    if (!formData.unitId) {
      message.error("Đơn vị không được để trống!");
      return false;
    }

    if (!formData.costPrice || formData.costPrice < 0) {
      message.error("Giá vốn phải lớn hơn hoặc bằng 0!");
      return false;
    }

    if (!formData.sellPrice || formData.sellPrice < 0) {
      message.error("Giá bán phải lớn hơn hoặc bằng 0!");
      return false;
    }

    if (formData.sellPrice < formData.costPrice) {
      message.error("Giá bán phải lớn hơn hoặc bằng giá vốn!");
      return false;
    }

    if (formData.salePrice !== null && formData.salePrice !== undefined) {
      if (formData.salePrice < 0) {
        message.error("Giá khuyến mãi phải lớn hơn hoặc bằng 0!");
        return false;
      }
      if (
        formData.salePrice < formData.costPrice ||
        formData.salePrice > formData.sellPrice
      ) {
        message.error("Giá khuyến mãi phải nằm trong khoảng giữa giá vốn và giá bán!");
        return false;
      }
    }

    if (formData.productVat !== null && formData.productVat !== undefined) {
      if (formData.productVat < 0 || formData.productVat > 100) {
        message.error("VAT phải nằm trong khoảng từ 0 đến 100!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!formData || !validateForm()) {
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
        try {
          const formDataToSend = new FormData();
          formDataToSend.append("ProductName", formData.productName);
          formDataToSend.append("ProductCategoryId", formData.productCategoryId.toString());
          formDataToSend.append("CostPrice", formData.costPrice.toString());
          formDataToSend.append("SellPrice", formData.sellPrice.toString());
          if (formData.salePrice !== null && formData.salePrice !== undefined) {
            formDataToSend.append("SalePrice", formData.salePrice.toString());
          }
          if (formData.productVat !== null && formData.productVat !== undefined) {
            formDataToSend.append("ProductVat", formData.productVat.toString());
          }
          if (formData.description) {
            formDataToSend.append("Description", formData.description);
          }
          formDataToSend.append("UnitId", formData.unitId.toString());
          formDataToSend.append("IsAvailable", formData.isAvailable.toString());
          formDataToSend.append("Status", formData.status.toString());

          if (fileList.length > 0 && fileList[0].originFileObj) {
            formDataToSend.append("Image", fileList[0].originFileObj);
          }

          const response = await axios.put(
            `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/update-menu/${formData.productId}`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${authInfo.token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          message.success(response.data.message || "Cập nhật thành công!");
          onClose();
          onReload();
          onFetchDetail(formData.productId);
        } catch (error: any) {
          console.error("Lỗi khi cập nhật món ăn:", error);
          if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
              message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
              clearAuthInfo();
            } else if (status === 400) {
              const errorMessage =
                data.errors?.join(", ") || data.message || "Dữ liệu không hợp lệ!";
              message.error(errorMessage);
            } else if (status === 404) {
              message.error(data.message || "Không tìm thấy món ăn!");
            } else {
              message.error(data.message || "Cập nhật thất bại!");
            }
          } else {
            message.error("Lỗi kết nối đến server!");
          }
        }
      },
    });
  };

  if (!data || !formData) {
    return null;
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={800} centered>
      <h2 className="text-xl font-bold">CẬP NHẬT MÓN ĂN</h2>
      <h2 className="text-xl font-bold">Mã sản phẩm: {formData.productId}</h2>
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Column 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Tên món:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <Input
              className="flex-1"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Loại món:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <Select
              className="flex-1"
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
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Giá vốn:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <InputNumber
              className="flex-1"
              min={0}
              value={formData.costPrice}
              onChange={(value) => handleChange("costPrice", value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Giá bán:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <InputNumber
              className="flex-1"
              min={0}
              value={formData.sellPrice}
              onChange={(value) => handleChange("sellPrice", value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Giá khuyến mãi:</label>
            <InputNumber
              className="flex-1"
              min={0}
              value={formData.salePrice}
              onChange={(value) => handleChange("salePrice", value)}
            />
          </div>
        </div>
        {/* Column 2 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">
              Đơn vị:<span className="text-red-500 mr-[0.2vw]">*</span>
            </label>
            <Select
              className="flex-1"
              value={formData.unitId}
              onChange={(value) => handleChange("unitId", value)}
            >
              {units.map((unit) => (
                <Option key={unit.unitId} value={unit.unitId}>
                  {unit.unitTitle}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">VAT (%):</label>
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
            <Input.TextArea
              className="flex-1"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={2}
            />
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
          <div className="flex items-center space-x-3">
            <label className="w-32 font-medium">Ảnh:</label>
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              accept=".jpg,.jpeg,.png,.bmp"
              beforeUpload={(file) => {
                const isImage =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/bmp";
                  
                const isLt2M = file.size / 1024 / 1024 < 2;
              
                if (!isImage) {
                  message.error("Chỉ hỗ trợ file JPG/PNG/BMP!");
                }
                if (!isLt2M) {
                  message.error("Ảnh phải nhỏ hơn 2MB!");
                }
                return isImage && isLt2M;
              }}
              onChange={({ fileList }) => setFileList(fileList)}
              defaultFileList={
                formData.imageUrl
                  ? [{ uid: "-1", name: "image.jpg", url: formData.imageUrl, status: "done" }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Upload Ảnh</Button>
            </Upload>
          </div>
        </div>
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