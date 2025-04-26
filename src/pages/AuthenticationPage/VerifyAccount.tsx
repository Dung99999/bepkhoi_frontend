import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/VerifyAccount/VerifyAccount.module.css"; 
import wallImage from "../../styles/VerifyAccount/restaurant.jpg"; 
import { useAuth } from "../../context/AuthContext";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;


export default function VerifyPassword() {
  const navigate = useNavigate();
  const { authInfo, setAuthInfo } = useAuth()
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false); // Trạng thái giữa lần bấm đầu và thứ hai
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state để kiểm soát trạng thái submit

  // Chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (authInfo.token) {
      navigate(authInfo.roleName === "manager" ? "/manage/menu" : "/pos");
    }
  }, [authInfo.token, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!isOtpStage) {
      // request OTP
      try {
        const response = await fetch(
          `${API_BASE_URL}api/Passwords/send-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("OTP đã được gửi đến email của bạn!");
          setIsOtpStage(true); // Hiển thị input OTP
        } else {
          alert(data.message || "Lỗi khi gửi OTP");
        }
      } catch (error) {
        console.error("Lỗi gửi OTP:", error);
        alert("Lỗi kết nối đến server!");
      }
    } else {
      // authorize OTP
      try {
        const response = await fetch(`${API_BASE_URL}api/Passwords/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          alert("Xác thực thành công!");
          setAuthInfo({
            token: data.token,
            userId: data.userId,
            roleName: data.roleName || null, 
            userName: data.userName || null, 
          });
          navigate(data.roleName === "manager" ? "/manage/menu" : "/pos");
        } else {
          alert(data.message || "OTP không hợp lệ!");
        }
      } catch (error) {
        console.error("Lỗi xác thực OTP:", error);
        alert("Lỗi kết nối đến server!");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      <img
        src={wallImage}
        alt="Restaurant"
        className="background-1 object-cover w-full h-full z-[0]"
      />
      <div className="justify-between absolute bg-gray-200 px-10 py-16 rounded-2xl shadow-2xl shadow-black">
        <div className="flex flex-row pb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-9 h-9 pr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
          <h2 className="text-center font-semibold text-2xl">
            Verify Your Email
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-9 h-9 pl-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Input */}
          <div className="flex flex-col">
            <div className="flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 mt-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>

              <label className="ml-1 text-lg">
                Email<span className="text-red-600 font-bold">*</span>
              </label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập Email của bạn..."
              disabled={isOtpStage}
              className="p-2 rounded-md mt-2"
            />
          </div>

          {/* OTP Input */}
          {isOtpStage && (
            <div className={styles.formGroup}>
              <label>OTP Code:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 rounded-md text-gray-50 font-extrabold py-2 mt-1 hover:bg-blue-700 hover:text-gray-200"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..." // Hiển thị loading khi đang xử lý
              : isOtpStage
              ? "Xác thực OTP"
              : "Gửi OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
