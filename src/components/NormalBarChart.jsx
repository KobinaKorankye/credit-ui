import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";

export default function NormalBarChart({
  columnArray,
  classArray,
  columnTitle,
  yLabel,
  highlightPoint
}) {
  const [defaultingData, setDefaultingData] = useState([]);
  const [notDefaultingData, setNotDefaultingData] = useState([]);

  useEffect(() => {
    if (columnArray.length) {
      const defaulting = {};
      const notDefaulting = {};
      columnArray.forEach((item, index) => {
        if (classArray[index] === 0) {
          if (item in defaulting) {
            defaulting[item]++;
          } else {
            defaulting[item] = 1;
          }
        } else {
          if (item in notDefaulting) {
            notDefaulting[item]++;
          } else {
            notDefaulting[item] = 1;
          }
        }
      });

      const defaultingDataArray = [];
      const notDefaultingDataArray = [];

      for (let key in defaulting) {
        defaultingDataArray.push({
          x: key, // No need to parse as integer since it's a string
          y: defaulting[key],
        });
      }

      for (let key in notDefaulting) {
        notDefaultingDataArray.push({
          x: key, // No need to parse as integer since it's a string
          y: notDefaulting[key],
        });
      }

      setDefaultingData(defaultingDataArray);
      setNotDefaultingData(notDefaultingDataArray);
    }
  }, [columnArray, classArray]);

  const options = {
    chart: {
      type: "bar",
      height: 500,
    },
    xaxis: {
      type: "category",
      title: {
        text: columnTitle,
      },
    },
    yaxis: {
      title: {
        text: yLabel,
      },
      labels: {
        show: true, // Show y-axis labels
      },
    },
    plotOptions: {
      bar: {
        // Removed distributed option
        horizontal: false,
      },
    },
    annotations: {
      xaxis: [
        {
          x: highlightPoint,
          borderColor: "#070707",
          label: {
            borderColor: "#070707",
            style: {
              color: "#fff",
              background: "#000",
            },
            text: "Applicant: "+highlightPoint,
          },
        },
      ],
    },
  };

  const series = [
    {
      name: "Defaulting",
      data: defaultingData,
      color: "#FF4560", // Specific color for Defaulting
    },
    {
      name: "Not Defaulting",
      data: notDefaultingData,
      color: "#008FFB", // Specific color for Not Defaulting
    },
  ];

  return (
    <div id="chart">
      <Chart options={options} series={series} type="bar" height={500} />
    </div>
  );
}
