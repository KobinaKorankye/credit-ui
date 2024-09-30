import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { themePalette } from "../../themePalette";

export default function PieChart({
  columnArray,
  classArray,
  title,
  height,
  hideToolbar,
  showLegend,
}) {
  const [seriesData, setSeriesData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);

  useEffect(() => {
    if (classArray.length) {
      const data = {};
      classArray.forEach((item, index) => {
        const key = classArray[index] === 0 ? 'Defaulting' : 'Not Defaulting';
        if (key in data) {
          data[key]++;
        } else {
          data[key] = 1;
        }
      });

      const series = Object.values(data);
      const labels = Object.keys(data);

      setSeriesData(series);
      setLabelsData(labels);
    }
  }, [classArray]);

  const options = {
    chart: {
      type: 'pie',
      height: height,
      toolbar: {
        show: !hideToolbar, // Show/hide the toolbar
      },
    },
    title: {
      text: title, // Set the title for the chart
      align: 'left', // Align the title (options: 'left', 'center', 'right')
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#263238',
      },
    },
    labels: labelsData,
    colors: [themePalette.primary, themePalette.secondary],
    legend: {
      position: 'bottom', // Position the legend at the top
      horizontalAlign: 'center', // Align the legend to the right
      show: showLegend, // Show/hide the legend
    },
  };

  return (
    <div id="chart">
      <Chart options={options} series={seriesData} type="donut" height={height} />
    </div>
  );
}
