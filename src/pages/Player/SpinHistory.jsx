import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  DatePicker,
  Row,
  Col,
  Avatar,
  message,
} from "antd";
// import axios from "axios";
// import moment from "moment";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const SpinHistory = () => {
  const [spinLogs, setSpinLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  // const fetchSpinLogs = async (startDate, endDate) => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/player/spin-logs", {
  //       params: {
  //         startDate,
  //         endDate,
  //       },
  //     });
  //     setSpinLogs(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy lịch sử mở hộp thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchSpinLogs();
  // }, []);

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setDateRange([]);
      // fetchSpinLogs();
    } else {
      const [start, end] = dates;
      setDateRange(dates);
      // fetchSpinLogs(start.toISOString(), end.toISOString());
    }
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      // render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Tên giải",
      dataIndex: ["prize", "name"],
      key: "prizeName",
      render: (text) => text || "Chưa có giải",
    },
    {
      title: "Loại giải",
      dataIndex: "rewardType",
      key: "rewardType",
      render: (type) => type || "none",
    },
    {
      title: "Ảnh NFT",
      dataIndex: ["prize", "imageUrl"],
      key: "image",
      render: (url) =>
        url ? <Avatar shape="square" size={64} src={url} /> : <span>—</span>,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Lịch sử mở hộp</Title>

      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col>
            <RangePicker
              onChange={handleDateChange}
              value={dateRange}
              allowEmpty={[true, true]}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          dataSource={spinLogs}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default SpinHistory;
