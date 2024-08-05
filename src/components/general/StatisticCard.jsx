
import React from "react";
import { Card, Col, Statistic } from "antd";

export default function StatisticCard({ title, value }) {
  return (
    <>
      <Col
        xs={24}
        sm={12}
        md={8}
        lg={6}
        className="min-w-[300px] md:min-w-[400px] transition-transform duration-300 ease-in-out transform  hover:scale-105"
      >
        <Card className="w-full card-orders-created" bordered={false}>
          <Statistic
            className="flex flex-col items-center justify-center card-orders-created"
            title={title}
            value={value}
          />
        </Card>
      </Col>
    </>
  );
}
