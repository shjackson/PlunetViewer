export const getColumns = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid data input");
  }

  const columns = Object.keys(data[0]);
  return columns;
};

export const transformColumns = (data) => {
  const columns = getColumns(data);

  return columns.map((column) => ({
    title: column.charAt(0).toUpperCase() + column.slice(1),
    dataIndex: column,
    sortDirections: ["ascend", "descend"],
    filterSearch: true,
    sorter: (a, b) => {
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      const aVal =
        typeof a[column] === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(a[column])
          ? parseDate(a[column])
          : typeof a[column] === "string"
          ? parseFloat(a[column])
          : a[column];

      const bVal =
        typeof b[column] === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(b[column])
          ? parseDate(b[column])
          : typeof b[column] === "string"
          ? parseFloat(b[column])
          : b[column];

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return aVal - bVal;
      }
      if (aVal instanceof Date && bVal instanceof Date) {
        return aVal - bVal;
      }
      if (typeof a[column] === "string" && typeof b[column] === "string") {
        return a[column].localeCompare(b[column]);
      }
      return 0;
    },
  }));
};

export const filterDate = (selectedDates, mockData) => {
  if (selectedDates.length > 0  && selectedDates[0] !== '' && selectedDates[1] !== '' ) {
    const newData = mockData.filter((data => new Date(data.date) > new Date(selectedDates[0]) && new Date(data.date) < new Date(selectedDates[1])))
    return newData
  } else {
    return mockData;
  }
};

// export const transformPieData= (data) => {
//   const totalBilling = data.reduce((total, item) => total + parseFloat(item.billing), 0);

//   return data.map(item => {
//     const billing = parseFloat(item.billing);
//     const percent = ((billing / totalBilling) * 100).toFixed(2);

//     return {
//       item: item.businessUnit || "No Business Unit" ,
//       count: billing,
//       percent: parseFloat(percent)
//     }
//   });
// }


// export function alternatePieData(data) {
//   return data.map(item => {
//     return {
//       item: item.item + ` (${parseFloat(item.percent).toFixed(2)}%)`,
//       count: item.count,
//       percent: item.percent
//     }
//   });
// }

export const transformPieData = (data) => {
  const totalBilling = data.reduce((total, item) => total + parseFloat(item.billing), 0);
  data = data.filter(item => item.businessUnit !== null);
  const transformedData = data.map(item => {
    const billing = parseFloat(item.billing);
    const percent = ((billing / totalBilling) * 100).toFixed(2);
    const name = item.businessUnit || "No Business Unit"
    return {
      name: name + ` (${parseFloat(percent).toFixed(2)}%)`,
      value: billing,
      percent: parseFloat(percent)
    }
  });

  return transformedData.sort((a, b) => b.value - a.value);
}
