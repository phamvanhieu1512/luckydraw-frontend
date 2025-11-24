// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Input, Button, Form, message } from "antd";
import { login } from "../../service/login.js";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { user } = await login(values.email, values.password);
      message.success(`Đăng nhập thành công! Chào ${user.name}`);
      navigate("/player");
    } catch (err) {
      message.error(err.message);
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
        background: "#f0f2f5",
      }}
    >
      <Card title="Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>

          <div style={{ marginTop: 10, textAlign: "center" }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
