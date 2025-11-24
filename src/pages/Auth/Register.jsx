// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Input, Button, Form, message, Typography } from "antd";
import { register } from "../../service/register.js";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const { fullName, email, password } = values;
    setLoading(true);
    try {
      const res = await register(fullName, email, password);
      message.success(res.message);
      navigate("/player");
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng ký thất bại!");
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
          width: 400,
          borderRadius: 16,
          boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          backgroundColor: "rgba(255,255,255,0.95)",
          padding: "40px 30px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: 10 }}>
          Đăng ký
        </Title>
        <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>

        <Form layout="vertical" onFinish={handleRegister} style={{ marginTop: 30 }}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Họ và tên" style={{ borderRadius: 8, height: 42 }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email" style={{ borderRadius: 8, height: 42 }} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" style={{ borderRadius: 8, height: 42 }} />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" style={{ borderRadius: 8, height: 42 }} />
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
              Đăng ký
            </Button>
          </Form.Item>

          <Text type="secondary">
            Đã có tài khoản? <Link to="/" style={{ fontWeight: 500 }}>Đăng nhập</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
