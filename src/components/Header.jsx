import { Flex, Typography } from "antd";
import React from "react";
import { useTranslations } from "next-intl";

function CustomHeader() {
  const t = useTranslations("Header");

  return (
    <Flex gap={20} justify="end" align="center" className="md:pt-4 md:mr-4">
      <Typography.Link level={3} type="secondary" className="custom-link">
        {t("report")}
      </Typography.Link>
      <Typography.Link level={3} type="secondary" className="custom-link">
        {t("dashboard")}
      </Typography.Link>
      <Typography.Link level={3} type="secondary" className="custom-link">
        {t("KPIs")}
      </Typography.Link>
    </Flex>
  );
}

export default CustomHeader;
