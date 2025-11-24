// src/services/auth.js
import axios from "axios";
import { id } from "ethers";

const API_URL = "http://localhost:5000/api/user/login"; // đổi theo backend của bạn

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}`, { email, password });

    // Giả sử backend trả về token và user
    const { token, user } = response.data;

    const userId = user["id"]

    // Lưu vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Lỗi server, thử lại sau!");
    }
  }
};
