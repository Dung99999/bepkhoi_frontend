import React from "react";

const ServerErrorPage: React.FC = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>500 - Server Error</h1>
      <p>Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.</p>
    </div>
  );
};

export default ServerErrorPage;
