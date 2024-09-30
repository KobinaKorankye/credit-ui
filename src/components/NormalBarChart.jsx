import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { themePalette } from "../../themePalette";

export default function NormalBarChart({
  columnArray,
  classArray,
  height=250,
  title,
  yLabel,
  highlightPoint,
  showInfo
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
        text: title,
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
              color: "#000",
              background: "#faf",
              fontSize: "18px",
              fontWeight: "bold",
            },
            text: "Applicant: " + highlightPoint,
          },
        },
      ],
    },
  };

  const series = [
    {
      name: "Defaulting",
      data: defaultingData,
      color: themePalette.secondary, // Specific color for Defaulting
    },
    {
      name: "Not Defaulting",
      data: notDefaultingData,
      color: themePalette.primary, // Specific color for Not Defaulting
    },
  ];

  return (
    <div className="relative" id="chart">
      {showInfo && (
        <>
          <div
            className="absolute text-blue-800 -top-5 left-2 cursor-pointer"
            data-tooltip-id="desc3"
          >
            <FontAwesomeIcon size="xl" icon={faInfoCircle} />
          </div>
          <Tooltip style={{ width: "400px" }} id="desc3" place="bottom">
            This histogram displays the frequency distribution of{" "}
            <span className="font-bold text-green-500">
              {title.toLowerCase()}
            </span>{" "}
            values for past approved loan customers. <br /> It compares
            defaulting and non-defaulting customers on the same plot.
          </Tooltip>
        </>
      )}
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
}
