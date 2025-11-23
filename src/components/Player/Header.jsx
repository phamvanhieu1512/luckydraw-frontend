import React from "react";
import { Link } from "react-router-dom";
import {
  GiftOutlined,
  HistoryOutlined,
  UserOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const menuItems = [
  { key: "/player", icon: <GiftOutlined />, label: "Mystery Box" },
  {
    key: "/player/spinHistory",
    icon: <HistoryOutlined />,
    label: "Spin History",
  },
  {
    key: "/player/unboxing-history",
    icon: <HistoryOutlined />,
    label: "Unboxing History",
  },
  { key: "/player/wallet", icon: <WalletOutlined />, label: "Wallet" },
  { key: "/player/profile", icon: <UserOutlined />, label: "Profile" },
  { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
];

const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        gap: 25,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 20 }}>🎁 Lucky Draw</div>

      {/* Menu */}
      <div style={{ display: "flex", gap: 20 }}>
        {menuItems.map((item) =>
          item.key === "logout" ? (
            <button
              key={item.key}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => console.log("Logout clicked")}
            >
              {item.icon} {item.label}
            </button>
          ) : (
            <Link
              key={item.key}
              to={item.key}
              style={{ textDecoration: "none", color: "#333" }}
            >
              {item.icon} {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Header;
