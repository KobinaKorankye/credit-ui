import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { LuInfo } from "react-icons/lu";

import { getThemeColors, getCSSCustomProperties } from "../utils/colorUtils";

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

  const cssProps = getCSSCustomProperties();
  const themeColors = getThemeColors();

  const options = {
    chart: {
      type: "bar",
      height: height,
      stacked: false,
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
        columnWidth: '75%',
        grouped: true,
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
          fontSize: "10px",
          fontWeight: 500,
          colors: `${cssProps.mutedForeground}`,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        rotate: -45,
        rotateAlways: true,
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
        text: "Frequency",
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
      xaxis: highlightPoint !== undefined && highlightPoint !== null
        ? [
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
              text: `Applicant: ${highlightPoint}${highlightBin ? ` (Bin: ${highlightBin})` : ''}`,
            },
          },
        ]
        : [],
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
        const binRange = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];

        return `
          <div class="px-3 py-2 bg-popover border border-border rounded-lg shadow-lg">
            <div class="font-medium text-popover-foreground text-sm">${seriesName}</div>
            <div class="text-xs text-muted-foreground mt-1">
              Range: <span class="font-semibold text-foreground">${binRange}</span><br/>
              Count: <span class="font-semibold text-foreground">${value.toLocaleString()}</span>
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
            data-tooltip-id='histogram-desc'
          >
            <LuInfo className="h-4 w-4 text-muted-foreground" />
          </div>
          <Tooltip
            id="histogram-desc"
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
              <div className="font-semibold">Histogram Distribution</div>
              <div className="text-xs">
                This chart shows the frequency distribution of <span className="font-medium text-primary">{title.toLowerCase()}</span> values
                across different ranges for historical loan customers, comparing defaulting vs non-defaulting patterns.
              </div>
              <div className="text-xs text-muted-foreground">
                The highlighted bin shows where the current applicant falls within this distribution.
              </div>
            </div>
          </Tooltip>
        </>
      )}
      <div className="rounded-lg overflow-hidden">
        <Chart
          options={options}
          series={[
            { name: "Defaulting", data: defaultingData },
            { name: "Not Defaulting", data: notDefaultingData },
          ]}
          type="bar"
          height={height}
        />
      </div>
    </div>
  );
}
