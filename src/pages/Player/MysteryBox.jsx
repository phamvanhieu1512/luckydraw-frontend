import React, { useState } from "react";
import { Button, Card, Modal, Typography } from "antd";
import Confetti from "react-confetti";

const { Title, Text } = Typography;

const MysteryBox = () => {
  const [loading, setLoading] = useState(false);
  const [reward, setReward] = useState(null); // { type, amount, imageUrl, rarity }
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpenBox = async () => {
    setLoading(true);
    setReward(null);
    setOpen(true);

    try {
      // Gọi API mở hộp
      const res = await axios.post("/api/player/open-box", { price: 1 });
      // res.data = { type: "token"|"nft"|"none", amount?, imageUrl?, rarity? }

      // Delay animation 2 giây
      setTimeout(() => {
        setReward(res.data);

        if (res.data.type === "token" || res.data.type === "nft") {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Xác định màu hiển thị
  const getRewardColor = () => {
    if (!reward) return "gray";
    if (reward.type === "token") return "green";
    if (reward.type === "nft")
      return reward.rarity === "legendary" ? "gold" : "green";
    return "gray";
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <Card style={{ width: 300, margin: "0 auto", padding: 20 }}>
        <img
          src="/assets/mystery-box.png"
          alt="Mystery Box"
          style={{
            width: 150,
            animation: loading ? "shake 0.5s infinite" : "none",
          }}
        />
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          loading={loading}
          onClick={handleOpenBox}
        >
          Mở Hộp (1 CFX)
        </Button>
      </Card>

      <Modal
        visible={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
      >
        {reward ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            {reward.type === "token" && (
              <Title style={{ color: getRewardColor() }}>
                🎉 Bạn nhận được {reward.amount} Token!
              </Title>
            )}
            {reward.type === "nft" && (
              <div>
                <Title style={{ color: getRewardColor() }}>
                  🎉 Bạn nhận được NFT!
                </Title>
                <img
                  src={reward.imageUrl}
                  alt="NFT"
                  style={{ width: 200, marginTop: 20 }}
                />
              </div>
            )}
            {reward.type === "none" && (
              <Title style={{ color: getRewardColor() }}>
                😄 Chúc bạn may mắn lần sau!
              </Title>
            )}
          </div>
        ) : (
          <Text>Đang mở hộp...</Text>
        )}
      </Modal>

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* CSS animation shake */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MysteryBox;
