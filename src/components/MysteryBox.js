import React, { useState, useEffect } from "react";
import { useLuckyDraw } from "../hooks/useLuckyDraw";
import "./MysteryBox.css"; // file CSS animation

const MysteryBox = () => {
  const { connectWallet, account, getPrice, spinBox, listenEvents } =
    useLuckyDraw();
  const [price, setPrice] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    if (account) {
      getPrice().then(setPrice);

      listenEvents((user, rewardType, amount, nftId, timestamp) => {
        setIsSpinning(false);
        setReward({ rewardType, amount, nftId, timestamp });
      });
    }
  }, [account]);

  const handleSpin = async () => {
    if (!account) {
      alert("Connect your wallet first!");
      return;
    }
    setReward(null);
    setIsSpinning(true);
    await spinBox();
  };

  return (
    <div className="mystery-box-container">
      {!account && (
        <button className="btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {account && (
        <>
          <p>Connected: {account}</p>
          <p>Spin price: {price} SGB</p>

          <div className="box-wrapper">
            <div className={`box ${isSpinning ? "shaking" : ""}`}></div>
          </div>

          <button className="btn" onClick={handleSpin} disabled={isSpinning}>
            {isSpinning ? "Spinning..." : "Open Mystery Box"}
          </button>

          {reward && (
            <div className="reward">
              {reward.rewardType === "none" && (
                <p>😢 No reward, better luck next time!</p>
              )}
              {reward.rewardType === "token" && (
                <p>🎉 You won {reward.amount} tokens!</p>
              )}
              {reward.rewardType === "nft" && (
                <p>🏆 You won NFT ID #{reward.nftId}!</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MysteryBox;
