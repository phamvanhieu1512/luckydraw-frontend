// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Input, Button, Form, message, Typography } from "antd";
import { login } from "../../service/login.js";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
  setLoading(true);
  try {
    const { user, access_Token } = await login(values.email, values.password);

    // Lưu vào localStorage
    localStorage.setItem("token", access_Token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("user", JSON.stringify(user));

    message.success(`Đăng nhập thành công! Chào ${user.fullName}`);

    // Điều hướng theo role
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/player");
    }
  } catch (err) {
    message.error(err.message || "Đăng nhập thất bại!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "40px 30px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: 10 }}>
          Đăng nhập
        </Title>
        <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>

        <Form layout="vertical" onFinish={handleLogin} style={{ marginTop: 30 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Email"
              style={{ borderRadius: 8, height: 42 }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              style={{ borderRadius: 8, height: 42 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                borderRadius: 8,
                height: 42,
                fontSize: 16,
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                border: "none",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Text type="secondary">
            Chưa có tài khoản?{" "}
            <Link to="/register" style={{ fontWeight: "500" }}>
              Đăng ký ngay
            </Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

