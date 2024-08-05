import React, { useState, useEffect, useCallback } from "react";
import { Card, Typography } from "antd";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const ChartCustome = ({ source, entityType }) => {
  const data = source.map((item) => ({
    name: item.id,
    customer: item.customer,
    pv: parseFloat(item.billing),
  }));

  const [activeIndex, setActiveIndex] = useState(-1);
  const [fontSize, setFontSize] = useState(10);
  const [chartSize, setChartSize] = useState({ width: 500, height: 450 });

  const handleMouseEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const renderCustomBar = useCallback(
    (props) => {
      const { fill, index } = props;
      return (
        <Rectangle {...props} fill={activeIndex === index ? "#717189" : fill} />
      );
    },
    [activeIndex]
  );

  const handleResize = useCallback(() => {
    if (window.innerWidth <= 560) {
      setFontSize(12);
      setChartSize({ width: "100%", height: 400 });
    } else {
      setFontSize(14);
      setChartSize({ width: 500, height: 450 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const CustomLabel = ({ x, y, width, height, value }) => {
    const centerX = x + width / 2; // Coordenada X centrada
    const baseY = y + height; // Coordenada Y en la base de la barra

    return (
      <text
        x={20 + centerX}
        y={baseY}
        fill="#ffffff"
        fontSize={fontSize}
        textAnchor="start"
        dominantBaseline="central"
        alignmentBaseline="hanging"
        transform={`rotate(-90, ${centerX}, ${baseY})`}
      >
        {value.toLocaleString()}
      </text>
    );
  };

  return (
    <>
      <Card className="chart-card p-2 border-none bg-transparent h-full transition-transform duration-300 ease-in-out transform hover:shadow">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="pt-0 md:pt-32">
            <Typography.Title
              level={3}
              type="secondary"
              className="chart-title"
            >
              TOP 10
            </Typography.Title>
            <Typography.Paragraph type="secondary" className="chart-subtitle">
              {entityType}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" className="chart-subtitle">
              (USD)
            </Typography.Paragraph>
          </div>

          <ResponsiveContainer
            width={chartSize.width}
            height={chartSize.height}
          >
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 30,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="name"
                interval= {0}
                tick={{
                  interval: 0,
                  fill: "#ffffff",
                  fontSize,
                  fontWeight: "bold",
                  angle: -90,
                  textAnchor: "end",
                  dy: 2,
                  overflow: "visible",
                  whiteSpace: "normal",
                }}

                height={200}
              />
              <Tooltip />
              <Bar
                dataKey="pv"
                fill="#8884d8"
                shape={renderCustomBar}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <LabelList
                  dataKey="pv"
                  content={<CustomLabel />}

                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

export default ChartCustome;
