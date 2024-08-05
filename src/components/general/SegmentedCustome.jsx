import React, { useEffect } from "react";
import { Tabs } from "antd";

export default function SegmentedComponent({ options, handleSegmentChange }) {
  const onChange = (key) => {
    handleSegmentChange(options[key - 1]);
  };

  useEffect(() => {
    const tabsElement = document.querySelector('.custom-tabs');
    if (tabsElement) {
      tabsElement.classList.remove('ant-tabs-top');
    }
  }, []);


  return (
    <>
      <Tabs
       className="custom-tabs" 
        onChange={onChange}
        type="card"
        items={options.map((op, i) => {
          const id = String(i + 1);
          return {
            label: `${op}`,
            key: id,
          };
        })}
      />
    </>
  );
}
