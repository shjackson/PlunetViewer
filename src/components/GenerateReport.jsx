import React, { useState } from "react";
import { Flex, Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import CustomTable from "../components/CustomTable";
import SelectCustome from "../components/SelectCustome";
import BtnModal from "./general/BtnModal";
import MessageCustome from "./general/MessageCustome";

import { useTranslations } from "next-intl";

import * as XLSX from "xlsx";
import { transformColumns, filterDate } from "../helpers/helpers";
import { mockData } from "../data/data"; // TEST

export default function GenerateReport({ selectedDates }) {
  const [selectReport, setSelectReport] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [infoMessage, setInfoMessage] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  const t = useTranslations("GenerateRport");

  const btnGetReport = async () => {
    if (Object.keys(selectReport).length) {
      setLoading(true);
      
      try {
        const res = await fetch(
          `/api/report?reportType=margins&startDate=${selectedDates[0]}&endDate=${selectedDates[1]}`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const jsonData = await res.json();
        setDataSource(jsonData);
        setLoading(false);
        const cols = transformColumns(jsonData);
        setColumns(cols);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
      
      /*
      fetch(
        `/api/report?reportType=margins&startDate=${selectedDates[0]}&endDate=${selectedDates[1]}`
      ).then(async (res) => {
        const jsonData = await res.json();
        setDataSource(jsonData);
        setLoading(false);
        const cols = transformColumns(jsonData);
         setColumns(cols);
      });
      */

      /*
      setDataSource(mockData); // TEST
      setLoading(false); // TEST
      const cols = transformColumns(mockData); // TEST
      setColumns(cols); // TEST
      */
    } else {
      setInfoMessage({ action: "error", messageContent: t("popup-content") });
    }
  };

  const btnCancel = () => {
    setDataSource([]);
    setColumns([]);
    setSelectReport({});
    setSelectedValue(null);
  };

  const handleDownloadReport = () => {
    if (dataSource.length !== 0) {
      downloadReport();
    }
  };

  const downloadReport = () => {
    setLoading(true);
    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(dataSource);
    XLSX.utils.book_append_sheet(book, sheet, "Report");
    setTimeout(() => {
      XLSX.writeFile(
        book,
        `${selectReport.label}${
          selectedDates && selectedDates[0] ? " " + selectedDates[0] + " " : ""
        }${selectedDates && selectedDates[1] ? selectedDates[1] : ""}.xlsx`
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <Flex vertical className="max-h-full">
      <Flex
        align="center"
        gap="3rem"
        style={{ marginBottom: "10px", padding: "0px 20px" }}
        justify="space-between"
      >
        <Flex vertical align="items" className="w-full md:w-1/2 lg:w-1/3">
          <SelectCustome
            setSelectReport={setSelectReport}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </Flex>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        className="btn-section"
      >
        <Flex gap={10}>
          <Button onClick={btnGetReport} className="custom-button-active">
            {t("btn-get-report")}
          </Button>
          <Button onClick={btnCancel} className="custom-button-inactive">
            {t("btn-cancel-report")}
          </Button>
        </Flex>
        <BtnModal
          validation={dataSource.length !== 0 ? true : false}
          btnAction={handleDownloadReport}
          icon={<DownloadOutlined />}
        />
      </Flex>
      <CustomTable
        dataSource={dataSource}
        columns={columns}
        setPageSize={setPageSize}
      />
      <MessageCustome infoMessage={infoMessage} />
      <Spin spinning={loading} fullscreen />
    </Flex>
  );
}
