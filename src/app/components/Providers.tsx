"use client";
import React, { useState, useEffect } from "react";
import { ShoppingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu, theme, Space, Typography, Row, Col } from "antd";
import type { MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";

import "../../../public/antd.min.css";
import withTheme from "../theme";

const { Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function Providers({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [current, setCurrent] = useState<string>("home");
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const checkPath = () => {
      if (path.includes("products")) {
        setCurrent("products");
      }
      if (path.includes("carts")) {
        setCurrent("carts");
      }
    };
    checkPath();
  }, [path]);

  const onClick: MenuProps["onClick"] = (e) => {
    const keyFix = e.key;
    setCurrent(keyFix);
    router.push(`/${keyFix}`);
  };

  const onClickIcon = () => {
    setCurrent("home");
    router.push("/");
  };

  return withTheme(
    <Layout style={{ height: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <Space
          direction="vertical"
          align="center"
          size={"small"}
          onClick={onClickIcon}
          style={{ width: "100%", marginTop: 8 }}
        >
          <Avatar
            style={{
              backgroundColor: "#800080",
            }}
            size="large"
          >
            U
          </Avatar>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Dealls Dashboard
          </Title>
        </Space>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current.toString()]}
          items={[
            {
              key: "products",
              icon: <ShoppingOutlined />,
              label: "Products",
            },
            {
              key: "carts",
              icon: <ShoppingCartOutlined />,
              label: "Carts",
            },
          ]}
          onClick={onClick}
        />
      </Sider>
      <Layout style={{ height: "100vh" }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: "auto",
          }}
        >
          <Row justify={"center"}>
            <Col
              xs={22}
              sm={20}
              xl={18}
              style={{
                marginTop: "2rem",
                minHeight: "80vh",
                borderRadius: 8,
              }}
            >
              {children}
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Text type="secondary">
            Dealls Dashboard ©2023 Created by <b>IAG</b>
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}
