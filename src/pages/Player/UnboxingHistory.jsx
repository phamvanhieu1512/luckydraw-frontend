import React, { useEffect, useState } from "react";
import { 
  Table, 
  DatePicker, 
  Button, 
  message, 
  Typography, 
  Card, 
  Avatar,
  Form,
  Input,
  Modal,
  Upload
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import LuckyDrawABI from "../abis/LuckyDraw.json";
import useProfile from "../../service/prfile.js";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const CONTRACT_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";

// Màu cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UnboxingHistory = () => {
  // === MetaMask & Contract ===
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  // === Profile ===
  const { user, loading: loadingProfile, updateProfile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // === Connect Wallet ===
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

  // === Restore wallet on refresh ===
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

  // === Fetch My Spins ===
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

  // === Total stats ===
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

  // === Profile handlers ===
  const handleUpdate = (values) => {
    const data = { ...values, image: file || null };
    updateProfile(data);
    setIsModalOpen(false);
  };

  const handleFileChange = (info) => {
    const f = info.fileList[0]?.originFileObj;
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  // === Set preview when user loaded ===
  useEffect(() => {
    if (user?.avatarUrl) setPreview("http://localhost:5000" + user.avatarUrl);
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      {/* ====== PROFILE ====== */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <Card style={{ width: 420, textAlign: "center" }} loading={loadingProfile}>
          <Avatar
            src={
              preview ||
              (user?.avatarUrl ? "http://localhost:5000" + user.avatarUrl : "/assets/default-avatar.png")
            }
            size={120}
            style={{ marginBottom: 15 }}
          />
          <Title level={3}>{user?.fullName}</Title>
          <Text strong>Email:</Text> <Text>{user?.email}</Text>
          <br />
          {account && (
            <div>
              <Text strong>Đã kết nối ví: </Text>
              <Text>{account}</Text>
            </div>
          )}
          <br /><br />
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Chỉnh sửa Profile
          </Button>
        </Card>
      </div>

      <Modal
        title="Chỉnh sửa Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{ fullName: user?.fullName }}
        >
          <Form.Item
            label="Tên đầy đủ"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Avatar">
            <Upload
              accept="image/*"
              beforeUpload={() => false}
              showUploadList={false}
              onChange={handleFileChange}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh từ thiết bị</Button>
            </Upload>

            {preview && (
              <img
                src={preview}
                alt="Avatar Preview"
                style={{ marginTop: 10, width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* ====== END PROFILE ====== */}

      {/* ====== WALLET & HISTORY ====== */}
      {!account ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            background: "#f0f2f5",
          }}
        >
          <Card style={{ width: 400, textAlign: "center", borderRadius: 10, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
            <Button type="primary" block style={{ height: 45, fontSize: 16 }} onClick={connectWallet}>
              Kết nối ví MetaMask
            </Button>
          </Card>
        </div>
      ) : (
        <>
          

          {/* Thống kê & Biểu đồ */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 50 }}>
            <div style={{ minWidth: 220, textAlign: "center", padding: 20, borderRadius: 12, background: "#fafafa", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <Text strong style={{ fontSize: 16 }}>Tổng Token</Text>
              <div style={{ fontSize: 28, color: "#1890ff", margin: "8px 0" }}>{totalToken}</div>
              <Text strong style={{ fontSize: 16 }}>Tổng NFT</Text>
              <div style={{ fontSize: 28, color: "#52c41a", margin: "8px 0" }}>{totalNFT}</div>
              <Text strong style={{ fontSize: 16 }}>Tổng Không trúng</Text>
              <div style={{ fontSize: 28, color: "#f5222d", marginTop: 8 }}>{totalNone}</div>
            </div>

            <div style={{ width: 320, height: 320, padding: 10, borderRadius: 12, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Table
            style={{ marginTop: 30 }}
            columns={columns}
            dataSource={logs}
            loading={loading}
            rowKey={(r) => r._id}
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
      {/* ====== END WALLET & HISTORY ====== */}
    </div>
  );
};

export default UnboxingHistory;
