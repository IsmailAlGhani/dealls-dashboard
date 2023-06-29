"use client";
import { Typography, Space } from "antd";

const { Title, Text } = Typography;
export default function Home() {
  return (
    <Space
      direction="vertical"
      align="center"
      size={"middle"}
      style={{ width: "100%" }}
    >
      <Title level={2} style={{ margin: 0 }}>
        Welcome to Dealls Dashboard
      </Title>
      <Text type="secondary" style={{ margin: 0 }}>
        You can click section Products or Carts for see the content.
      </Text>
    </Space>
  );
}
