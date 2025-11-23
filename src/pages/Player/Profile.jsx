import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Button, message } from "antd";
import axios from 'axios';


const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/player/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lấy thông tin profile thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      {user && (
        <Card style={{ width: 400, textAlign: "center" }}>
          <Avatar
            src={user.avatarUrl || "/assets/default-avatar.png"}
            size={120}
            style={{ marginBottom: 20 }}
          />
          <Title level={3}>{user.fullName}</Title>
          <Text strong>Email:</Text> <Text>{user.email}</Text>
          <br />
          <Text strong>Địa chỉ ví:</Text>{" "}
          <Text copyable>{user.walletAddress || "Chưa có"}</Text>
          <br />
          <Text strong>Lượt quay còn lại:</Text> <Text>{user.spinsLeft}</Text>
          <br />
          {/* Optional: nút chỉnh sửa profile */}
          <Button style={{ marginTop: 20 }}>Chỉnh sửa profile</Button>
        </Card>
      )}
    </div>
  );
};

export default Profile;
