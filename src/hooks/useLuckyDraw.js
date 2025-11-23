import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { luckyDrawAddress, luckyDrawABI } from "../contracts/contract";

export const useLuckyDraw = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const _signer = await _provider.getSigner();
    const _account = await _signer.getAddress();
    const _contract = new ethers.Contract(
      luckyDrawAddress,
      luckyDrawABI,
      _signer
    );

    setProvider(_provider);
    setSigner(_signer);
    setAccount(_account);
    setContract(_contract);
  };

  const getPrice = async () => {
    if (!contract) return 0;
    const priceValue = await contract.getPrice();
    return ethers.formatEther(priceValue);
  };

  const spinBox = async () => {
    if (!contract) return;
    try {
      const price = await contract.getPrice();
      const tx = await contract.spin({ value: price });
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt.transactionHash);
    } catch (err) {
      console.error("Spin failed:", err);
    }
  };

  const listenEvents = (callback) => {
    if (!contract) return;
    contract.on("SpinResult", callback);
    return () => contract.off("SpinResult", callback);
  };

  return { connectWallet, account, contract, getPrice, spinBox, listenEvents };
};
