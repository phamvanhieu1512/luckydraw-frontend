import { ethers } from "ethers";

// Địa chỉ contract đã deploy trên Songbird
export const luckyDrawAddress = "0x525fa7E32B62337E8bb9f109aFea1C0335b3B1D7";

// ABI từ Hardhat build (copy từ artifacts)
export const luckyDrawABI = [
  // Chỉ lấy các function/event cần dùng
  "function spin() external payable",
  "function price() view returns (uint256)",
  "event SpinResult(address indexed user, string rewardType, uint256 amount, uint256 nftId, uint256 timestamp)",
];
