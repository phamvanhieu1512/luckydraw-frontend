import axios from "axios";

// Gọi API đăng ký
export const register = async (fullName, email, password) => {
  try {
    const res = await axios.post("http://localhost:5000/api/user/create", {
      fullName,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
