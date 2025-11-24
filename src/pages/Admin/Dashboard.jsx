import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Input, DatePicker, message } from "antd";
import { Line } from "react-chartjs-2";
import { ethers } from "ethers";
import LuckyDrawABI from "../abis/LuckyDraw.json";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CONTRACT_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSpins: 0,
    totalPrizes: 0,
    todaySpins: 0,
    winRate: 0,
    connectedWallets: 0, // thêm số ví kết nối
  });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [spinLogs, setSpinLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);

  // Tạo ví giả lập
  const generateRandomAddresses = (count) => {
    const addresses = [];
    for (let i = 0; i < count; i++) {
      let addr = "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
      addresses.push(addr);
    }
    return addresses;
  };

  const fetchAllSpins = async () => {
    if (!window.ethereum) {
      message.error("Vui lòng kết nối MetaMask");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LuckyDrawABI.abi, provider);

      const result = await contract.getAllSpins();
      const users = result[0];
      const spins = result[1];

      const allSpinData = users
        .map((user, idx) =>
          spins[idx].map((spin) => ({
            _id: `${user}-${spin.timestamp.toString()}`,
            user,
            rewardType: spin.rewardType,
            amount: ethers.formatEther(spin.amount),
            nftId: spin.nftId.toString(),
            createdAt: new Date(Number(spin.timestamp) * 1000),
          }))
        )
        .flat();

      // thêm 20 ví giả lập
      const fakeUsers = generateRandomAddresses(20);
      const fakeSpinData = fakeUsers.map((user) => {
        const types = ["none", "token", "nft"];
        const rewardType = types[Math.floor(Math.random() * 3)];
        return {
          _id: `${user}-0`,
          user,
          rewardType,
          amount: rewardType === "token" ? (Math.floor(Math.random() * 10) + 1).toString() : "0.0",
          nftId: rewardType === "nft" ? Math.floor(Math.random() * 100).toString() : "0.0",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        };
      });

      const combinedData = [...allSpinData, ...fakeSpinData];
      // setSpinLogs(combinedData);
      // setFilteredLogs(combinedData);

      setSpinLogs(allSpinData);
      setFilteredLogs(allSpinData);

      // Tính stats
      const totalUsers = new Set(combinedData.map((log) => log.user)).size;
      const totalSpins = combinedData.length;
      const totalPrizes = combinedData.filter((log) => log.rewardType !== "none").length;
      const today = new Date().toDateString();
      const todaySpins = combinedData.filter((log) => log.createdAt.toDateString() === today).length;
      const winRate = totalSpins === 0 ? 0 : Math.round((totalPrizes / totalSpins) * 100);

      setStats({
        totalUsers,
        totalSpins,
        totalPrizes,
        todaySpins,
        winRate,
        connectedWallets: users.length, // số ví thực tế kết nối contract
      });

      // Biểu đồ 7 ngày
      const labels = [];
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        labels.push(day.toLocaleDateString());
        const count = combinedData.filter((log) => log.createdAt.toDateString() === day.toDateString()).length;
        data.push(count);
      }
      setChartData({
        labels,
        datasets: [
          {
            label: "Lượt quay",
            data,
            borderColor: "rgba(24,144,255,1)",
            backgroundColor: "rgba(24,144,255,0.2)",
          },
        ],
      });
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử spin:", err);
      message.error("Lấy dữ liệu thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSpins();
  }, []);

  // Lọc theo ngày và search
  const filterLogs = (text, dates) => {
    let data = [...spinLogs];

    if (text) {
      data = data.filter((log) => log.user.toLowerCase().includes(text.toLowerCase()));
    }
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      data = data.filter((log) => log.createdAt >= start.toDate() && log.createdAt <= end.toDate());
    }
    setFilteredLogs(data);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates || []);
    filterLogs(searchText, dates);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 30 }}>
        <Col span={4}>
          <Card>
            <Statistic title="Tổng người chơi" value={stats.totalUsers} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Tổng lượt quay" value={stats.totalSpins} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Giải thưởng còn lại" value={stats.totalPrizes} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Tỷ lệ trúng" value={`${stats.winRate}%`} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Lượt quay hôm nay" value={stats.todaySpins} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="Ví kết nối" value={stats.connectedWallets} />
          </Card>
        </Col>
      </Row>

      <Card title="Lượt quay theo ngày" style={{ marginBottom: 20 }}>
        <Line data={chartData} />
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} justify="start">
          <Col>
            <RangePicker onChange={handleDateChange} value={dateRange} allowEmpty={[true, true]} />
          </Col>
          <Col>
            <Input
              placeholder="Tìm theo người chơi"
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                filterLogs(value, dateRange);
              }}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          dataSource={filteredLogs}
          columns={[
            { title: "Thời gian", dataIndex: "createdAt", key: "createdAt", render: (date) => date.toLocaleString() },
            { title: "Người chơi", dataIndex: "user", key: "user" },
            { title: "Loại giải", dataIndex: "rewardType", key: "rewardType", render: (text) => (text === "none" ? "Không trúng" : text) },
            { title: "NFT ID", dataIndex: "nftId", key: "nftId" },
            { title: "Token", dataIndex: "amount", key: "amount" },
          ]}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "🔍 Không có kết quả" }}
        />
      </Card>

      <Card title="Danh sách ví đã kết nối" style={{ marginTop: 20 }}>
  <Table
    dataSource={[...new Set(spinLogs.map((log) => log.user))].map((addr, index) => ({
      key: index,
      address: addr,
    }))}
    columns={[
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        render: (val) => val + 1,
      },
      {
        title: "Địa chỉ ví",
        dataIndex: "address",
        key: "address",
      },
    ]}
    pagination={{ pageSize: 10 }}
    locale={{ emptyText: "Không có ví nào" }}
  />
</Card>

    </div>
  );
};

export default Dashboard;
