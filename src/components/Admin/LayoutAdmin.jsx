import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GiftOutlined,
  UserOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { StyledMenu } from "../styleDefaultComponent"; // bạn vẫn dùng chung được
import logo from "../../assets/images/logo/lucky_logo.png.png";

const { Header, Sider, Content } = Layout;

const LayoutAdmin = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/admin", icon: <GiftOutlined />, label: "Dashboard" },
    { key: "/admin/players", icon: <UserOutlined />, label: "Players" },
    { key: "/admin/prizes", icon: <DatabaseOutlined />, label: "Prizes" },
    { key: "/admin/history", icon: <HistoryOutlined />, label: "History" },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const handleClick = (e) => {
    if (e.key === "logout") return navigate("/");
    navigate(e.key);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#0A0F1F",
      }}
    >
      {/* HEADER */}
      <Header
        style={{
          height: 70,
          background: "linear-gradient(90deg, #7A00F5, #D400FF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          color: "#fff",
          boxShadow: "0 0 12px #6100c2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "20px",
              color: "#fff",
            }}
          />

          <img
            src={logo}
            alt="logo"
            style={{ width: 120, height: 50, objectFit: "contain" }}
          />

          <h2 style={{ color: "#fff", margin: 0, fontWeight: 600 }}>
            Lucky Draw Admin
          </h2>
        </div>
      </Header>

      {/* SIDEBAR + CONTENT */}
      <Layout style={{ marginTop: 70 }}>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: "#150B29",
            borderRight: "2px solid #7A00F5",
            height: "calc(100vh - 70px)",
            position: "fixed",
            top: 70,
            left: 0,
            overflow: "auto",
          }}
        >
          <StyledMenu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleClick}
            style={{
              background: "transparent",
              color: "#fff",
            }}
          />
        </Sider>

        {/* CONTENT */}
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: "0.3s",
            background: "#0A0F1F",
          }}
        >
          <Content
            style={{
              padding: 24,
              minHeight: "calc(100vh - 70px)",
              color: "#fff",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
