import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import * as ss from "simple-statistics";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "react-tooltip";

import { getThemeColors, getCSSCustomProperties } from "../utils/colorUtils";

export default function KDEChart({
  columnArray,
  classArray,
  highlightPoint,
  height,
  hideToolbar,
  title,
  showGrid,
  showInfo,
  columnName,
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

      const themeColors = getThemeColors();

      setDefaultingData({
        name: "Defaulting",
        data: dxValues.map((x, index) => [x, dkdeYValues[index]]),
        color: themeColors.secondary,
        type: 'area'
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
        color: themeColors.primary,
        type: 'area'
      });
    }


  }, [columnArray, classArray]);

  const cssProps = getCSSCustomProperties();

  const options = {
    chart: {
      type: "area",
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
      },
      zoom: {
        enabled: false
      }
    },
    colors: [notDefaultingData.color, defaultingData.color],
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'round'
    },
    grid: {
      show: true,
      borderColor: `${cssProps.border}`,
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: true
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
    xaxis: {
      type: "numeric",
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
        formatter: function (val) {
          return typeof val === 'number' ? val.toLocaleString() : val;
        }
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
        text: "Probability Density",
        style: {
          fontSize: "12px",
          fontWeight: 600,
          color: `${cssProps.foreground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
      },
      labels: {
        show: false
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: []
      }
    },
    dataLabels: {
      enabled: false
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
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      theme: 'dark',
      style: {
        fontSize: "12px",
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const xValue = w.globals.seriesX[seriesIndex][dataPointIndex];
        const yValue = series[seriesIndex][dataPointIndex];

        return `
          <div class="px-3 py-2 bg-popover border border-border rounded-lg shadow-lg">
            <div class="font-medium text-popover-foreground text-sm">${seriesName}</div>
            <div class="text-xs text-muted-foreground mt-1">
              ${title}: <span class="font-semibold text-foreground">${xValue.toLocaleString()}</span><br/>
              Density: <span class="font-semibold text-foreground">${yValue.toFixed(4)}</span>
            </div>
          </div>
        `;
      }
    }
  };

  return (
    <div className="relative w-full" id="chart">
      {showInfo && (
        <>
          <div
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors cursor-pointer"
            data-tooltip-id='kde-desc'
          >
            <LuInfo className="h-4 w-4 text-muted-foreground" />
          </div>
          <Tooltip
            id="kde-desc"
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
              <div className="font-semibold">Probability Density Plot</div>
              <div className="text-xs">
                This chart shows the distribution of <span className="font-medium text-primary">{title.toLowerCase()}</span> values
                for historical loan customers, comparing defaulting vs non-defaulting patterns.
              </div>
              <div className="text-xs text-muted-foreground">
                The vertical line shows where the current applicant falls within this distribution.
              </div>
            </div>
          </Tooltip>
        </>
      )}
      <div className="rounded-lg overflow-hidden">
        <Chart
          options={options}
          series={[notDefaultingData, defaultingData]}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
}
