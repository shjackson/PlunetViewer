import React, { useState, useEffect } from "react";
import { Flex, Row, Spin, Col, Card, Statistic } from "antd";
import CustomePieChart from "../components/general/PieChart";
import { transformPieData } from "@/helpers/helpers";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

export default function PieChartSection({ data, title, value, variation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <Spin size="large" className="mt-4" />
      ) : (
        <Row gutter={[16, 16]} justify="center">
            <div className="flex justify-center w-full">
              <Card
                title={title}
                className="pie-chart-title-card"
                bordered={false}
              >
                <Card.Grid hoverable={false} className="flex-[3_2_0%] ml-auto mx-1">
                  <Statistic
                    className="flex flex-col items-end justify-center"
                    value={value}
                    prefix="$"
                  />
                </Card.Grid>
                <Card.Grid hoverable={false} className="flex-[2_1_0%] mx-1">
                  <Statistic
                    className="second-value-card"
                    value={variation}
                    precision={2}
                    valueStyle={{
                      color: variation > 0 ? "#52C41A" : "#F5222D",
                    }}
                    prefix={
                      variation > 0 ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                    suffix="% (vs. 2023)"
                  />
                </Card.Grid>
              </Card>
            </div>
          <Col className="flex justify-center md:w-full">
            <CustomePieChart pieDataSource={transformPieData(data)} />
          </Col>
        </Row>
      )}
    </>
  );
}
