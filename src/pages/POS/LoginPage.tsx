// import React, { useState } from "react";
// import config from "../config/config";
// import styles from "../styles/LoginPage/css/main.module.css";
// import loginImage from "../styles/LoginPage/images/login_image.png";

// interface LoginForm {
//   username: string;
//   password: string;
//   rememberMe: boolean;
// }

// export default function LoginPage() {
//   const [formData, setFormData] = useState<LoginForm>({
//     username: "",
//     password: "",
//     rememberMe: false,
//   });

//   // Xử lý khi người dùng nhập dữ liệu vào form
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Xử lý khi submit form
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Login Data:", formData);
//   };

//   return (
//     <div className={styles.loginContainer}>
//       {/* Cột bên trái chứa hình ảnh */}
//       <div className={styles.loginImageContainer}>
//         <img src={loginImage} alt="Login Background" />
//       </div>

//       {/* Cột bên phải chứa form đăng nhập */}
//       <div className={styles.loginFormContainer}>
//         <div className={styles.loginForm}>
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Username */}
//           <div className={styles.formGroup}>
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className={styles.formGroup}>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className={styles.formOptions}>
//             <label>
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//               />
//               Remember me
//             </label>
//           </div>
//           <div className="forgot-">
//               <a href="#">Forgot Password?</a>
//           </div>

//           {/* Login Button */}
//           <div className="submit-login" style={{ marginTop: "20px" }}>
//             <button type="submit" className={styles.btnLogin}>Login</button>
//           </div>
//         </form>
//         </div>
//       </div>
//     </div>
//   );
// }
