import React, { useState, useEffect } from "react";
import { Button, Card, Modal, Typography, Space, message } from "antd";
import Confetti from "react-confetti";
import { ethers } from "ethers";
import LuckyDrawABI from "../abis/LuckyDraw.json";

const { Title, Text } = Typography;
const LUCKYDRAW_ADDRESS = "0x400100F5014f2acAca15DDC667B5528F789e2CBC";

const MysteryBox = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [loading, setLoading] = useState(false);
  const [reward, setReward] = useState(null);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Kết nối Metamask
 // Kết nối ví
const connectWallet = async () => {
  if (!window.ethereum) return alert("Cài Metamask trước nhé!");

  try {
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    if (!accounts?.length) return alert("Chưa có account nào kết nối!");

    const _signer = await _provider.getSigner();
    setProvider(_provider);
    setSigner(_signer);
    setAccount(accounts[0]);
    setContract(new ethers.Contract(LUCKYDRAW_ADDRESS, LuckyDrawABI.abi, _signer));

    // Lưu trạng thái đã kết nối
    localStorage.setItem("walletConnected", "true");

    message.success(`Đã kết nối ví: ${accounts[0]}`);
  } catch (err) {
    console.error("Lỗi khi kết nối ví:", err);
  }
};

// Ngắt kết nối ví

const disconnectWallet = () => {
  Modal.confirm({
    title: "Xác nhận",
    content: "Bạn có chắc chắn muốn ngắt kết nối ví?",
    okText: "OK",
    cancelText: "Hủy",
    onOk: () => {
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setContract(null);
      setReward(null);
      setOpen(false);

      // Xoá trạng thái kết nối
      localStorage.removeItem("walletConnected");

      message.warning("Đã ngắt kết nối ví!");
    },
    onCancel: () => {
      message.info("Hủy thao tác ngắt kết nối.");
    },
  });
};

// Khi reload trang: khôi phục trạng thái kết nối (nếu có)
useEffect(() => {
  const connected = localStorage.getItem("walletConnected");
  if (!connected) return;

  const restoreConnection = async () => {
    if (!window.ethereum) return;

    const _provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts?.length) return;

    const _signer = await _provider.getSigner();
    setProvider(_provider);
    setSigner(_signer);
    setAccount(accounts[0]);
    setContract(new ethers.Contract(LUCKYDRAW_ADDRESS, LuckyDrawABI.abi, _signer));
  };

  restoreConnection();
}, []);

  // Mở hộp
const handleOpenBox = async () => {
  if (!contract) {
    console.error("Contract chưa được khởi tạo!");
    return;
  }

  setReward(null);
  setShowConfetti(false);
  setLoading(true); // Bật hiệu ứng rung rinh

  try {
    const price = await contract.getPrice();
    const tx = await contract.spin({ value: ethers.toBigInt(price) });
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt.transactionHash);

    const spinEvent = receipt.logs
      .map(log => {
        try { return contract.interface.parseLog(log); } 
        catch { return null; }
      })
      .find(parsed => parsed && parsed.name === "SpinResult");

    if (!spinEvent) {
      console.error("Không tìm thấy event SpinResult!");
      return;
    }

    const [user, rewardType, amount, nftId] = spinEvent.args;

    const newReward = rewardType === "token"
      ? { type: "token", amount: ethers.formatEther(ethers.toBigInt(amount)) }
      : rewardType === "nft"
        ? { type: "nft", nftId }
        : { type: "none", message: "Chúc bạn lần sau!" };

    if (rewardType !== "none") setShowConfetti(true);

    setReward(newReward);
    setOpen(true);

  } catch (err) {
    console.error("Lỗi khi mở hộp:", err);
    message.error("Mở hộp thất bại!");
  } finally {
    setLoading(false); // Tắt hiệu ứng rung rinh
  }
};


  const getRewardColor = () => {
    if (!reward) return "gray";
    if (reward.type === "token") return "green";
    if (reward.type === "nft") return "gold";
    if (reward.type === "none") return "red";
    return "gray";
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <Card
        style={{
          width: 550,
          margin: "0 auto",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Title level={3}>🎁 Mystery Box</Title>

        <img
          src="data:image/png;base64,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"
          alt="Mystery Box"
          style={{
            width: 300,
            marginTop: 20,
            animation: loading ? "shake 0.5s infinite" : "none",
          }}
        />

        <Space direction="vertical" size="large" style={{ marginTop: 20 }}>
          {!account ? (
            <Button type="primary" block onClick={connectWallet}>
              🔗 Kết nối Metamask
            </Button>
          ) : (
            <>
              <Text strong>Đã kết nối: {account}</Text>
              <Button type="primary" block loading={loading} onClick={handleOpenBox}>
                🎲 Mở Hộp (1 CFX)
              </Button>
              <Button danger block onClick={disconnectWallet}>
                Ngắt kết nối
              </Button>
            </>
          )}
        </Space>
      </Card>

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        destroyOnClose
      >
        {reward ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            {reward.type === "token" && (
              <Title style={{ color: getRewardColor() }}>
                🎉 Bạn nhận được {reward.amount} Token!
              </Title>
            )}
            {reward.type === "nft" && (
              <Title style={{ color: getRewardColor() }}>
                🎉 Bạn nhận được NFT! ID: {reward.nftId}
              </Title>
            )}
            {reward.type === "none" && (
              <Title style={{ color: getRewardColor() }}>{reward.message}</Title>
            )}
          </div>
        ) : (
          <Text>Đang mở hộp...</Text>
        )}
      </Modal>


      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

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
