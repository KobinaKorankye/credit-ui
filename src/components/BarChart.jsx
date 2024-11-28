import React from "react";
import Chart from "react-apexcharts";
import { themePalette } from "../../themePalette";
import { useLocation } from "react-router-dom";
import { getApplicantInfoField } from "../helpers";
import { COLUMN_LABELS, mappings } from "../constants";
import { capitalize } from "@mui/material";

function sortObjectByValues(obj) {
  const entries = Object.entries(obj);
  entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  return Object.fromEntries(entries);
}

function splitStringWithBracketsPreserved(str, maxLength) {
  const chunks = [];
  const regex = /\[.*?\]/g;
  let bracketedMatches = [];
  let remaining = str;

  let match;
  while ((match = regex.exec(str)) !== null) {
    bracketedMatches.push(match[0]);
    remaining = remaining.replace(match[0], `<<${bracketedMatches.length - 1}>>`);
  }

  const words = remaining.split(" ");
  let currentChunk = "";

  for (const word of words) {
    if (word.startsWith("<<") && word.endsWith(">>")) {
      const index = parseInt(word.slice(2, -2), 10);
      const bracketedContent = bracketedMatches[index];
      if (currentChunk.length + bracketedContent.length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      currentChunk += bracketedContent + " ";
    } else {
      if ((currentChunk + word).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = word + " ";
      } else {
        currentChunk += word + " ";
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const BarChart = ({ data, bias, global, height = 250 }) => {
  const { modelBody } = useLocation().state;

  // Add bias to modifiedData only if not global
  const modifiedData = !global
    ? { ...data, Bias: bias }
    : sortObjectByValues(data);

  let finalCategories = [];
  let finalSeries = [];

  if (!global) {
    // Group categories by base key
    const groupedData = {};
    for (const [category, seriesValue] of Object.entries(modifiedData)) {
      const baseKey = category.split(" [")[0];
      if (!groupedData[baseKey]) groupedData[baseKey] = [];
      groupedData[baseKey].push({ category, seriesValue });
    }

    for (const [baseKey, entries] of Object.entries(groupedData)) {
      let totalValue = 0;
      let retainedEntry = null;

      // Special handling for personal_status_and_sex
      if (baseKey === "personal_status_and_sex") {
        const maritalStatus = modelBody.marital_status || "";
        const sex = modelBody.sex || "";
        const target = `[${sex} : ${maritalStatus}]`;

        for (const { category, seriesValue } of entries) {
          totalValue += seriesValue;
          if (category.includes(target)) {
            retainedEntry = capitalize(category);
          }
        }

        // Retain the first entry if no match is found
        if (!retainedEntry) retainedEntry = capitalize(entries[0].category);

      } else {
        // Standard grouping and summing logic
        for (const { category, seriesValue } of entries) {
          totalValue += seriesValue;

          if (baseKey in modelBody) {
            const modelValue = modelBody[baseKey];
            const mappedValue = mappings[modelValue] || modelValue;
            if (category.includes(mappedValue)) {
              retainedEntry = category;
            }
          }
        }

        if (!retainedEntry) retainedEntry = entries[0].category;

        // Fix bracketed value for retained entry
        if (baseKey in modelBody) {
          const modelValue = modelBody[baseKey];
          const mappedValue = mappings[modelValue] || modelValue;
          retainedEntry = `${capitalize((COLUMN_LABELS[baseKey] || baseKey).replace("_", " "))} [${mappedValue}]`;
        }
      }

      finalCategories.push(retainedEntry);
      finalSeries.push(totalValue);
    }
  } else {
    // When global is true, keep the unmodified categories and series
    finalCategories = Object.keys(modifiedData);
    finalSeries = Object.values(modifiedData);
    console.log("finalCategories", finalCategories)
  }

  // Prepare chartData
  const chartData = {
    categories: finalCategories.map((key) =>
      splitStringWithBracketsPreserved(key.replaceAll("_", " "), 24)
    ),
    series: [
      {
        data: global
          ? finalSeries.map((val) => Math.abs(val))
          : finalSeries,
      },
    ],
  };

  const options = {
    chart: {
      type: "bar",
      height: height,
      foreColor: "#000",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: [
            { from: -Infinity, to: 0, color: themePalette.secondary },
            { from: 0, to: Infinity, color: global ? "#008FFB" : themePalette.primary },
          ],
        },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "10px", width: 500 },
      },
    },
    grid: {
      yaxis: {
        lines: { show: false },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        color: "#f4f4f4",
      },
    },
  };

  return (
    <div>
      {!global && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: themePalette.secondary,
                marginRight: "5px",
              }}
            ></div>
            <span className="text-sm" style={{ color: "#000" }}>
              Defaulting
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: themePalette.primary,
                marginRight: "5px",
              }}
            ></div>
            <span className="text-sm" style={{ color: "#000" }}>
              Not Defaulting
            </span>
          </div>
        </div>
      )}
      <Chart options={options} series={chartData.series} type="bar" height={height} />
    </div>
  );
};

export default BarChart;


// import React from "react";
// import Chart from "react-apexcharts";
// import { themePalette } from "../../themePalette";

// function sortObjectByValues(obj) {
//   // Convert the object to an array of key-value pairs
//   const entries = Object.entries(obj);

//   // Sort the array based on the values
//   entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

//   // Convert the sorted array back into an object
//   const sortedObj = Object.fromEntries(entries);

//   return sortedObj;
// }

// const BarChart = ({ data, bias, global, height=250 }) => {
//   // Add bias as an additional feature
//   const modifiedData = !global?{
//     ...data,
//     Bias: bias,
//   }: sortObjectByValues(data);

//   const chartData = {
//     categories: Object.keys(modifiedData),
//     series: [
//       {
//         data: global? Object.values(modifiedData).map((val)=>Math.abs(val)): Object.values(modifiedData),
//       },
//     ],
//   };

//   const options = {
//     chart: {
//       type: "bar",
//       height: 600,
//       foreColor: "#000", // Default color for all text in the chart
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         colors: {
//           ranges: [
//             {
//               from: -Infinity,
//               to: 0,
//               color: themePalette.secondary,
//             },
//             {
//               from: 0,
//               to: Infinity,
//               color: global? "#008FFB" :themePalette.primary, 
//             },
//           ],
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       categories: chartData.categories,
//       labels: {
//         style: {
//           // colors: ['#333'], // Color for x-axis labels
//           fontSize: "12px",
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           // colors: ['#333'], // Color for y-axis labels
//           fontSize: "10px",
//           width: 500,
//         },
//       },
//     },
//     grid: {
//       yaxis: {
//         lines: {
//           show: false, // Hide the horizontal grid lines
//         },
//       },
//     },
//     tooltip: {
//       style: {
//         fontSize: "12px",
//         color: "#f4f4f4", // Color for tooltip text
//       },
//     },
//   };

//   return (
//     <div>
//       {
//         !global &&
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//           <div style={{ width: '10px', height: '10px', backgroundColor: themePalette.secondary, marginRight: '5px' }}></div>
//           <span className="text-sm" style={{ color: '#000' }}>Defaulting</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
//           <div style={{ width: '10px', height: '10px', backgroundColor: themePalette.primary, marginRight: '5px' }}></div>
//           <span className="text-sm" style={{ color: '#000' }}>Not Defaulting</span>
//         </div>
//       </div>
//       }
//       <Chart
//         options={options}
//         series={chartData.series}
//         type="bar"
//         height={height}
//       />
//     </div>
//   );
// };

// export default BarChart;
