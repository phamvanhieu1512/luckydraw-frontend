import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

export default function useProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);

    const userID = localStorage.getItem("userId");
    if (!userID) {
      message.error("Không tìm thấy userId trong localStorage");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/view-detail/${userID}`
      );
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      message.error("Lấy thông tin profile thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Update profile (có thể gửi file)
const updateProfile = async (data) => {
  const userID = localStorage.getItem("userId");
  const formData = new FormData();

  // File upload từ AntD
  if (data.avatarFile && data.avatarFile.originFileObj) {
    formData.append("image", data.avatarFile.originFileObj); 
  }

  // Append các field text
  Object.keys(data).forEach((key) => {
    if (key !== "avatarFile") formData.append(key, data[key]);
  });

  // Debug lại
  for (const pair of formData.entries()) {
    console.log("FORMDATA:", pair[0], pair[1]);
  }

  try {
    const res = await axios.put(
      `http://localhost:5000/api/user/update/${userID}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    message.success("Cập nhật thành công!");
    setUser(res.data.user);
  } catch (error) {
    console.error(error);
    message.error("Cập nhật thất bại!");
  }
};



  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, updateProfile };
}
