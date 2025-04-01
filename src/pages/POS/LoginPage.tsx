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
      const response = await fetch("https://localhost:7257/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
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

      if (data.message === "succesfull") {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        alert("Đăng nhập thành công!");
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
      <div className={styles.loginImageContainer}>
        <img src={loginImage} alt="Login Background" />
      </div>
      <div className={styles.loginFormContainer}>
        <div className="w-full bg-white rounded-lg shadow-md sm:max-w-md py-6 px-8">
          <div className="pb-9 flex items-center gap-4">
            {/* Logo */}
            <div>
              <img
                src={logoBepKhoi}
                alt="Logo Bếp Khói"
                className="w-20 h-20"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#d69629] md:text-4xl">
                Đăng nhập
              </h1>
              <p className="mt-2 font-light">Nhà hàng Bếp Khói xin chào!</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-500"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#fcc25d] text-blue font-semibold rounded-lg px-5 py-2.5 hover:bg-[#dba342]"
            >
              Sign in
            </button>
            <p className="text-sm text-gray-500">
              contact for admin to get account
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
