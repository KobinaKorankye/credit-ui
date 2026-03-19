import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "react-tooltip";

import { getThemeColors, getCSSCustomProperties } from "../utils/colorUtils";

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

  const cssProps = getCSSCustomProperties();
  const themeColors = getThemeColors();

  const options = {
    chart: {
      type: "bar",
      height: height,
      background: 'transparent',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    colors: [themeColors.secondary, themeColors.primary],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      type: "category",
      title: {
        text: title,
        style: {
          fontSize: "12px",
          fontWeight: 600,
          color: `${cssProps.foreground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
      },
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 500,
          colors: `${cssProps.mutedForeground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        rotate: -45,
        rotateAlways: false,
        maxHeight: 120
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: "Count",
        style: {
          fontSize: "12px",
          fontWeight: 600,
          color: `${cssProps.foreground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
      },
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 500,
          colors: `${cssProps.mutedForeground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        formatter: function(val) {
          return Math.floor(val).toLocaleString();
        }
      },
    },
    grid: {
      show: true,
      borderColor: `${cssProps.border}`,
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      floating: false,
      fontSize: '12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 500,
      labels: {
        colors: `${cssProps.foreground}`
      },
      markers: {
        width: 12,
        height: 12,
        radius: 3
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8
      }
    },
    annotations: {
      xaxis: highlightPoint !== undefined && highlightPoint !== null ? [
        {
          x: highlightPoint,
          borderColor: `${cssProps.foreground}`,
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: `${cssProps.foreground}`,
            borderWidth: 1,
            borderRadius: 6,
            style: {
              color: `${cssProps.background}`,
              background: `${cssProps.foreground}`,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4
              }
            },
            text: `Applicant: ${highlightPoint}`,
          },
        },
      ] : [],
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      theme: 'dark',
      style: {
        fontSize: "12px",
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const category = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];

        return `
          <div class="px-3 py-2 bg-popover border border-border rounded-lg shadow-lg">
            <div class="font-medium text-popover-foreground text-sm">${seriesName}</div>
            <div class="text-xs text-muted-foreground mt-1">
              ${title}: <span class="font-semibold text-foreground">${category}</span><br/>
              Count: <span class="font-semibold text-foreground">${value.toLocaleString()}</span>
            </div>
          </div>
        `;
      }
    }
  };

  const series = [
    {
      name: "Defaulting",
      data: defaultingData,
    },
    {
      name: "Not Defaulting",
      data: notDefaultingData,
    },
  ];

  return (
    <div className="relative w-full" id="chart">
      {showInfo && (
        <>
          <div
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors cursor-pointer"
            data-tooltip-id='bar-desc'
          >
            <LuInfo className="h-4 w-4 text-muted-foreground" />
          </div>
          <Tooltip
            id="bar-desc"
            place="left"
            className="max-w-sm"
            style={{
              backgroundColor: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            <div className="space-y-2">
              <div className="font-semibold">Category Distribution</div>
              <div className="text-xs">
                This chart shows the frequency distribution of <span className="font-medium text-primary">{title.toLowerCase()}</span> categories
                for historical loan customers, comparing defaulting vs non-defaulting patterns.
              </div>
              <div className="text-xs text-muted-foreground">
                The vertical line shows the current applicant's category.
              </div>
            </div>
          </Tooltip>
        </>
      )}
      <div className="rounded-lg overflow-hidden">
        <Chart options={options} series={series} type="bar" height={height} />
      </div>
    </div>
  );
}
