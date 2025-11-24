import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Input, Button, Form, message } from "antd";
import { register } from "../../service/register.js";

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
        background: "#f0f2f5",
      }}
    >
      <Card title="Register" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

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
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
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
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link to="/">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
