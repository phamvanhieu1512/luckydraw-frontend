import React, { useEffect, useState } from "react";
import { Table, Input, DatePicker, Select, message } from "antd";

// import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [rewardType, setRewardType] = useState("");

  // const fetchLogs = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/admin/spin-logs", {
  //       params: {
  //         user: searchUser,
  //         startDate: dateRange[0] ? dateRange[0].toISOString() : undefined,
  //         endDate: dateRange[1] ? dateRange[1].toISOString() : undefined,
  //         rewardType: rewardType || undefined,
  //       },
  //     });
  //     setLogs(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy lịch sử thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLogs();
  // }, [searchUser, dateRange, rewardType]);

  const columns = [
    {
      title: "Người chơi",
      dataIndex: ["userId", "fullName"],
      key: "user",
      render: (_, record) => record.userId?.fullName || "Unknown",
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
      key: "email",
    },
    {
      title: "Giải trúng",
      dataIndex: ["prizeId", "name"],
      key: "prize",
      render: (_, record) => record.prizeId?.name || "None",
    },
    {
      title: "Loại giải",
      dataIndex: "rewardType",
      key: "rewardType",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      // render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => record.status || "Hợp lệ",
    },
  ];

  return (
    <div>
      <h1>Lịch sử Lượt quay</h1>

      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Input
          placeholder="Tìm kiếm người chơi"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          style={{ width: 200 }}
        />

        <RangePicker onChange={(dates) => setDateRange(dates || [])} />

        <Select
          placeholder="Chọn loại giải"
          allowClear
          style={{ width: 150 }}
          value={rewardType}
          onChange={(value) => setRewardType(value)}
        >
          <Option value="token">Token</Option>
          <Option value="nft">NFT</Option>
          <Option value="none">None</Option>
        </Select>
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

export default History;
