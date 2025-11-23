import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Form, message } from "antd";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleRegister = async (values) => {
  //   const { fullName, email, password } = values;

  //   setLoading(true);
  //   try {
  //     // Gọi API register backend
  //     // Giả lập backend: /api/auth/register
  //     const res = await axios.post("/api/auth/register", {
  //       fullName,
  //       email,
  //       password,
  //     });

  //     message.success("Đăng ký thành công! Hãy đăng nhập.");
  //     navigate("/login"); // chuyển sang trang login
  //   } catch (err) {
  //     console.error(err);
  //     message.error(err.response?.data?.message || "Register failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <Form layout="vertical">
          {/* onFinish={handleRegister} */}
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
        </Form>
      </Card>
    </div>
  );
};

export default Register;
