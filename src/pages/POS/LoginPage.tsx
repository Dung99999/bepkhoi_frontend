import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/LoginPage/css/main.module.css";
import loginImage from "../../styles/LoginPage/images/login_image.png";

interface LoginForm {
  username: string;
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: ""
  });

  // Xử lý khi người dùng nhập dữ liệu vào form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = formData.username
    const password = formData.password;
  
    try {
      const response = await fetch("https://localhost:7257/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Nếu response trả về mã lỗi (400, 401)
        console.error("Error:", data.message);
        alert("Đăng nhập thất bại!");
        return;
      }
  
      if (data.message === "not_verify") {
        alert("Tài khoản chưa xác minh!");
        navigate("/verify");
        return;
      }
  
      if (data.message === "succesfull") {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        alert("Đăng nhập thành công!");
        // Chuyển hướng tới site chức năng
        navigate("/manage/menu");
      }
    } catch (error) {
      console.error("Error in login process:", error);
      alert("Lỗi kết nối đến server!");
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/manage/menu");
    }
  }, [navigate]);

  return (
    <div className={styles.loginContainer}>
      {/* Cột bên trái chứa hình ảnh */}
      <div className={styles.loginImageContainer}>
        <img src={loginImage} alt="Login Background" />
      </div>

      {/* Cột bên phải chứa form đăng nhập */}
      <div className={styles.loginFormContainer}>
        <div className={styles.loginForm}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Nhập email của bạn..."
            />
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className={styles.formOptions}>
            <label>
              <input
                type="checkbox"
                name="rememberMe"
              />
              Remember me
            </label>
          </div>
          <div className="forgot">
              <a href="#">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <div className="submit-login" style={{ marginTop: "20px" }}>
            <button type="submit" className={styles.btnLogin}>Login</button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
