import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Prizes = () => {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrize, setEditingPrize] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách giải
  const fetchPrizes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/prizes");
      setPrizes(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lấy danh sách giải thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  // Thêm / sửa giải
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingPrize) {
        await axios.put(`/api/admin/prizes/${editingPrize._id}`, values);
        message.success("Cập nhật giải thưởng thành công");
      } else {
        await axios.post("/api/admin/prizes", values);
        message.success("Thêm giải thưởng thành công");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingPrize(null);
      fetchPrizes();
    } catch (err) {
      console.error(err);
      message.error("Lưu giải thưởng thất bại");
    }
  };

  const handleEdit = (record) => {
    setEditingPrize(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa giải thưởng?",
      onOk: async () => {
        try {
          await axios.delete(`/api/admin/prizes/${id}`);
          message.success("Xóa giải thưởng thành công");
          fetchPrizes();
        } catch (err) {
          console.error(err);
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "Tên giải",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => type.toUpperCase(),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) =>
        url && <img src={url} alt="prize" style={{ width: 50 }} />,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tỷ lệ trúng (%)",
      dataIndex: "probability",
      key: "probability",
    },
    {
      title: "Rarity",
      dataIndex: "rarity",
      key: "rarity",
      render: (r) => r.charAt(0).toUpperCase() + r.slice(1),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Giải thưởng</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm giải
      </Button>

      <Table
        columns={columns}
        dataSource={prizes}
        rowKey={(record) => record._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPrize ? "Sửa giải thưởng" : "Thêm giải thưởng"}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingPrize(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên giải"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên giải" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại giải">
              <Option value="token">Token</Option>
              <Option value="nft">NFT</Option>
              <Option value="none">None</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh URL" name="imageUrl">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Tỷ lệ trúng (%)"
            name="probability"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Rarity" name="rarity" rules={[{ required: true }]}>
            <Select placeholder="Chọn rarity">
              <Option value="common">Common</Option>
              <Option value="rare">Rare</Option>
              <Option value="legendary">Legendary</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Prizes;
