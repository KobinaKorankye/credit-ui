import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import * as ss from "simple-statistics";

export default function KDEChart({
  columnArray,
  classArray,
  highlightPoint,
  height,
  hideToolbar,
  title,
  showGrid,
  yLabel,
}) {
  const [defaultingData, setDefaultingData] = useState({});
  const [notDefaultingData, setNotDefaultingData] = useState({});

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
      
      let defaultingData = [];
      let notDefaultingData = [];
      for (let key in defaulting) {
        defaultingData.push([parseInt(key), defaulting[key]]);
      }
      defaultingData = defaultingData.sort((a, b) => a[0] - b[0]);

      for (let key in notDefaulting) {
        notDefaultingData.push([parseInt(key), notDefaulting[key]]);
      }
      notDefaultingData = notDefaultingData.sort((a, b) => a[0] - b[0]);

      const dvalues = defaultingData.map((d) => Array(d[1]).fill(d[0])).flat();

      // Compute the KDE
      let kde = ss.kernelDensityEstimation(dvalues);

      // Generate x values for the KDE
      const dxValues = Array.from(new Set(dvalues)).sort((a, b) => a - b);

      // Compute the KDE y values
      const dkdeYValues = dxValues.map((x) => kde(x));

      setDefaultingData({
        name: "Defaulting",
        data: dxValues.map((x, index) => [x, dkdeYValues[index]]),
        color: "#FF4560", // Specific color for Defaulting
      });

      const nvalues = notDefaultingData
        .map((d) => Array(d[1]).fill(d[0]))
        .flat();

      // Compute the KDE
      kde = ss.kernelDensityEstimation(nvalues);

      // Generate x values for the KDE
      const ndxValues = Array.from(new Set(nvalues)).sort((a, b) => a - b);

      // Compute the KDE y values
      const nkdeYValues = ndxValues.map((x) => kde(x));

      setNotDefaultingData({
        name: "Not Defaulting",
        data: ndxValues.map((x, index) => [x, nkdeYValues[index]]),
        color: "#008FFB", // Specific color for Not Defaulting
      });
    }

    
  }, [columnArray, classArray]);

  const options = {
    chart: {
      type: "area", // Change to 'area'
      height: height,
      toolbar: {
        show: !hideToolbar, // Hide the toolbar
      },
    },
    title: {
      text: title, // Set the title for the chart
      align: "left", // Align the title (options: 'left', 'center', 'right')
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    grid: {
      show: showGrid, // Toggle grid lines based on prop
    },
    xaxis: {
      type: "numeric",
    },
    yaxis: {
      labels: {
        show: false, // Hides the y-axis labels
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false // Disable data labels to reduce clutter
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
            text: "Applicant: " + highlightPoint,
          },
        },
      ],
    },
    legend: {
      position: "bottom", // Position the legend at the top
      horizontalAlign: "center", // Align the legend to the right
    },
  };

  return (
    <div id="chart">
      <Chart
        options={options}
        series={[notDefaultingData, defaultingData]}
        type="area"
        height={height}
      />
    </div>
  );
}
