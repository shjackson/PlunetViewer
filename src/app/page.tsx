"use client";

import {
  BarChartOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  RiseOutlined
} from "@ant-design/icons";
import { Layout, Menu, Flex, Button, Spin } from "antd";
import { Content, Footer  } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Reports from "../components/itemsMenu/Reports";
import Statistics from "../components/itemsMenu/Statistics";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [viewkey, setViewKey] = useState(3);
  const [spinning, setSpinning] = useState(false);
  const t = useTranslations("Page");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const getContent = () => {
    switch (viewkey) {
      case 1:
        return <PlusCircleOutlined />;
      case 2:
        return <Reports />;
      case 3:
        return <Statistics />;
      default:
        return <></>;
    }
  };
  return (
    <>
      <Layout className="min-h-screen">
        <Sider
          className="fixed h-screen"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 1 }}
        >
        <Flex align="center" justify="center">
          <img className="logo" src="/tbo.svg" alt="TBO Logo" />
        </Flex>
          <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["3"]}
          items={[
            {
              //id: "reports",
              key: "2",
              icon: <BarChartOutlined />,
              label: t("label-report"),
              onClick: () => setViewKey(2),
            },
            {
              //id: "sheets",
              key: "3",
              icon: <RiseOutlined />,
              label: t("label-kpis"),
              onClick: () => setViewKey(3),
            },
          ]}
        />

          <Flex
            align="center"
            justify="center"
            style={{ position: "absolute", bottom: 0, width: "100%" }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined className="icon" />
                ) : (
                  <MenuFoldOutlined className="icon" />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{zIndex: 12}}
            />
          </Flex>
        </Sider>

        <Layout
          className="site-layout h-screen"
          style={{
            marginLeft: collapsed ? 80 : 200,
            height: "100vh",
            overflow: "auto",
            transition: "1s easy",
          }}
        >
          <Content
            className="site-layout-background w-full"
            style={{
              overflow: "auto",
              height: "100vh",
              paddingTop: "20px"
            }}
          >
            {getContent()}
          </Content>
          {/* <Footer
            style={{
              textAlign: "center",
              height: "70px",
              lineHeight: "70px",
              backgroundColor: "transparent",
              color: "#fff",
              position: "fixed",
              bottom: 0,
              left: collapsed ? "80px" : "200px",
              right: 0,
              zIndex: 10,
            }}
          >
            <div style={{ position: "absolute", bottom: "15px", right: "15px" }}>
              <img className="footer-logo" src="/Group.svg" alt="TBO Logo" />
            </div>
          </Footer> */}
        </Layout>
      </Layout>
      <Spin spinning={spinning} fullscreen  />
    </>
  );
}
