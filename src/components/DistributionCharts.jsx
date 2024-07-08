import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import chartData from '../data/data.json'

const classNames = ['Defaulting', 'Not Defaulting']

const DistributionCharts = ({ highlightPoints }) => {


  const createNumericalSeries = (numericalData) => {
    const series = [];
    numericalData.forEach(data => {
      // data.hist_data.forEach(hist => {
      //   series.push({
      //     name: `Histogram ${hist.class}`,
      //     type: 'column',
      //     data: hist.hist
      //   });
      // });
      data.kde_data.forEach(kde => {
        series.push({
          name: `KDE ${kde.class}`,
          type: 'line',
          data: kde.y
        });
      });
    });
    return series;
  };

  return (
    <div>
      {chartData.numerical.map((numData, index) => {
        // const highlightPoint = highlightPoints[numData.column];
        const options = {
          chart: {
            type: 'line',
            height: 350,
            toolbar: {
              show: false
            }
          },
          title: {
            text: numData.column,
            align: 'center'
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            type: 'category',
            categories: numData.hist_data[0].bin_centers
          },
          yaxis: {
            title: {
              text: 'Count'
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            shared: true,
            intersect: false
          },
          legend: {
            position: 'top',
            horizontalAlign: 'center',
          },
          // annotations: highlightPoint ? {
          //   points: [{
          //     x: highlightPoint.x,
          //     y: highlightPoint.y,
          //     marker: {
          //       size: 8,
          //       fillColor: '#FF4560',
          //       strokeColor: '#000',
          //       radius: 2
          //     },
          //     label: {
          //       borderColor: '#FF4560',
          //       offsetY: 0,
          //       style: {
          //         color: '#fff',
          //         background: '#FF4560'
          //       },
          //       text: 'Highlighted Point'
          //     }
          //   }]
          // } : {}
        };

        return (
          <div key={index}>
            <Chart
              options={options}
              series={createNumericalSeries([numData])}
              type="line"
              height={350}
            />
          </div>
        );
      })}
      {/* Similarly, create and render charts for categorical data */}
    </div>
  );
};

export default DistributionCharts;
