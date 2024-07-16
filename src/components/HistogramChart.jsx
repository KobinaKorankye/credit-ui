import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HistogramChart({
  columnArray,
  classArray,
  numBins, // Now using numBins as a prop instead of binSize
  columnName, // Add columnName as a prop
  highlightPoint,
  height,
  hideToolbar,
  title,
  showGrid,
  showInfo,
  yLabel,
}) {
  const [defaultingData, setDefaultingData] = useState([]);
  const [notDefaultingData, setNotDefaultingData] = useState([]);
  const [highlightBin, setHighlightBin] = useState("");

  useEffect(() => {
    if (columnArray.length && numBins > 0) {
      const min = Math.min(...columnArray);
      const max = Math.max(...columnArray);
      const binSize = (max - min) / numBins;

      if (binSize <= 0 || !isFinite(binSize)) {
        console.error("Invalid bin size or number of bins");
        return;
      }

      const bins = Array(numBins).fill(0).map((_, index) => ({
        binStart: min + index * binSize,
        binEnd: min + (index + 1) * binSize,
        defaultingCount: 0,
        notDefaultingCount: 0,
      }));

      columnArray.forEach((item, index) => {
        const binIndex = Math.floor((item - min) / binSize);
        if (binIndex >= 0 && binIndex < bins.length) {
          if (classArray[index] === 0) {
            bins[binIndex].defaultingCount++;
          } else {
            bins[binIndex].notDefaultingCount++;
          }
        }
      });

      const defaultingData = bins.map((bin) => ({
        x: `[${bin.binStart.toFixed(2)}, ${bin.binEnd.toFixed(2)})`,
        y: bin.defaultingCount,
      }));

      const notDefaultingData = bins.map((bin) => ({
        x: `[${bin.binStart.toFixed(2)}, ${bin.binEnd.toFixed(2)})`,
        y: bin.notDefaultingCount,
      }));

      setDefaultingData(defaultingData);
      setNotDefaultingData(notDefaultingData);

      // Determine which bin the highlight point falls into
      const highlightBinIndex = Math.floor((highlightPoint - min) / binSize);
      if (highlightBinIndex >= 0 && highlightBinIndex < bins.length) {
        const highlightBinRange = `[${bins[highlightBinIndex].binStart.toFixed(2)}, ${bins[highlightBinIndex].binEnd.toFixed(2)})`;
        setHighlightBin(highlightBinRange);
      } else {
        setHighlightBin("");
      }
    }
  }, [columnArray, classArray, numBins, highlightPoint]);

  const options = {
    chart: {
      type: "bar",
      height: height,
      stacked: false, // Set to false to make the histogram layered
      toolbar: {
        show: !hideToolbar,
      },
    },
    title: {
      text: "Histogram Distribution by "+ title,
      align: "center",
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    grid: {
      show: showGrid,
    },
    xaxis: {
      type: "category",
      title: {
        text: title, // Label for x-axis
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      axisBorder: {
        show: true,
        color: "#000000",
        height: 1,
        width: "100%",
        offsetX: 0,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: "solid",
        color: "#000000",
        height: 6,
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      title: {
        text: "Frequency", // Label for y-axis
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    annotations: {
      xaxis: highlightBin
        ? [
          {
            x: highlightBin,
            borderColor: "#070707",
            label: {
              borderColor: "#070707",
              style: {
                color: "#000",
                background: "#faf",
                fontSize: '18px',
                fontWeight: 'bold'
              },
              text: "Applicant: " + highlightPoint,
            },
          },
        ]
        : [],
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    plotOptions: {
      bar: {
        grouped: true, // Group bars together for layering
      },
    },
  };

  return (
    <div className="relative" id="chart">
      {
        showInfo &&
        <>
        <div className="absolute text-blue-800 -top-5 left-2 cursor-pointer" data-tooltip-id='desc2'>
        <FontAwesomeIcon size="xl" icon={faInfoCircle} />
      </div>
      <Tooltip style={{ width: '400px' }} id="desc2" place="bottom">
        This histogram displays the frequency distribution of <span className="font-bold text-green-500">{title.toLowerCase()}</span> values for past approved loan customers. <br /> It compares defaulting and non-defaulting customers on the same plot.
      </Tooltip>
        </>
      }
      <Chart
        options={options}
        series={[
          { name: "Defaulting", data: defaultingData, color: "#FF4560" },
          { name: "Not Defaulting", data: notDefaultingData, color: "#008FFB" },
        ]}
        type="bar"
        height={height}
      />
    </div>
  );
}
