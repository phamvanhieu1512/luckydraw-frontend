import React, { useEffect, useState } from "react";
import { Table, Card, Typography, DatePicker, Row, Col, Input, message } from "antd";
import { ethers } from "ethers";
import LuckyDrawABI from "../abis/LuckyDraw.json";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

const CONTRACT_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";

const SpinHistory = () => {
  const [spinLogs, setSpinLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Hàm tạo địa chỉ random
  const generateRandomAddresses = (count) => {
    const addresses = [];
    for (let i = 0; i < count; i++) {
      let addr = "0x" + [...Array(40)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
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

      // Thêm 20 user giả lập
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

  // Lọc theo ngày
  const handleDateChange = (dates) => {
    setDateRange(dates || []);
    filterLogs(searchText, dates);
  };

  // Lọc theo search + date
  const filterLogs = (searchValue, dates) => {
    let data = [...spinLogs];

    if (searchValue) {
      data = data.filter((log) =>
        log.user.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (dates && dates.length === 2) {
      const [start, end] = dates;
      data = data.filter(
        (log) => log.createdAt >= start.toDate() && log.createdAt <= end.toDate()
      );
    }

    setFilteredLogs(data);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterLogs(value, dateRange);
  };

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date.toLocaleString(),
    },
    {
      title: "Người chơi",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Loại giải",
      dataIndex: "rewardType",
      key: "rewardType",
      render: (text) => (text === "none" ? "Không trúng" : text),
    },
    {
      title: "NFT ID",
      dataIndex: "nftId",
      key: "nftId",
    },
    {
      title: "Token",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <div style={{ padding: 20 }}>

      <Card style={{ marginBottom: 20 }}>
       <Row gutter={16} justify="center" align="middle" style={{ marginTop: 20 }}>
          {/* <Col>
            <RangePicker
              onChange={handleDateChange}
              value={dateRange}
              allowEmpty={[true, true]}
            />
          </Col> */}
          <Col>
          <Input
            style={{ width: '800px'}}
            placeholder="Tìm theo Người chơi"
            value={searchText}
            allowClear
            onChange={(e) => {
              const value = e.target.value;
              setSearchText(value);
              filterLogs(value, dateRange); // lọc trực tiếp khi gõ
            }}
          />
        </Col>
        </Row>
      </Card>

      <Card>
        <Table
          dataSource={filteredLogs}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          loading={loading}
          locale={{ emptyText: "🔍 Tìm kiếm không trùng kết quả" }}
        />
      </Card>
    </div>
  );
};

export default SpinHistory;
