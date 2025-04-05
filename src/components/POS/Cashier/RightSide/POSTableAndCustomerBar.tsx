import React, { useState , useEffect} from "react";
import { Input, Button, Modal } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalCreateCustomer from "./ModalCreateCustomer";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedTable: number | null;
  onCreateCustomer: () => void;
  onCustomerSelect: (customerId: number|null) => void;
  selectedOrder: number | null;
}

interface CustomerModel{
  customerId : number;
  customerName: string;
  phone: string;
  totalAmountSpent: number;
}
interface FetchCustomerById{
  customerId : number;
  customerName: string;
  phone: string 
}
async function fetchCustomerList(): Promise<CustomerModel[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/Customer`);
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
    const response = await fetch(`${API_BASE_URL}api/orders/get-customer-of-order/${orderId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch customer");
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as FetchCustomerById;
    } else {
      console.warn("Customer not found or API returned false.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching customer by order ID:", error);
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

const fetchDeleteCustomerFromOrder = async (orderId:number) => {
  try {
    // Gửi yêu cầu POST đến API để xóa CustomerId từ Order
    const response = await fetch(`${API_BASE_URL}api/orders/remove-customer/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Nếu cần có token thì thêm vào header Authorization
        // 'Authorization': `Bearer ${yourToken}`
      },
    });

    // Kiểm tra nếu response từ API là thành công
    if (response.ok) {
      const data = await response.json();
      alert(data.message);  // Thông báo thành công
      return true;
    } else {
      // Nếu thất bại, lấy thông báo lỗi từ API và hiển thị
      const errorData = await response.json();
      alert(errorData.Message || 'Something went wrong!');
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
  onCustomerSelect,
  selectedOrder,
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
  },[]);
  useEffect(() => {
    const loadCustomerByOrder = async () => {
      if (selectedOrder !== null) {
        const customer = await fetchCustomerByOrderId(selectedOrder);
        if (customer) {
          setSearchValue(`${customer.customerName} - ${customer.phone}`);
          setIsLockSearch(true);
          onCustomerSelect(customer.customerId);
        } else {
          // Không có khách => reset
          setSearchValue("");
          setIsLockSearch(false);
          onCustomerSelect(null);
        }
      } else {
        // selectedOrder bị reset => cũng reset input
        setSearchValue("");
        setIsLockSearch(false);
        onCustomerSelect(null);
      }
    };
    loadCustomerByOrder();
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

  // const handleSelectCustomer = (customer: CustomerModel) => {
  //   setSearchValue(`${customer.customerName} - ${customer.phone}`);
  //   setShowDropdown(false);
  //   onCustomerSelect(customer.customerId);
  //   setIsLockSearch(true);
  // };
  const handleSelectCustomer = async (customer: CustomerModel) => {
    setSearchValue(`${customer.customerName} - ${customer.phone}`);
    setShowDropdown(false);
    setIsLockSearch(true);
  
    // Gọi API gán khách vào đơn
    if (selectedOrder !== null) {
      const success = await assignCustomerToOrder(selectedOrder, customer.customerId);
      if (success) {
        console.log(`Customer ${customer.customerId} assigned to order ${selectedOrder}`);
        onCustomerSelect(customer.customerId); // thông báo ra ngoài
      } else {
        console.warn("Không thể gán khách hàng vào đơn.");
        // Bạn có thể show notification ở đây nếu muốn
      }
    } else {
      console.warn("Không có selectedOrder để gán khách hàng.");
    }
  };
  const handleClearCustomer = async () => {
  // Gọi API để xóa khách hàng khỏi đơn hàng
  if (selectedOrder !== null) {
    const success = await fetchDeleteCustomerFromOrder(selectedOrder);
    if (success) {
      console.log(`Customer has been removed from order ${selectedOrder}`);
    } else {
      console.warn("Failed to remove customer from order.");
    }
  }    
    setSearchValue("");  // Xóa ô tìm kiếm
    onCustomerSelect(null);  // Xóa ID khách hàng đã chọn
    setIsLockSearch(false);  // Mở lại ô tìm kiếm và chuyển suffix thành PlusOutlined
  };

  return (
    <div className="flex items-center rounded-md w-full h-12 mt-0 relative">
      <div className="w-1/6 text-lg font-semibold rounded-full flex items-center justify-center bg-[#ffe6bc]">
        Bàn: {selectedTable !== null ? selectedTable : "~"}
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
