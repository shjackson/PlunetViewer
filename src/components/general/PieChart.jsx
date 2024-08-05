import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3e3e99",
  "#4b4bb2",
  "#5a5ac6",
  "#6969d3",
  "#8181e2",
  "#a6a6ff",
  "#c3c3ff",
  "#d9d9ff",
  "#080821",
];

const CustomePieChart = ({ pieDataSource }) => {
  const [activeSlices, setActiveSlices] = useState(pieDataSource.map(() => true));
  const [chartSize, setChartSize] = useState({ width: 300, height: 350 });

  const handleResize = () => {
    if (window.innerWidth <= 765) {
      setChartSize({ width: "100%", height: "400px" });
    } else if (window.innerWidth <= 1050) {
      setChartSize({ width: 350, height: 350 });
    } else {
      setChartSize({ width: 300, height: 350 });
    }
  };

  const handleLegendClick = (data, index) => {
    const newActiveSlices = [...activeSlices];
    newActiveSlices[index] = !newActiveSlices[index];
    if (newActiveSlices.every((slice) => !slice)) {
      newActiveSlices[index] = true;
    }
    setActiveSlices(newActiveSlices);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeData = pieDataSource.map((entry, index) => ({
    ...entry,
    active: activeSlices[index],
  }));

  const filteredData = activeData.filter((entry) => entry.active);
  const sortedPieDataSource = pieDataSource.sort((a, b) => b.count - a.count);

  return (
    <>
      <div className="piechart-container">
        <div
          className="piechart-graphic"
          style={{ width: chartSize.width, height: chartSize.height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={filteredData}
                cx="50%"
                cy="50%"
                outerRadius={chartSize.width / 3}
                fill="#8884d8"
                startAngle={90}
                endAngle={-270}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
               className="custom-legend"
                onClick={(data, index) => handleLegendClick(data, index)}
                formatter={(value, entry, index) => <span style={{color: 'white'}}>{value}</span>}
                payload={pieDataSource.map((entry, index) => ({
                  id: entry.name,
                  type: "square",
                  value: entry.name,
                  color: COLORS[index % COLORS.length],
                  inactive: !activeSlices[index],

                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="piechart-list-container">
          <ul className="piechart-list">
            {sortedPieDataSource.map((item, index) => (
              <li key={index} className="text-white piechart-list-item">
                <span className="piechart-item-name">{item.name}: </span>
                <span className="piechart-item-count">
                  $ {item.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CustomePieChart;
