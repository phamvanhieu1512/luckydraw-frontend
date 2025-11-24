import React, { useState } from "react";
import { Card, Avatar, Typography, Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useProfile from "../../service/prfile.js";

const { Title, Text } = Typography;

const Profile = () => {
  const { user, loading, updateProfile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleUpdate = (values) => {
    const data = {
      ...values,
      avatar: file || null, // thêm file vào request
    };

    updateProfile(data);
    setIsModalOpen(false);
  };

  const handleFileChange = (info) => {
    const f = info.file.originFileObj;
    setFile(f);

    // preview ảnh
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  if (!user) return null;

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <Card style={{ width: 420, textAlign: "center" }} loading={loading}>
        <Avatar
          src={user.avatarUrl || preview || "/assets/default-avatar.png"}
          size={120}
          style={{ marginBottom: 15 }}
        />

        <Title level={3}>{user.fullName}</Title>
        <Text strong>Email:</Text> <Text>{user.email}</Text>

        <br /><br />

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Chỉnh sửa Profile
        </Button>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            fullName: user.fullName,
          }}
        >
          <Form.Item
            label="Tên đầy đủ"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Avatar">
  <Upload
    accept="image/*"
    showUploadList={false}
    beforeUpload={() => false}  // quan trọng!
    onChange={(info) => {
      const file = info.fileList[0]?.originFileObj;

      if (!file) return;
      setFile(file);

      // Preview chuẩn
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }}
  >
    <Button icon={<UploadOutlined />}>Chọn ảnh từ thiết bị</Button>
  </Upload>

  {preview && (
    <img
      src={preview}
      alt="Avatar Preview"
      style={{
        marginTop: 10,
        width: 100,
        height: 100,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  )}
</Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
