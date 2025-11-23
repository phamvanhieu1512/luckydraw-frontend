import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        background: "#1F1F1F",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 80, marginBottom: 0, color: "#ff4d4f" }}>404</h1>
      <h2 style={{ marginBottom: 20 }}>Oops! Page Not Found</h2>

      <p style={{ maxWidth: 400, opacity: 0.8, marginBottom: 30 }}>
        Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
      </p>

      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/")}
        style={{
          background: "#ff4d4f",
          border: "none",
          padding: "0 32px",
          height: 45,
          borderRadius: 8,
        }}
      >
        Quay về trang chủ
      </Button>
    </div>
  );
};

export default NotFoundPage;
