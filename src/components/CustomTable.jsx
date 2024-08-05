import { Table } from "ant-table-extensions";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CustomTable({ dataSource, columns, setPageSize }) {
  const [pageSize, setPageSizeState] = useState(10); 
  const t = useTranslations("CustomeTable");

  return (
    <div className="flex flex-col" >
      <Table
        scroll={{ x: "100vh" }}
        columns={columns}
        dataSource={dataSource}
        bordered
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        pagination={{
          pageSize: pageSize, 
          showSizeChanger: true, 
          pageSizeOptions: ['10', '20', '50', '100'],
          onShowSizeChange: (current, size) => {
            setPageSizeState(size);
            setPageSize(size);
          },
          locale: {
            items_per_page: `/ ${t("table-page")}`, 
          }, 
        }}
        className="custom-table" 
      />
    </div>
  );
}

