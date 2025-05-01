import React, { useState, useEffect } from "react";
import { Modal, InputNumber, Form, Button, message } from "antd";
import { useAuth } from "../../../context/AuthContext";

interface ModalSettingPriceProps {
  open: boolean;
  product: {
    productId: number;
    productName: string;
    costPrice: number;
    sellPrice: number;
    salePrice: number;
    productVat: number;
  } | null;
  onClose: () => void;
  onReload: () => void;
}

const ModalSettingPriceById: React.FC<ModalSettingPriceProps> = ({
  open,
  product,
  onClose,
  onReload,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSellPrice(product.sellPrice);
      setSalePrice(product.salePrice);
    }
  }, [product]);

  const handleUpdatePrice = async () => {
    if (!product) return;

    // Kiểm tra "Đơn giá"
    if (!sellPrice || sellPrice <= 0) {
      message.error("Đơn giá là bắt buộc và phải lớn hơn 0!");
      return;
    }
    if (sellPrice < product.costPrice) {
      message.error("Đơn giá phải lớn hơn hoặc bằng giá vốn!");
      return;
    }

    // Nếu "Giá sau KM" không được nhập, gán bằng "Đơn giá"
    const finalSalePrice = salePrice || sellPrice;

    // Kiểm tra "Giá sau KM"
    if (finalSalePrice <= 0) {
      message.error("Giá sau KM phải lớn hơn 0!");
      return;
    }
    if (finalSalePrice < product.costPrice || finalSalePrice > sellPrice) {
      message.error("Giá sau KM phải nằm trong khoảng từ giá vốn đến đơn giá!");
      return;
    }
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }
    setLoading(true);
    const requestData = {
      productId: product.productId,
      costPrice: product.costPrice,
      sellPrice: sellPrice,
      salePrice: finalSalePrice,
      productVat: product.productVat ?? 10,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/Menu/update-price/${product.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo.token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      const responseData = await response.json();
      if (response.ok) {
        message.success("Cập nhật giá thành công!");
        onClose();
        onReload();
      } else {
        message.error(
          responseData.message || "Cập nhật thất bại, thử lại sau!"
        );
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? `Cập nhật giá: ${product.productName}` : "Cập nhật giá"}
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleUpdatePrice}
          style={{
            backgroundColor: "#4096FF",
            border: "none",
          }}
        >
          Lưu
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
      ]}
    >
      {product ? (
        <Form layout="vertical">
          <Form.Item label="Giá vốn">
            <InputNumber
              value={product.costPrice}
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Đơn giá">
            <InputNumber
              min={0}
              value={sellPrice}
              onChange={(value) => setSellPrice(value ?? 0)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Giá sau KM">
            <InputNumber
              min={0}
              value={salePrice}
              onChange={(value) => setSalePrice(value ?? 0)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      ) : (
        <p>Không có dữ liệu sản phẩm.</p>
      )}
    </Modal>
  );
};

export default ModalSettingPriceById;