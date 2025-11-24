import React, { useEffect, useState } from "react";
import { Table, Button, Input, Avatar, message } from "antd";
import { SearchOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";
import axios from "axios";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Lấy danh sách người chơi từ API
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/user/view-all");
      setPlayers(res.data.users || []);
    } catch (err) {
      console.error(err);
      message.error("Lấy danh sách người chơi thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Lọc dữ liệu theo search
// Lọc dữ liệu theo search và loại bỏ admin
const filteredPlayers = players
  .filter((player) => player.role !== "admin") // bỏ admin
  .filter(
    (player) =>
      player.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      player.email.toLowerCase().includes(searchText.toLowerCase()) ||
      player._id.toLowerCase().includes(searchText.toLowerCase())
  );


  const columns = [
    {
  title: "Avatar",
  dataIndex: "avatarUrl",
  key: "avatar",
  render: (url, record) =>
    url ? (
      <Avatar src={`http://localhost:5000${url}`} />
    ) : (
      <Avatar>{record.fullName ? record.fullName.charAt(0).toUpperCase() : "U"}</Avatar>
    ),
},

    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    }
  ];

  return (
    <div>
      <h1>Quản lý Người chơi</h1>

      <Input
        placeholder="Tìm kiếm tên / email / ID"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
        allowClear
      />

      <Table
        columns={columns}
        dataSource={filteredPlayers}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Players;
