import React from "react";

const ForbiddenPage: React.FC = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>403 - Forbidden</h1>
      <p>Bạn không có quyền truy cập trang này.</p>
    </div>
  );
};

export default ForbiddenPage;