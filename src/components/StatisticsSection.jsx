import { Flex, Row, Spin, Col, Card, Statistic } from "antd";
import { useEffect, useState } from "react";

export default function StatisticsSection() {
  const [ordersCreatedTodayData, setOrdersCreatedTodayData] = useState([]);
  const [ordersCreatedMonthData, setOrdersCreatedMonthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatisticsData = async () => {
      try {
        const todaysOrdersResponse = await fetch(
          `/api/kpi?type=orders-created-today`
        );
        const todaysOrdersData = await todaysOrdersResponse.json();
        setOrdersCreatedTodayData(todaysOrdersData);

        const monthsOrdersResponse = await fetch(
          `/api/kpi?type=orders-created-month`
        );
        const monthsOrdersData = await monthsOrdersResponse.json();
        setOrdersCreatedMonthData(monthsOrdersData);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setLoading(false);
      }
    };
    getStatisticsData();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-full">
        {loading ? (
          <div className="flex justify-center items-center w-full h-96">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/2 p-2">
              <div className="flex justify-center">
                <Card
                  title="Orders created today"
                  className="pie-chart-title-card"
                  bordered={false}
                >
                    <Card.Grid hoverable={false} className="p-0 flex-[3_2_0%] ml-auto mx-1">
                      <Statistic
                        className="flex flex-col items-end justify-center"
                        value={ordersCreatedTodayData.billing}
                        prefix="$"
                      />
                    </Card.Grid>
                    <Card.Grid hoverable={false} className="p-0 flex-[2_1_0%] mx-1">
                      <Statistic
                        className="second-value-card"
                        value={ordersCreatedTodayData.count}
                        suffix="orders"
                      />
                    </Card.Grid>
                </Card>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <div className="flex justify-center">
                <Card
                  title="Orders created this month"
                  className="pie-chart-title-card"
                  bordered={false}
                >
                  <Card.Grid hoverable={false} className="p-0 flex-[3_2_0%] ml-auto mx-1">
                    <Statistic
                      className="flex flex-col items-end justify-center"
                      value={ordersCreatedMonthData.billing}
                      prefix="$"
                    />
                  </Card.Grid>
                  <Card.Grid hoverable={false} className="p-0 flex-[2_1_0%] mx-1">
                    <Statistic
                      className="second-value-card"
                      value={ordersCreatedMonthData.count}
                      suffix="orders"
                    />
                  </Card.Grid>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
