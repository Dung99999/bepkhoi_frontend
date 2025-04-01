import React, { useState, useEffect, useRef } from "react";
import { Input, List, Avatar } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

const mockProducts = [
  { id: "SP00002", name: "APEROL SPRITZ", price: 30000, stock: 1005, ordered: 0, image: "https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/485768717_982254907425894_6152429604559764929_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF_nxJgRGD0Dwuq1t4zPve7AR1g5wXhO1QBHWDnBeE7VMff46OhkljZ7sSdoSfKWHap4k1rDYBeNDCLy5mYjPF1&_nc_ohc=HrQvAymvBagQ7kNvgEc-d1B&_nc_oc=AdnldwMy2_t3Oss2bU8J0Kb5utXKN1chf-pqqJlDfKsEh3SvNkUhP-zAz_MjL_e6lg4&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=Du7FPZoXsL3gfiOkYrmwgA&oh=00_AYE5vi9spB_JclpuWo57tsI4LAIts_mHlsqxszJJ6OGoTg&oe=67E2F2D7" },
  { id: "SP00021", name: "Bia Heineken", price: 30000, stock: 1016, ordered: 0, image: "https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/485682012_982254984092553_467247732037709717_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGzP4YeTkw2iaXv68ya5HUnNIYPqXU6W080hg-pdTpbT_V_xWUhlbm_ynT_Sw54kkCNxKbxe9YnHW_l9O7C-hLd&_nc_ohc=NBp5lLqB4-YQ7kNvgFu-JQz&_nc_oc=Adn5rVUHbss_cdt8XMsGIiavXOE4AoDMAxWcSEzSOHzo437bdjRbCgVW3FhwzImh6OQ&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=MsOoQHWVypNO6F4JvTwpOQ&oh=00_AYGssJEugJXW3ErOW2zUibfhD-xtY7PUwpClaXK0Yr7cNw&oe=67E2DDBD" },
  { id: "SP00022", name: "Bia Hà Nội", price: 30000, stock: 1003, ordered: 0, image: "https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/481974821_1079876707505073_4993511851894755986_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFGbYfcDIvzeDa199q8qcpfq1W4V9-dMkerVbhX350yR3nPQ01Ak3Mvz3ZT0MAumAKdthePmb46DPZnqDcI7zgS&_nc_ohc=vXk2b5YPRmEQ7kNvgGl5K2v&_nc_oc=AdkV9QH4iWmHLJ-TcbDP9uYZf-gthdOlsaiaxpTkKk_u7G5Rh6CygF1o2byBsz8imAw&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=_Cbwy9iKiBuMTFE5giWR7Q&oh=00_AYG_bSC78MwwqZHimvb4LAg71OWZwFf7UjLtUUfHvQIyCA&oe=67E2F195" },
  { id: "SP00017", name: "Peach Tea", price: 15000, stock: 1005, ordered: 0, image: "https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/485620682_982252987426086_4375302066264144957_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHRsJYGgBBQCv-v4dPfG0SZTsLWj6V3SvNOwtaPpXdK8yaW45Ws2FHNIdVc6SgVuayznZG9MDW4YRRGFa8BMgqr&_nc_ohc=bYKqsb3BhzoQ7kNvgFCizUr&_nc_oc=AdkP9an3GglLb35UvQjdqWpumbZpNLtb4s1qikynKOAUSmVZMPSl5GcUxleFHsN8Vc0&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=GqzVGK-nldoCpVjfvwa-lQ&oh=00_AYFOMPntCkBUWwCquvxduMxytzC53vPhX0s7XqxQg5uZiw&oe=67E2DD34" },
];

const POSSearchBarLeftSide: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);
  
    // Xử lý khi nhấn phím F3
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "F3") {
          event.preventDefault();
          inputRef.current?.focus();
          setIsFocused(true);
        }
      };
  
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }, []);
  
    // Xử lý click ngoài vùng tìm kiếm
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsFocused(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const handleSearch = (value: string) => {
      setSearchTerm(value);
      if (value.trim() === "") {
        setFilteredProducts([]);
      } else {
        setFilteredProducts(
          mockProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(value.toLowerCase()) ||
              product.id.includes(value)
          )
        );
        setIsFocused(true);
      }
    };
  
    return (
      <div ref={searchRef} className="relative w-full">
        {/* Ô nhập tìm kiếm */}
        <Input
          ref={inputRef}
          placeholder="Tìm món(F3)"
          className="w-full rounded-full transition-all duration-200"
          style={{
            width: "350px",
            border: `2px solid ${isFocused ? "#FFE4B5" : "#d9d9d9"}`,
            boxShadow: isFocused ? "0px 0px 5px rgba(255, 228, 181, 0.7)" : "none",
          }}
          prefix={<SearchOutlined className="opacity-50" />}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
  
        {isFocused && searchTerm && filteredProducts.length > 0 && (
          <div style={{ width: "380px" }} className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
            <List
              itemLayout="horizontal"
              dataSource={filteredProducts}
              renderItem={(product) => (
                <List.Item className="hover:bg-[#faedd7] cursor-pointer transition-colors duration-200 px-4 py-2 flex items-center">
                  <Avatar style={{ marginLeft: "10px" }} src={product.image} size={50} className="mr-2" />
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-black">{product.name}</div>
                    <div className="text-gray-500 text-sm">{product.id}</div>
                  </div>
                  <div className="ml-auto text-right mr-3">
                    <div className="text-blue-500 font-medium">
                      <span style={{ color: "black", fontWeight: "lighter" }}>Giá:</span> {product.price.toLocaleString()} VND
                    </div>
                    <div className="text-gray-600 text-sm">
                      <span style={{ color: "black", fontWeight: "lighter" }}>Tồn:</span>
                      {product.stock > 0 ? <CheckOutlined /> : <CloseOutlined />}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    );
  };
  
  export default POSSearchBarLeftSide;