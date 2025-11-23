import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  InputNumber,
  Switch,
  DatePicker,
  Button,
  message,
  Select,
} from "antd";

// import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // // Lấy cài đặt từ backend
  // const fetchSettings = async () => {
  //   try {
  //     const res = await axios.get("/api/admin/settings");
  //     const data = res.data;
  //     form.setFieldsValue({
  //       maxSpinsPerUser: data.maxSpinsPerUser,
  //       spinEnabled: data.spinEnabled,
  //       // spinTime: [moment(data.startTime), moment(data.endTime)],
  //       mode: data.mode,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Lấy cài đặt thất bại");
  //   }
  // };

  // useEffect(() => {
  //   fetchSettings();
  // }, []);

  // const handleSave = async (values) => {
  //   setLoading(true);
  //   try {
  //     const payload = {
  //       maxSpinsPerUser: values.maxSpinsPerUser,
  //       spinEnabled: values.spinEnabled,
  //       startTime: values.spinTime[0].toISOString(),
  //       endTime: values.spinTime[1].toISOString(),
  //       mode: values.mode,
  //     };
  //     await axios.post("/api/admin/settings", payload);
  //     message.success("Cập nhật cài đặt thành công");
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Cập nhật thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card title="Cài đặt hệ thống">
      <Form form={form} layout="vertical">
        {/* onFinish={handleSave} */}
        <Form.Item
          label="Số lượt quay tối đa mỗi người"
          name="maxSpinsPerUser"
          rules={[
            { required: true, message: "Vui lòng nhập số lượt quay tối đa" },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Bật vòng quay"
          name="spinEnabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Khung giờ mở vòng quay"
          name="spinTime"
          rules={[{ required: true }]}
        >
          <RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Chế độ" name="mode" rules={[{ required: true }]}>
          <Select placeholder="Chọn chế độ">
            <Option value="demo">Demo</Option>
            <Option value="real">Thật</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu cài đặt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;
