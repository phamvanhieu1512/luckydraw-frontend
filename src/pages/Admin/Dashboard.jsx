import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSpins: 0,
    totalPrizes: 0,
    todaySpins: 0,
    winRate: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // useEffect(() => {
  //   // Gọi API để lấy số liệu tổng quan
  //   const fetchStats = async () => {
  //     try {
  //       const res = await axios.get("/api/admin/dashboard"); // giả lập API
  //       setStats(res.data.stats);
  //       setChartData({
  //         labels: res.data.chart.labels,
  //         datasets: [
  //           {
  //             label: "Lượt quay",
  //             data: res.data.chart.data,
  //             borderColor: "rgba(24,144,255,1)",
  //             backgroundColor: "rgba(24,144,255,0.2)",
  //           },
  //         ],
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Số liệu nhanh */}
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
      </Row>

      {/* Biểu đồ lượt quay theo ngày */}
      <Card title="Lượt quay theo ngày">
        <Line data={chartData} />
      </Card>
    </div>
  );
};

export default Dashboard;
