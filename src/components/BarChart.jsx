import React from "react";
import Chart from "react-apexcharts";

function sortObjectByValues(obj) {
  // Convert the object to an array of key-value pairs
  const entries = Object.entries(obj);

  // Sort the array based on the values
  entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  // Convert the sorted array back into an object
  const sortedObj = Object.fromEntries(entries);

  return sortedObj;
}

const BarChart = ({ data, bias, global }) => {
  // Add bias as an additional feature
  const modifiedData = !global?{
    ...data,
    Bias: bias,
  }: sortObjectByValues(data);

  const chartData = {
    categories: Object.keys(modifiedData),
    series: [
      {
        data: global? Object.values(modifiedData).map((val)=>Math.abs(val)): Object.values(modifiedData),
      },
    ],
  };

  const options = {
    chart: {
      type: "bar",
      height: 600,
      foreColor: "#000", // Default color for all text in the chart
    },
    plotOptions: {
      bar: {
        horizontal: true,
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#8B0000",
            },
            {
              from: 0,
              to: Infinity,
              color: global? "#000" :"#006400", 
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          // colors: ['#333'], // Color for x-axis labels
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          // colors: ['#333'], // Color for y-axis labels
          fontSize: "10px",
          width: 500,
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false, // Hide the horizontal grid lines
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        color: "#f4f4f4", // Color for tooltip text
      },
    },
  };

  return (
    <div>
      {
        !global &&
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#8B0000', marginRight: '5px' }}></div>
          <span className="text-sm" style={{ color: '#000' }}>Defaulting</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#006400', marginRight: '5px' }}></div>
          <span className="text-sm" style={{ color: '#000' }}>Not Defaulting</span>
        </div>
      </div>
      }
      <Chart
        options={options}
        series={chartData.series}
        type="bar"
        height={600}
      />
    </div>
  );
};

export default BarChart;
