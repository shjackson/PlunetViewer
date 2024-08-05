import StatisticsSection from "../StatisticsSection";
import GraphicSection from "../GraphicSection";
import PieChartSection from "../PieChartSection";
import { Flex } from "antd";
import { useEffect, useState } from "react";

export default function Statistics() {
  const [pie1Title, setPie1Title] = useState();
  const [pie1Value, setPie1Value] = useState();
  const [pie1Variation, setPie1Variation] = useState();
  const [pie1Data, setPie1Data] = useState();

  const [pie2Title, setPie2Title] = useState();
  const [pie2Value, setPie2Value] = useState();
  const [pie2Variation, setPie2Variation] = useState();
  const [pie2Data, setPie2Data] = useState();

  const [loading, setLoading] = useState(true);

  const fechDataSource = async () => {
    try {
      //setting things for Pie Chart 1
      setPie1Title(
        `Billing ${new Date().toLocaleString("default", { month: "long" })}`
      );
      const yearToYearMonthlyGrowthResponse = await fetch(
        `/api/kpi?type=year-to-year-monthly-growth`
      );
      const yearToYearMonthlyGrowthData =
        await yearToYearMonthlyGrowthResponse.json();
      setPie1Value(yearToYearMonthlyGrowthData.current);
      setPie1Variation(yearToYearMonthlyGrowthData.variation);
      const monthlyBillingBySectionResponse = await fetch(
        `/api/kpi?type=monthly-billing-by-section`
      );
      const monthlyBillingBySectionData =
        await monthlyBillingBySectionResponse.json();
      setPie1Data(monthlyBillingBySectionData.data);

      //setting things for Pie Chart 2
      setPie2Title(`Billing ${new Date().getFullYear()}`);
      const elapsedYearGrowthResponse = await fetch(
        `/api/kpi?type=year-to-year-elapsed-time`
      );
      const elapsedYearGrowthData = await elapsedYearGrowthResponse.json();
      setPie2Value(elapsedYearGrowthData.current);
      setPie2Variation(elapsedYearGrowthData.variation);
      const elapsedYearBillingBySectionResponse = await fetch(
        `/api/kpi?type=elapsed-year-billing-by-section`
      );
      const elapsedYearBillingBySectionData =
        await elapsedYearBillingBySectionResponse.json();
      setPie2Data(elapsedYearBillingBySectionData.data);
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
    <Flex align="center" column className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row w-full h-full mb-4">
        <StatisticsSection />
      </div>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="w-full md:w-1/2 p-2">
          <PieChartSection
            data={pie1Data}
            title={pie1Title}
            value={pie1Value}
            variation={pie1Variation}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <PieChartSection
            data={pie2Data}
            title={pie2Title}
            value={pie2Value}
            variation={pie2Variation}
          />
        </div>
      </div>
      <div className="w-full h-full">
        <GraphicSection />
      </div>
    </Flex>
  );
}
