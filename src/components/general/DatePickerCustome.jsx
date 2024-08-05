import React from "react";
import { DatePicker, Space } from "antd";
import { useTranslations } from "next-intl";

const { RangePicker } = DatePicker;

const DatePickerCustome = ({ setSelectedDates }) => {
  const t = useTranslations("DatePicker");
  const onChange = (date, dateString) => {
    setSelectedDates(dateString);
  };

  return (
    <Space direction="vertical" size={12} className="ml-2 mr-2">
      <RangePicker onChange={onChange} placeholder={[t("date-picker-start"), t("date-picker-end")]}/>
    </Space>
  );
};

export default DatePickerCustome;
