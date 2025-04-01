import React, { useState } from "react";
import { Input, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModalCreateCustomer from "./ModalCreateCustomer";

interface Props {
  selectedTable: number | null;
  onCreateCustomer: () => void;
}

const mockCustomers = [
  "Nguyễn Văn A - 0123456789",
  "Trần Thị B - 0987654321",
  "Lê Văn C - 0345678912",
  "Phạm Thị D - 0567891234",
];

const POSTableAndCustomerBar: React.FC<Props> = ({
  selectedTable,
  onCreateCustomer,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      setFilteredCustomers(
        mockCustomers.filter((customer) =>
          customer.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectCustomer = (customer: string) => {
    setSearchValue(customer);
    setShowDropdown(false);
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
          suffix={
            <PlusOutlined
              className="cursor-pointer"
              onClick={() => {
                // console.log("Opening modal...");
                onCreateCustomer();
              }}
            />
          }
        />
        {showDropdown && filteredCustomers.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
            {filteredCustomers.map((customer, index) => (
              <div
                key={index}
                className="p-2 cursor-pointer hover:bg-[#fae9ca]"
                onMouseDown={() => handleSelectCustomer(customer)}
              >
                {customer}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSTableAndCustomerBar;
