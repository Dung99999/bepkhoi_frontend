import React, { useState, useEffect } from "react";
import { Input, Button, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalCreateCustomer from "./ModalCreateCustomer";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
const token = localStorage.getItem("Token");

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
  phone: string
}
async function fetchCustomerList(): Promise<CustomerModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Customer`, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch customer list");
    }
    const data: CustomerModel[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer list:", error);
    return [];
  }
}

async function fetchCustomerByOrderId(orderId: number): Promise<FetchCustomerById | null> {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/get-customer-of-order/${orderId}`, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      console.log("Disconnect Sever...", response.json);
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data as FetchCustomerById;
    } else {
      console.log("Customer not found or API returned false.");
      return null;
    }
  } catch (error) {
    console.error("Unexpected error has been occur:", error);
    return null;
  }
}

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

async function assignCustomerToOrder(orderId: number, customerId: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}api/orders/assign-customer-to-order?orderId=${orderId}&customerId=${customerId}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to assign customer to order");
    }

    return true;
  } catch (error) {
    console.error("Error assigning customer to order:", error);
    return false;
  }
}

const fetchDeleteCustomerFromOrder = async (orderId: number) => {
  try {
    // Gửi yêu cầu POST đến API để xóa CustomerId từ Order
    const response = await fetch(`${API_BASE_URL}api/orders/remove-customer/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token,
      },
    });

    // Kiểm tra nếu response từ API là thành công
    if (response.ok) {
      const data = await response.json();
      return true;
    } else {
      const errorData = await response.json();
      console.error("Fail to deleting customer from order:", errorData)
      return false;
    }
  } catch (error) {
    // Nếu có lỗi trong quá trình gọi API (ví dụ: mạng không ổn định)
    console.error('Error occurred while deleting customer from order:', error);
    alert('An error occurred. Please try again.');
    return false;
  }
};


const POSTableAndCustomerBar: React.FC<Props> = ({
  selectedTable,
  onCreateCustomer,
  selectedOrder,
  orderType,
  selectedShipper,
  currentTab
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerModel[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customerList, setCustomerList] = useState<CustomerModel[]>([]);
  const [isLockSearch, setIsLockSearch] = useState(false);


  const loadCustomers = async () => {
    const customerList = await fetchCustomerList();
    setCustomerList(customerList);
  };
  useEffect(() => {
    loadCustomers();
  }, []);
  useEffect(() => {
    const loadCustomerByOrder = async () => {
      if (selectedOrder !== null) {
        const customer = await fetchCustomerByOrderId(selectedOrder);
        if (customer) {
          setSearchValue(`${customer.customerName} - ${customer.phone}`);
          setIsLockSearch(true);
        } else {
          // Không có khách => reset
          setSearchValue("");
          setIsLockSearch(false);
        }
      } else {
        // selectedOrder bị reset => cũng reset input
        setSearchValue("");
        setIsLockSearch(false);
      }
    };
    if(selectedOrder == Number(currentTab)){
      loadCustomerByOrder();
    }
  }, [selectedOrder]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim()) {
      const keyword = removeVietnameseTones(value.trim().toLowerCase());

      const matchedByName = customerList.filter((customer) =>
        removeVietnameseTones(customer.customerName).includes(keyword)
      );

      const matchedByPhone = customerList.filter(
        (customer) =>
          customer.phone.includes(value) && !matchedByName.includes(customer)
      );

      const combinedResults = [...matchedByName, ...matchedByPhone];

      setFilteredCustomers(combinedResults);
      setShowDropdown(true);
    } else {
      setFilteredCustomers([]);
      setShowDropdown(false);
    }
  };

  const handleSelectCustomer = async (customer: CustomerModel) => {
    setSearchValue(`${customer.customerName} - ${customer.phone}`);
    setShowDropdown(false);
    setIsLockSearch(true);

    // Gọi API gán khách vào đơn
    if (selectedOrder !== null) {
      const success = await assignCustomerToOrder(selectedOrder, customer.customerId);
      if (success) {
        console.log(`Customer ${customer.customerId} assigned to order ${selectedOrder}`);
        message.success("Thêm khách hàng thành công");
      } else {
        console.warn("Không thể gán khách hàng vào đơn.");
        message.error("Thêm khách hàng thất bại, vui lòng thử lại")
      }
    } else {
      console.warn("Không có selectedOrder để gán khách hàng.");
      message.error("Thêm khách hàng thất bại, vui lòng thử lại")
    }
  };
  const handleClearCustomer = async () => {
    // Gọi API để xóa khách hàng khỏi đơn hàng
    if (selectedOrder !== null) {
      const success = await fetchDeleteCustomerFromOrder(selectedOrder);
      if (success) {
        console.log(`Customer has been removed from order ${selectedOrder}`);
        message.success("Đã loại bỏ khách hàng khỏi đơn")
      } else {
        console.warn("Failed to remove customer from order.");
        message.success("Loại bỏ khách hàng khỏi đơn thất bại, vui lòng thử lại")
      }
    }
    setSearchValue("");  
    setIsLockSearch(false);  
  };

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
            // <PlusOutlined
            //   className="cursor-pointer"
            //   onClick={() => {
            //     // console.log("Opening modal...");
            //     onCreateCustomer();
            //   }}
            // />
            isLockSearch ? (
              <DeleteOutlined
                className="cursor-pointer"
                onClick={handleClearCustomer}  // Thực hiện xóa khách hàng
              />
            ) : (
              <PlusOutlined
                className="cursor-pointer"
                onClick={() => {
                  // Giả sử bạn sẽ mở modal tạo khách hàng mới
                  //console.log("Opening modal...");
                  onCreateCustomer();
                }}
              />
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
