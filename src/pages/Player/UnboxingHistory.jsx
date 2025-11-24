import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, message, Typography, Card } from "antd";
import { ethers } from "ethers";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LuckyDrawABI from "../abis/LuckyDraw.json";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CONTRACT_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";

// Màu cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UnboxingHistory = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  // =============================
  // KẾT NỐI METAMASK
  // =============================
  const connectWallet = async () => {
    if (!window.ethereum) return message.error("Hãy cài MetaMask trước!");

    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts.length) return message.error("Không thấy ví nào!");
      const signer = await _provider.getSigner();

      setProvider(_provider);
      setAccount(accounts[0]);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, LuckyDrawABI.abi, signer));
      localStorage.setItem("walletConnected", "true");
      message.success("Kết nối ví thành công!");
    } catch (err) {
      console.error(err);
      message.error("Không thể kết nối ví!");
    }
  };

  // =============================
  // KHÔI PHỤC KẾT NỐI KHI REFRESH
  // =============================
  useEffect(() => {
    const connected = localStorage.getItem("walletConnected");
    if (!connected) return;

    const restoreConnection = async () => {
      if (!window.ethereum) return;
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (!accounts.length) return;
      const signer = await _provider.getSigner();
      setProvider(_provider);
      setAccount(accounts[0]);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, LuckyDrawABI.abi, signer));
    };

    restoreConnection();
  }, []);

  // =============================
  // LẤY LỊCH SỬ MỞ HỘP
  // =============================
  const fetchMySpins = async () => {
    if (!contract || !account) return;
    try {
      setLoading(true);
      const spins = await contract.getUserSpins(account);

      const parsed = spins.map((spin, idx) => ({
        _id: `${account}-${spin.timestamp.toString()}-${idx}`,
        createdAt: new Date(Number(spin.timestamp) * 1000),
        rewardType: spin.rewardType,
        nftId: spin.nftId?.toString(),
        tokenAmount: spin.amount ? parseFloat(ethers.formatEther(spin.amount)) : 0,
      }));

      let filtered = parsed;
      if (dateRange.length === 2) {
        const [start, end] = dateRange;
        filtered = parsed.filter(
          (log) => log.createdAt >= start.toDate() && log.createdAt <= end.toDate()
        );
      }

      setLogs(filtered);
    } catch (err) {
      console.error(err);
      message.error("Lấy lịch sử thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) fetchMySpins();
  }, [dateRange, account]);

  // =============================
  // TỔNG HỢP SỐ LIỆU
  // =============================
  const totalToken = logs
    .filter((r) => r.rewardType === "token")
    .reduce((sum, r) => sum + r.tokenAmount, 0);

  const totalNFT = logs.filter((r) => r.rewardType === "nft").length;
  const totalNone = logs.filter((r) => r.rewardType === "none").length;

  const pieData = [
    { name: "Token", value: logs.filter((r) => r.rewardType === "token").length },
    { name: "NFT", value: totalNFT },
    { name: "Không trúng", value: totalNone },
  ];

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (d) => d.toLocaleString(),
    },
    {
      title: "Phần thưởng",
      key: "reward",
      render: (_, record) => {
        if (record.rewardType === "none") return "Không trúng";
        if (record.rewardType === "token") return `Token: ${record.tokenAmount}`;
        if (record.rewardType === "nft") return `NFT #${record.nftId}`;
        return "-";
      },
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử mở hộp của tôi</h2>

      {!account ? (
        <Card style={{ width: 400 }}>
          <Button
            type="primary"
            block
            onClick={connectWallet}
            style={{ height: 45, fontSize: 16 }}
          >
            Kết nối ví MetaMask
          </Button>
        </Card>
      ) : (
        <>
          <Text strong style={{ display: "block", marginBottom: 16 }}>
            Đã kết nối: {account}
          </Text>

          {/* =============================
              THỐNG KÊ VÀ BIỂU ĐỒ
          ============================= */}
          <div
  style={{
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 50,
  }}
>
  {/* Thống kê */}
  <div
    style={{
      minWidth: 220,
      textAlign: "center",
      padding: 20,
      borderRadius: 12,
      background: "#fafafa",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    <Text strong style={{ fontSize: 16 }}>Tổng Token</Text>
    <div style={{ fontSize: 28, color: "#1890ff", margin: "8px 0" }}>{totalToken}</div>

    <Text strong style={{ fontSize: 16 }}>Tổng NFT</Text>
    <div style={{ fontSize: 28, color: "#52c41a", margin: "8px 0" }}>{totalNFT}</div>

    <Text strong style={{ fontSize: 16 }}>Tổng Không trúng</Text>
    <div style={{ fontSize: 28, color: "#f5222d", marginTop: 8 }}>{totalNone}</div>
  </div>

  {/* Biểu đồ */}
  <div
    style={{
      width: 320,
      height: 320,
      padding: 10,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


          
          <Table
            style={{ marginTop: "30px"}}
            columns={columns}
            dataSource={logs}
            loading={loading}
            rowKey={(r) => r._id}
            pagination={{ pageSize: 10 }}
          />

          
        </>
      )}
    </div>
  );
};

export default UnboxingHistory;
