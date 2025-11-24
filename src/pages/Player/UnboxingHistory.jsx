import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, message, Typography, Card } from "antd";
import { ethers } from "ethers";
import LuckyDrawABI from "../abis/LuckyDraw.json";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CONTRACT_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";

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
        tokenAmount: spin.amount ? ethers.formatEther(spin.amount) : "0",
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
      if (record.rewardType === "none") {
        return "Không trúng";
      }
      if (record.rewardType === "token") {
        return `Token: ${record.tokenAmount}`;
      }
      if (record.rewardType === "nft") {
        return `NFT #${record.nftId}`;
      }
      return "-";
    },
  },
];


  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử mở hộp của tôi</h2>

      {/* ======================================
          NẾU CHƯA KẾT NỐI VÍ → CHỈ HIỆN NÚT
      ====================================== */}
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

          <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
            <RangePicker onChange={(d) => setDateRange(d || [])} />
            <Button onClick={fetchMySpins}>Cập nhật</Button>
          </div>

          <Table
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
