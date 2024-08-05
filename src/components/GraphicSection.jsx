import { Flex, Row, Spin, Col } from "antd";
import ChartCustome from "../components/general/ChartCustome";
import { useEffect, useState } from "react";

export default function GraphicSection2() {
  const [loading, setLoading] = useState(true);
  const [topLanguagesData, setTopLanguagesData] = useState();
  const [topCustomersData, setTopCustomersData] = useState();

  const fechDataSource = async () => {
    try {
      const topLanguagesResponse = await fetch(`/api/kpi?type=monthly-billed-languages`);
      const topLanguagesDataJson = await topLanguagesResponse.json();
      setTopLanguagesData(topLanguagesDataJson.data.slice(0, 10));
      const topCustomersResponse = await fetch(`/api/kpi?type=monthly-billed-customers`);
      const topCustomersDataJson = await topCustomersResponse.json();
      setTopCustomersData(topCustomersDataJson.data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fechDataSource();
  }, []);

  return (
    <Flex className="mt-4 w-full w-full mx-auto ">
      {loading ? (
        <div className="flex justify-center items-center w-full h-96">
          <Spin size="large" />
        </div>
      ) : (
        <Row
          className="flex justify-around items-center w-full h-full m-0 p-0"
        >
          <Row key="1" justify="center">
            <ChartCustome source={topLanguagesData} entityType="Languages"/>
          </Row>
          <Row key="2"  justify="center">
            <ChartCustome source={topCustomersData} entityType="Customers"/>
          </Row>
        </Row>
      )}
    </Flex>
  );
}
