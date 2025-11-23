import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, message } from "antd";

// import moment from "moment";

const { RangePicker } = DatePicker;

const UnboxingHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  // const fetchLogs = async (all = false) => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/player/unboxing-history", {
  //       params: {
  //         limit: all ? undefined : 10,
  //         startDate: dateRange[0] ? dateRange[0].toISOString() : undefined,
  //         endDate: dateRange[1] ? dateRange[1].toISOString() : undefined,
  //       },
  //     });
  //     setLogs(res.data);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy lịch sử mở hộp thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLogs();
  // }, [dateRange]);

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      // render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Tên giải",
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
      title: "Ảnh NFT",
      dataIndex: ["prizeId", "imageUrl"],
      key: "image",
      render: (url, record) =>
        record.rewardType === "nft" && url ? (
          <img src={url} alt="NFT" style={{ width: 80, borderRadius: 4 }} />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử mở hộp</h2>

      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <RangePicker onChange={(dates) => setDateRange(dates || [])} />
        <Button
        // onClick={() => fetchLogs(true)}
        >
          Xem tất cả
        </Button>
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
