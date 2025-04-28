import React, { useState, useEffect } from "react";
import { motion, MotionStyle } from "framer-motion";
import { useNavigate } from "react-router-dom";
import loginImage from "../../styles/LoginPage/images/login_image.png";
const token = localStorage.getItem("Token"); 

interface CustomerInfo {
    customerId: string;
    phone: string;
    name: string;
}

async function notifyCustomerJoin(roomId: number, customerId: number, customerName: string, phone: string) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/orders/notify-customer-join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomId, customerId: customerId, customerName: customerName, phone: phone }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Sự kiện CustomerJoin đã được gửi:", result.message);
      } else {
        console.error("Lỗi gửi sự kiện:", result.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối tới server:", error);
    }
}

const GuessPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const [phoneError, setPhoneError] = useState("");
    const navigate = useNavigate();

    const validatePhoneNumber = (phone: string): boolean => {
        const regex = /^0\d{9}$/;
        return regex.test(phone);
    };

    useEffect(() => {
        const searchUser = async () => {
            if (!validatePhoneNumber(phoneNumber)) {
                setPhoneError("Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số");
                setIsNameDisabled(true);
                setName("");
                return;
            }

            setPhoneError("");
            setIsSearching(true);

            try {
                const searchResponse = await fetch(
                    `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${phoneNumber}`,
                    {
                      method: "GET",
                      headers: {
                        "Authorization": `Bearer ${token}`,
                      },
                    }
                  );

                if (!searchResponse.ok) throw new Error("Không thể lấy thông tin người dùng");

                const customers = await searchResponse.json();
                const matchedCustomer = Array.isArray(customers) 
                    ? customers.find(c => c.phone === phoneNumber || 
                                       c.phone === `+84${phoneNumber.substring(1)}` || 
                                       c.phone === `84${phoneNumber.substring(1)}`)
                    : null;

                if (matchedCustomer) {
                    setName(matchedCustomer.name || matchedCustomer.customerName || "");
                    setIsNameDisabled(true);
                } else {
                    setName("");
                    setIsNameDisabled(false);
                }
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
                setName("");
                setIsNameDisabled(false);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(() => {
            if (phoneNumber.length === 10) searchUser();
        }, 500);

        return () => clearTimeout(timer);
    }, [phoneNumber]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setPhoneNumber(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError("Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số");
            return;
        }

        if (!isNameDisabled && !name) {
            setError("Vui lòng nhập tên");
            return;
        }

        setIsLoading(true);

        try {
            const searchResponse = await fetch(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${phoneNumber}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

            let customerData = await searchResponse.json();
            let customerInfo: CustomerInfo | null = null;

            if ((Array.isArray(customerData) && customerData.length === 0) || 
                (!Array.isArray(customerData) && !customerData?.phone)) {
                
                const createResponse = await fetch(
                    `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/create-new-customer`,
                    {
                        method: 'POST',
                        headers: {
                             'Content-Type': 'application/json',
                            },
                        body: JSON.stringify({ phone: phoneNumber, customerName: name })
                    }
                );

                if (!createResponse.ok && createResponse.status !== 409) {
                    throw new Error("Không thể tạo người dùng mới");
                }

                const newSearchResponse = await fetch(
                    `${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${phoneNumber}`,
                    {
                      method: "GET"
                    }
                  );
                customerData = await newSearchResponse.json();
            }

            const customer = Array.isArray(customerData) ? customerData[0] : customerData;
            customerInfo = {
                customerId: customer.id || customer.customerId,
                phone: customer.phone || phoneNumber,
                name: customer.name || customer.customerName || name
            };

            if (!customerInfo.customerId) throw new Error("Không có thông tin khách hàng");

            sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            const roomId = parseInt(sessionStorage.getItem('roomId') || '0', 10);
            notifyCustomerJoin(roomId, Number(customerInfo.customerId), customerInfo.name, customerInfo.phone);
            navigate('/shop/menu');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                textAlign: "center",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${loginImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.7) blur(2px)",
                    zIndex: -1,
                }}
            />

            <div style={{
                backgroundColor: "rgba(255, 234, 199, 0.92)",
                borderRadius: "16px",
                padding: "30px 20px",
                width: "100%",
                maxWidth: "450px",
                boxShadow: "0 4px 15px rgba(203, 153, 84, 0.15)",
                border: "1px solid #f0d9b0",
                backdropFilter: "blur(4px)",
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '30px' } as MotionStyle}
                >
                    <h1
                        style={{
                            color: "#333",
                            fontSize: "28px",
                            fontWeight: "600",
                            marginBottom: "10px",
                        }}
                    >
                        Thông tin cá nhân
                    </h1>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Vui lòng nhập thông tin đặt bàn
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            color: '#d32f2f',
                            backgroundColor: '#fde8e8',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                        } as MotionStyle}
                    >
                        {error}
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ width: '100%', margin: '0 auto' } as MotionStyle}
                >
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{ position: 'relative', marginBottom: '25px' } as MotionStyle}
                    >
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            onFocus={() => setIsPhoneFocused(true)}
                            onBlur={() => setIsPhoneFocused(false)}
                            placeholder=" "
                            maxLength={10}
                            style={{
                                width: "100%",
                                padding: "16px 20px",
                                fontSize: "16px",
                                borderRadius: "12px",
                                border: `2px solid ${phoneError ? "#d32f2f" : isPhoneFocused ? "#007bff" : "#ddd"}`,
                                outline: "none",
                                transition: "all 0.3s ease",
                                boxShadow: isPhoneFocused
                                    ? "0 0 0 3px rgba(0, 123, 255, 0.25)"
                                    : "none",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                            }}
                        />
                        <motion.label
                            initial={{ y: "50%", x: 20, opacity: 0.7 }}
                            animate={{
                                y: phoneNumber || isPhoneFocused ? "-10px" : "50%",
                                x: phoneNumber || isPhoneFocused ? 15 : 20,
                                opacity: phoneNumber || isPhoneFocused ? 1 : 0.7,
                                fontSize: phoneNumber || isPhoneFocused ? "12px" : "16px",
                                color: phoneError ? "#d32f2f" : isPhoneFocused ? "#007bff" : "#666",
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                padding: "0 5px",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                pointerEvents: "none",
                                transformOrigin: 'left center',
                            } as MotionStyle}
                        >
                            Số điện thoại
                            {isSearching && (
                                <span style={{ marginLeft: "5px" }}>
                                    <div style={{
                                        display: "inline-block",
                                        width: "12px",
                                        height: "12px",
                                        border: "2px solid rgba(0,0,0,0.3)",
                                        borderTopColor: "#007bff",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                    }} />
                                </span>
                            )}
                        </motion.label>
                        {phoneError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: '#d32f2f',
                                    fontSize: "12px",
                                    textAlign: "left",
                                    marginTop: "4px",
                                    marginLeft: "10px",
                                } as MotionStyle}
                            >
                                {phoneError}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{ position: 'relative', marginBottom: '25px' } as MotionStyle}
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setIsNameFocused(true)}
                            onBlur={() => setIsNameFocused(false)}
                            placeholder=" "
                            disabled={isNameDisabled}
                            style={{
                                width: "100%",
                                padding: "16px 20px",
                                fontSize: "16px",
                                borderRadius: "12px",
                                border: "2px solid #ddd",
                                outline: "none",
                                transition: "all 0.3s ease",
                                boxShadow: isNameFocused
                                    ? "0 0 0 3px rgba(0, 123, 255, 0.25)"
                                    : "none",
                                borderColor: isNameFocused ? "#007bff" : "#ddd",
                                backgroundColor: isNameDisabled
                                    ? "rgba(245, 245, 245, 0.8)"
                                    : "rgba(255, 255, 255, 0.8)",
                                cursor: isNameDisabled ? "not-allowed" : "text",
                            }}
                        />
                        <motion.label
                            initial={{ y: "50%", x: 20, opacity: 0.7 }}
                            animate={{
                                y: name || isNameFocused ? "-10px" : "50%",
                                x: name || isNameFocused ? 15 : 20,
                                opacity: name || isNameFocused ? 1 : 0.7,
                                fontSize: name || isNameFocused ? "12px" : "16px",
                                color: isNameFocused ? "#007bff" : "#666",
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                padding: "0 5px",
                                backgroundColor: isNameDisabled
                                    ? "rgba(245, 245, 245, 0.8)"
                                    : "rgba(255, 255, 255, 0.8)",
                                pointerEvents: "none",
                                transformOrigin: 'left center',
                            } as MotionStyle}
                        >
                            Họ và tên
                        </motion.label>
                    </motion.div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!phoneNumber || (isNameDisabled ? false : !name) || isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: phoneNumber && (isNameDisabled || name)
                                ? (isLoading ? '#6c757d' : '#007bff')
                                : '#aaa',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: phoneNumber && (isNameDisabled || name) && !isLoading
                                ? 'pointer'
                                : 'not-allowed',
                            transition: 'all 0.3s ease',
                            marginBottom: '20px',
                            position: 'relative',
                        } as MotionStyle}
                    >
                        {isLoading ? (
                            <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <span style={{ marginRight: "8px" }}>Đang xử lý...</span>
                                <div style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                }} />
                            </span>
                        ) : (
                            "Tiếp tục"
                        )}
                    </motion.button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{ color: '#888', fontSize: '14px' } as MotionStyle}
                >
                    Click tiếp tục để đặt chỗ
                </motion.div>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GuessPage;