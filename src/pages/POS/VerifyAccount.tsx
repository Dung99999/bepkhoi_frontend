import  React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/VerifyAccount/VerifyAccount.module.css"; // Import CSS module

export default function VerifyPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false); // Trạng thái giữa lần bấm đầu và thứ hai

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/manage/menu");
      }
    }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOtpStage) {
      // Gửi yêu cầu lấy OTP
      try {
        const response = await fetch("https://localhost:7257/api/User/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
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
      // Xác thực OTP
      try {
        const response = await fetch("https://localhost:7257/api/User/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
          credentials: "include", // Để gửi và nhận session từ server
        });
      
        const data = await response.json();
      
        if (response.ok) {
          alert("Xác thực thành công!");
          console.log(data);
          localStorage.setItem("token", data.token); // Lưu token vào localStorage
          localStorage.setItem("userId", data.UserId);
          // Chuyển hướng người dùng sau khi xác thực thành công
          navigate("/manage/menu");
        } else {
          alert(data.message || "OTP không hợp lệ!");
        }
      } catch (error) {
        console.error("Lỗi xác thực OTP:", error);
        alert("Lỗi kết nối đến server!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Input */}
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập Email của bạn..."
            className={styles.input}
          />
        </div>

        {/* OTP Input (Ẩn nếu chưa gửi yêu cầu OTP) */}
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
        <button type="submit" className={styles.button}>
          {isOtpStage ? "Xác thực OTP" : "Gửi OTP"}
        </button>
      </form>
    </div>
  );
}
