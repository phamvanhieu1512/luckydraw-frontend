import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, message, Typography } from "antd";
import { ethers } from "ethers";
import LuckyDrawABI from "../abis/LuckyDraw.json";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CONTRACT_ADDRESS = "0xaE869D99503Bc482C8aaE57956bE78bBa8B03Bb8";

const UnboxingHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  // Lấy địa chỉ ví người dùng
  const getUserAddress = async () => {
    if (!window.ethereum) {
      message.error("Vui lòng kết nối MetaMask");
      return null;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const addr = accounts[0];
    setUserAddress(addr);
    return addr;
  };

  // Lấy lịch sử spin của chính mình
  const fetchMySpins = async () => {
    const address = userAddress || (await getUserAddress());
    if (!address) return;

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LuckyDrawABI.abi, provider);

      const spins = await contract.getUserSpins(address);

      const data = spins.map((spin, idx) => ({
        _id: `${address}-${spin.timestamp.toString()}-${idx}`,
        createdAt: new Date(Number(spin.timestamp) * 1000),
        rewardType: spin.rewardType,
        prizeId: {
          name:
            spin.rewardType === "nft"
              ? `NFT #${spin.nftId}`
              : spin.rewardType === "token"
              ? address // hiển thị địa chỉ ví
              : "May mắn",
          imageUrl:
            spin.rewardType === "nft"
              ? `https://example.com/nft/${spin.nftId}.png`
              : null,
        },
      }));

      // Lọc theo khoảng thời gian nếu có
      let filtered = data;
      if (dateRange.length === 2) {
        const [start, end] = dateRange;
        filtered = data.filter(
          (log) => log.createdAt >= start.toDate() && log.createdAt <= end.toDate()
        );
      }

      setLogs(filtered);
    } catch (err) {
      console.error(err);
      message.error("Lấy lịch sử mở hộp thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySpins();
  }, [dateRange]);

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date.toLocaleString(),
    },
    {
      title: "Tên giải",
      dataIndex: ["prizeId", "name"],
      key: "prize",
    },
    {
      title: "Giá trị",
      dataIndex: "rewardType",
      key: "rewardType",
      render: (text) => (text === "none" ? "Vô giá" : text),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử mở hộp của tôi</h2>

      {/* Hiển thị địa chỉ ví */}
      {userAddress && (
        <Text strong style={{ display: "block", marginBottom: 16 }}>
          Đã kết nối: {userAddress}
        </Text>
      )}

      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <RangePicker onChange={(dates) => setDateRange(dates || [])} />
        <Button onClick={fetchMySpins}>Cập nhật</Button>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UnboxingHistory;
