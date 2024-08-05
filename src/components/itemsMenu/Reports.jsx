import React, { useState } from "react";

import DatePickerCustome from "../general/DatePickerCustome";
import RecentReports from "../RecentReports";
import GenerateReport from "../GenerateReport";
import SegmentedComponent from "../general/SegmentedCustome"
import { useTranslations } from "next-intl";

export default function Reports() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [page, setPage] = useState(1);
  const t = useTranslations("Reports");


  const handleSegmentChange = (value) => {
    if (value === t("tab-generete-report")) {
      setPage(1);
    } else if (value === t("tab-recent-reports")) {
      setPage(2);
    }
  };
  const getPage = () => {
    switch (page) {
      case 1:
        return <GenerateReport selectedDates={selectedDates} />;
      case 2:
        return <RecentReports />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <div className="mb-4" > 
        <div  className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:gap-8">
          <SegmentedComponent options={[t("tab-generete-report"), t("tab-recent-reports")]} handleSegmentChange={handleSegmentChange}/>
          <DatePickerCustome setSelectedDates={setSelectedDates} />
        </div>
        <hr ></hr>
      </div>

      {getPage()}
    </>
  );
}