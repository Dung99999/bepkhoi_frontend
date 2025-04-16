import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import loginImage from "../../styles/LoginPage/images/login_image.png";

const GuessPage: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const createResponse = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/create-new-customer`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    customerName: name
                })
            });

            if (!createResponse.ok && createResponse.status !== 409) {
                const errorData = await createResponse.json();
                throw new Error(errorData.message || "Có lỗi khi tạo người dùng");
            }
            const searchResponse = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/Customer/search?searchTerm=${phoneNumber}`, {
                method: 'GET',
                headers: {
                    'accept': 'text/plain',
                },
            });

            if (!searchResponse.ok) {
                throw new Error("Không thể lấy thông tin người dùng");
            }

            const customerData = await searchResponse.json();

            let customerId, customerPhone, customerName;

            if (Array.isArray(customerData) && customerData.length > 0) {
                const firstCustomer = customerData[0];
                customerId = firstCustomer.id || firstCustomer.customerId;
                customerPhone = firstCustomer.phone || phoneNumber;
                customerName = firstCustomer.name || firstCustomer.customerName || name;
            } else if (typeof customerData === 'object' && customerData !== null) {
                customerId = customerData.id || customerData.customerId;
                customerPhone = customerData.phone || phoneNumber;
                customerName = customerData.name || customerData.customerName || name;
            } else {
                throw new Error("Định dạng dữ liệu không hợp lệ");
            }

            if (!customerId) {
                throw new Error("Không tìm thấy ID người dùng");
            }
            const customerInfo = {
                customerId,
                phone: customerPhone,
                name: customerName
            };

            sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
            navigate('/shop/menu');

        } catch (err) {
            console.error("Chi tiết lỗi:", err);
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
                    style={{ marginBottom: "30px" }}
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
                            color: "#d32f2f",
                            backgroundColor: "#fde8e8",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                        width: "100%",
                        margin: "0 auto",
                    }}
                >
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            position: "relative",
                            marginBottom: "25px",
                        }}
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setIsNameFocused(true)}
                            onBlur={() => setIsNameFocused(false)}
                            placeholder=" "
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
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                                position: "absolute",
                                left: 0,
                                top: 0,
                                padding: "0 5px",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                pointerEvents: "none",
                                transformOrigin: "left center",
                            }}
                        >
                            Họ và tên
                        </motion.label>
                    </motion.div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        style={{
                            position: "relative",
                            marginBottom: "30px",
                        }}
                    >
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onFocus={() => setIsPhoneFocused(true)}
                            onBlur={() => setIsPhoneFocused(false)}
                            placeholder=" "
                            style={{
                                width: "100%",
                                padding: "16px 20px",
                                fontSize: "16px",
                                borderRadius: "12px",
                                border: "2px solid #ddd",
                                outline: "none",
                                transition: "all 0.3s ease",
                                boxShadow: isPhoneFocused
                                    ? "0 0 0 3px rgba(0, 123, 255, 0.25)"
                                    : "none",
                                borderColor: isPhoneFocused ? "#007bff" : "#ddd",
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
                                color: isPhoneFocused ? "#007bff" : "#666",
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                padding: "0 5px",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                pointerEvents: "none",
                                transformOrigin: "left center",
                            }}
                        >
                            Số điện thoại
                        </motion.label>
                    </motion.div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!phoneNumber || !name || isLoading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#fff",
                            backgroundColor: phoneNumber && name ? (isLoading ? "#6c757d" : "#007bff") : "#aaa",
                            border: "none",
                            borderRadius: "12px",
                            cursor: phoneNumber && name ? "pointer" : "not-allowed",
                            transition: "all 0.3s ease",
                            marginBottom: "20px",
                            position: "relative",
                        }}
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
                    style={{ color: "#888", fontSize: "14px" }}
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