import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalCreateCustomer from "./ModalCreateCustomer";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedTable: number | null;
  selectedShipper: number | null;
  orderType: number | null;
  onCreateCustomer: () => void;
  selectedOrder: number | null;
  currentTab: string | null;
}

interface CustomerModel {
  customerId: number;
  customerName: string;
  phone: string;
  totalAmountSpent: number;
}

interface FetchCustomerById {
  customerId: number;
  customerName: string;
  phone: string;
}

const fetchCustomerList = async (
  token: string,
  clearAuthInfo: () => void
): Promise<CustomerModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/Customer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch customer list");
    }

    const data: CustomerModel[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer list:", error);
    return [];
  }
};

const fetchCustomerByOrderId = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<FetchCustomerById | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-customer-of-order/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return null;
    }

    if (!response.ok) {
      return null;
    }
    if (response.status === 404) {
      return null;
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data as FetchCustomerById;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Unexpected error has been occur:", error);
    return null;
  }
};

const assignCustomerToOrder = async (
  orderId: number,
  customerId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}api/orders/assign-customer-to-order?orderId=${orderId}&customerId=${customerId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    const result = await response.json();

    if (!response.ok || !result.success) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error assigning customer to order:", error);
    return false;
  }
};

const fetchDeleteCustomerFromOrder = async (
  orderId: number,
  token: string,
  clearAuthInfo: () => void
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/remove-customer/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      return false;
    }

    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      const errorData = await response.json();
      console.error("Fail to deleting customer from order:", errorData);
      return false;
    }
  } catch (error) {
    console.error("Error occurred while deleting customer from order:", error);
    alert("An error occurred. Please try again.");
    return false;
  }
};

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const POSTableAndCustomerBar: React.FC<Props> = ({
  selectedTable,
  onCreateCustomer,
  selectedOrder,
  orderType,
  selectedShipper,
  currentTab,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerModel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customerList, setCustomerList] = useState<CustomerModel[]>([]);
  const [isLockSearch, setIsLockSearch] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    const customerList = await fetchCustomerList(authInfo.token, clearAuthInfo);
    setCustomerList(customerList);
  }, [authInfo?.token, clearAuthInfo]);

  const loadCustomerByOrder = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (selectedOrder !== null) {
      const customer = await fetchCustomerByOrderId(selectedOrder, authInfo.token, clearAuthInfo);
      if (customer) {
        setSearchValue(`${customer.customerName} - ${customer.phone}`);
        setIsLockSearch(true);
      } else {
        setSearchValue("");
        setIsLockSearch(false);
      }
    } else {
      setSearchValue("");
      setIsLockSearch(false);
    }
  }, [authInfo?.token, clearAuthInfo, selectedOrder]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      if (value.trim()) {
        const keyword = removeVietnameseTones(value.trim().toLowerCase());

        const matchedByName = customerList.filter((customer) =>
          removeVietnameseTones(customer.customerName).includes(keyword)
        );

        const matchedByPhone = customerList.filter(
          (customer) => customer.phone.includes(value) && !matchedByName.includes(customer)
        );

        const combinedResults = [...matchedByName, ...matchedByPhone];

        setFilteredCustomers(combinedResults);
        setShowDropdown(true);
      } else {
        setFilteredCustomers([]);
        setShowDropdown(false);
      }
    },
    [customerList]
  );

  const handleSelectCustomer = useCallback(
    async (customer: CustomerModel) => {
      if (!authInfo?.token) {
        message.error("Vui lòng đăng nhập để tiếp tục.");
        return;
      }
      setSearchValue(`${customer.customerName} - ${customer.phone}`);
      setShowDropdown(false);
      setIsLockSearch(true);

      if (selectedOrder !== null) {
        const success = await assignCustomerToOrder(
          selectedOrder,
          customer.customerId,
          authInfo.token,
          clearAuthInfo
        );
        if (success) {
          message.success("Thêm khách hàng thành công");
        } else {
          message.error("Thêm khách hàng thất bại, vui lòng thử lại");
        }
      } else {
        message.error("Thêm khách hàng thất bại, vui lòng thử lại");
      }
    },
    [authInfo?.token, clearAuthInfo, selectedOrder]
  );

  const handleClearCustomer = useCallback(async () => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }
    if (selectedOrder !== null) {
      const success = await fetchDeleteCustomerFromOrder(
        selectedOrder,
        authInfo.token,
        clearAuthInfo
      );
      if (success) {
        message.success("Đã loại bỏ khách hàng khỏi đơn");
      } else {
        message.error("Loại bỏ khách hàng khỏi đơn thất bại, vui lòng thử lại");
      }
    }
    setSearchValue("");
    setIsLockSearch(false);
  }, [authInfo?.token, clearAuthInfo, selectedOrder]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (selectedOrder == Number(currentTab)) {
      loadCustomerByOrder();
    }
  }, [selectedOrder, currentTab, loadCustomerByOrder]);

  return (
    <div className="flex items-center rounded-md w-full h-12 mt-0 relative">
      <div className="w-1/6 text-lg font-semibold rounded-full flex items-center justify-center bg-[#ffe6bc]">
        {selectedTable === null && selectedShipper === null && "Mang về"}
        {selectedTable === null && selectedShipper !== null && `Nhân viên ${selectedShipper}`}
        {selectedTable !== null && selectedShipper === null && `Bàn ${selectedTable}`}
      </div>

      <div className="w-5/6 p-2 rounded-md h-full relative">
        <Input
          placeholder="Tìm khách hàng (Tên, SĐT, Mã KH)"
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full border-black focus:border-yellow-500 focus:ring-yellow-500 rounded-full"
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          disabled={isLockSearch}
          suffix={
            isLockSearch ? (
              <DeleteOutlined className="cursor-pointer" onClick={handleClearCustomer} />
            ) : (
              <PlusOutlined className="cursor-pointer" onClick={onCreateCustomer} />
            )
          }
        />
        {showDropdown && filteredCustomers.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.customerId}
                className="p-2 cursor-pointer hover:bg-[#fae9ca]"
                onMouseDown={() => handleSelectCustomer(customer)}
              >
                {customer.customerName} - {customer.phone}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSTableAndCustomerBar;