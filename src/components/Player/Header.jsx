// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Modal, message } from "antd";
import {
  GiftOutlined,
  HistoryOutlined,
  UserOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk() {
        // Xóa token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");

        // Xóa trạng thái ví nếu có
        localStorage.removeItem("walletConnected");

        message.success("Đăng xuất thành công!");
        navigate("/");
      },
      onCancel() {
        message.info("Hủy đăng xuất");
      },
    });
  };

  const menuItems = [
    { key: "/player", icon: <GiftOutlined />, label: "Mystery Box" },
    { key: "/player/spinHistory", icon: <HistoryOutlined />, label: "Spin History" },
    { key: "/player/unboxing-history", icon: <HistoryOutlined />, label: "Unboxing History" },
    // { key: "/player/wallet", icon: <WalletOutlined />, label: "Wallet" },
    // { key: "/player/profile", icon: <UserOutlined />, label: "Profile" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "logout") {
      handleLogout();
    } else {
      navigate(e.key);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 20px", background: "#fff", borderBottom: "1px solid #eee", height: 60 }}>
      <div style={{ fontWeight: "bold", fontSize: 20, marginRight: 40 }}>🎁 Lucky Draw</div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={menuItems}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default Header;
