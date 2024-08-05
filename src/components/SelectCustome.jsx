import React from "react";
import { Select } from "antd";
import { reportsData1 } from "../data/data";
import { useTranslations } from "next-intl";

export default function SelectCustome({
  setSelectReport,
  selectedValue,
  setSelectedValue,
}) {
  const t = useTranslations("SelectReport");

  const onChange = (value) => {
    setSelectReport(reportsData1[value - 1]);
    setSelectedValue(value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      className="custom-select mb-2"
      showSearch
      placeholder={t("select-placeholder")}
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      value={selectedValue}
      options={reportsData1}
    />
  );
}
