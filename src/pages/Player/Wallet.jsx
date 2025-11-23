import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Modal,
  Table,
  message,
} from "antd";

// import moment from "moment";

const { Title, Text } = Typography;

const Wallet = () => {
  const [userData, setUserData] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Lấy dữ liệu user
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/api/player/wallet");
  //     // res.data = { user, tokenHistory, nfts }
  //     setUserData(res.data.user);
  //     setTokenHistory(res.data.tokenHistory || []);
  //     setNfts(res.data.nfts || []);
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy dữ liệu Wallet thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
    setModalVisible(true);
  };

  const tokenColumns = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      // render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Số lượng Token",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Wallet</Title>

      {userData && (
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card>
              <Title level={4}>Tổng token</Title>
              <Text>{userData.totalToken || 0}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4}>Lượt quay còn lại</Title>
              <Text>{userData.spinsLeft}</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Title level={4}>Lượt quay hôm nay / tuần / tổng</Title>
              <Text>
                {userData.spinsToday} / {userData.spinsWeek} /{" "}
                {userData.spinsTotal}
              </Text>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card title="Lịch sử Token">
            <Table
              dataSource={tokenHistory}
              columns={tokenColumns}
              rowKey={(record) => record._id}
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="NFTs của bạn">
            <Row gutter={[16, 16]}>
              {nfts.map((nft) => (
                <Col span={8} key={nft._id}>
                  <Avatar
                    src={nft.imageUrl}
                    size={100}
                    shape="square"
                    onClick={() => handleNFTClick(nft)}
                    style={{ cursor: "pointer" }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Modal xem chi tiết NFT */}
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        centered
      >
        {selectedNFT && (
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedNFT.imageUrl}
              alt="NFT"
              style={{ width: 200, marginBottom: 20 }}
            />
            <Title level={4}>{selectedNFT.name}</Title>
            <Text>Rarity: {selectedNFT.rarity}</Text>
            {selectedNFT.txHash && (
              <div>
                <Text>TxHash: {selectedNFT.txHash}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Wallet;
