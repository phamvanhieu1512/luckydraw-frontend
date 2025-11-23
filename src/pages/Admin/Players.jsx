import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Avatar, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Lấy danh sách người chơi
  // const fetchPlayers = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/admin/players", {
  //       params: { search: searchText },
  //     });
  //     setPlayers(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy danh sách người chơi thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchPlayers();
  // }, [searchText]);

  // Reset lượt quay
  // const handleResetSpins = async (playerId) => {
  //   try {
  //     await axios.post(`/api/admin/players/${playerId}/reset`);
  //     message.success("Reset lượt quay thành công");
  //     fetchPlayers();
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Reset thất bại");
  //   }
  // };

  // Block / unblock
  // const handleBlock = async (player) => {
  //   const action = player.blocked ? "unblock" : "block";
  //   Modal.confirm({
  //     title: `Xác nhận ${action} người chơi?`,
  //     onOk: async () => {
  //       try {
  //         await axios.post(`/api/admin/players/${player._id}/${action}`);
  //         message.success(`Người chơi đã được ${action} thành công`);
  //         fetchPlayers();
  //       } catch (err) {
  //         console.error(err);
  //         message.error(`${action} thất bại`);
  //       }
  //     },
  //   });
  // };

  // Xem lịch sử trúng thưởng
  // const handleViewHistory = (player) => {
  //   // Có thể mở modal hoặc chuyển page chi tiết
  //   window.open(`/admin/players/${player._id}/history`, "_blank");
  // };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatar",
      render: (url) => <Avatar src={url} />,
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
    },
    {
      title: "Lượt quay còn lại",
      dataIndex: "spinsLeft",
      key: "spinsLeft",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            // onClick={() => handleResetSpins(record._id)}
            icon={<ReloadOutlined />}
          >
            Reset Spins
          </Button>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            // onClick={() => handleViewHistory(record)}
          >
            Lịch sử
          </Button>
          <Button
            size="small"
            danger={!record.blocked ? true : false}
            // onClick={() => handleBlock(record)}
            icon={<StopOutlined />}
          >
            {record.blocked ? "Unblock" : "Block"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Người chơi</h1>

      <Input
        placeholder="Tìm kiếm email / ID"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={players}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Players;
