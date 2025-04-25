import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/LoginPage/css/main.module.css";
import loginImage from "../../styles/LoginPage/images/login_image.png";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });

  // Xử lý khi người dùng nhập dữ liệu vào form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const response = await fetch("https://localhost:7257/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data.message);
        alert("Đăng nhập thất bại!");
        return;
      }

      if (data.message === "not_verify") {
        alert("Tài khoản chưa xác minh!");
        navigate("/verify");
        return;
      }

      if (data.message === "successful") {
        localStorage.setItem("Token", data.token);
        localStorage.setItem("UserId", data.userId);
        localStorage.setItem("RoleName", data.roleName);
        localStorage.setItem("UserName", data.userName);
        alert("Đăng nhập thành công!");
        navigate("/manage/dashboard");
      }
    } catch (error) {
      console.error("Error in login process:", error);
      alert("Lỗi kết nối đến server!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/manage/dashboard");
    }
  }, [navigate]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginImageContainer}>
        <img src={loginImage} alt="Login Background" />
      </div>
      <div className={styles.loginFormContainer}>
        <div className="w-[30vw] bg-white rounded-lg shadow-md py-[1vw] px-[2vw]">
          <div className="pb-[2vw] flex items-center gap-[1vw]">
            {/* Logo */}
            <div>
              <img
                src={logoBepKhoi}
                alt="Logo Bếp Khói"
                className="w-[5vw] h-[5vw]"
              />
            </div>

            <div>
              <h1 className="text-[2vw] font-bold text-[#d69629] md:text-[2vw]">
                Đăng nhập
              </h1>
              <p className="mt-[0.5vw] text-[0.9vw] font-light">
                Nhà hàng Bếp Khói xin chào!
              </p>
            </div>
          </div>
          <form className="space-y-[1vw]" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-[0.5vw] text-[0.9vw] font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-[0.9vw] text-gray-900 rounded-lg w-full p-[0.6vw]"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-[0.5vw] text-[0.9vw] font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="text"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-[0.9vw] text-gray-900 rounded-lg w-full p-[0.6vw]"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-[1vw] h-[1vw] border border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-[0.5vw] text-[0.9vw] text-gray-500"
                >
                  Remember me
                </label>
              </div>
              <a
                href="http://localhost:3000/verify"
                className="text-[0.9vw] font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#fcc25d] text-[0.9vw] text-blue font-semibold rounded-lg px-[1.2vw] py-[0.6vw] hover:bg-[#dba342]"
            >
              Sign in
            </button>
            <p className="text-[0.9vw] text-gray-500">
              contact for admin to get account
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
