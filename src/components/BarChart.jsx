import React from "react";
import Chart from "react-apexcharts";
import { useLocation } from "react-router-dom";
import { getApplicantInfoField } from "../helpers";
import { COLUMN_LABELS, mappings } from "../constants";
import { capitalize } from "@mui/material";

import { getThemeColors, getCSSCustomProperties } from "../utils/colorUtils";

function sortObjectByValues(obj) {
  const entries = Object.entries(obj);
  entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  return Object.fromEntries(entries);
}

function splitStringWithBracketsPreserved(str, maxLength) {
  const chunks = [];
  const regex = /\[.*?\]/g;
  let bracketedMatches = [];
  let remaining = str;

  let match;
  while ((match = regex.exec(str)) !== null) {
    bracketedMatches.push(match[0]);
    remaining = remaining.replace(match[0], `<<${bracketedMatches.length - 1}>>`);
  }

  const words = remaining.split(" ");
  let currentChunk = "";

  for (const word of words) {
    if (word.startsWith("<<") && word.endsWith(">>")) {
      const index = parseInt(word.slice(2, -2), 10);
      const bracketedContent = bracketedMatches[index];
      if (currentChunk.length + bracketedContent.length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      currentChunk += bracketedContent + " ";
    } else {
      if ((currentChunk + word).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = word + " ";
      } else {
        currentChunk += word + " ";
      }
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

const BarChart = ({ data, bias, global, height = 250 }) => {
  const { modelBody } = useLocation().state;

  // Add bias to modifiedData only if not global
  const modifiedData = !global
    ? { ...data, Bias: bias }
    : sortObjectByValues(data);

  let finalCategories = [];
  let finalSeries = [];

  if (!global) {
    // Group categories by base key
    const groupedData = {};
    for (const [category, seriesValue] of Object.entries(modifiedData)) {
      const baseKey = category.split(" [")[0];
      if (!groupedData[baseKey]) groupedData[baseKey] = [];
      groupedData[baseKey].push({ category, seriesValue });
    }

    for (const [baseKey, entries] of Object.entries(groupedData)) {
      let totalValue = 0;
      let retainedEntry = null;

      // Special handling for personal_status_and_sex
      if (baseKey === "personal_status_and_sex") {
        const maritalStatus = modelBody.marital_status || "";
        const sex = modelBody.sex || "";
        const target = `[${sex} : ${maritalStatus}]`;

        for (const { category, seriesValue } of entries) {
          totalValue += seriesValue;
          if (category.includes(target)) {
            retainedEntry = capitalize(category);
          }
        }

        // Retain the first entry if no match is found
        if (!retainedEntry) retainedEntry = capitalize(entries[0].category);

      } else {
        // Standard grouping and summing logic
        for (const { category, seriesValue } of entries) {
          totalValue += seriesValue;

          if (baseKey in modelBody) {
            const modelValue = modelBody[baseKey];
            const mappedValue = mappings[modelValue] || modelValue;
            if (category.includes(mappedValue)) {
              retainedEntry = category;
            }
          }
        }

        if (!retainedEntry) retainedEntry = entries[0].category;

        // Fix bracketed value for retained entry
        if (baseKey in modelBody) {
          const modelValue = modelBody[baseKey];
          const mappedValue = mappings[modelValue] || modelValue;
          retainedEntry = `${capitalize((COLUMN_LABELS[baseKey] || baseKey).replace("_", " "))} [${mappedValue}]`;
        }
      }

      finalCategories.push(retainedEntry);
      finalSeries.push(totalValue);
    }
  } else {
    // When global is true, keep the unmodified categories and series
    finalCategories = Object.keys(modifiedData);
    finalSeries = Object.values(modifiedData);
  }

  // Prepare chartData
  const chartData = {
    categories: finalCategories.map((key) =>
      splitStringWithBracketsPreserved(key.replaceAll("_", " "), 24)
    ),
    series: [
      {
        data: global
          ? finalSeries.map((val) => Math.abs(val))
          : finalSeries,
      },
    ],
  };

  const themeColors = getThemeColors();
  const cssProps = getCSSCustomProperties();

  const options = {
    chart: {
      type: "bar",
      height: height,
      foreColor: `hsl(${cssProps.foreground})`,
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
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: themeColors.secondary
            },
            {
              from: 0,
              to: Infinity,
              color: themeColors.primary
            },
          ],
          backgroundBarColors: [`hsl(${cssProps.background})`],
          backgroundBarOpacity: 0.1,
        },
        dataLabels: {
          position: 'center',
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 500,
          colors: `hsl(${cssProps.mutedForeground})`
        },
        formatter: function (val) {
          return typeof val === 'number' ? val.toFixed(2) : val;
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
      labels: {
        style: {
          fontSize: "10px",
          fontWeight: 500,
          colors: `hsl(${cssProps.mutedForeground})`
        },
        maxWidth: 200,
      },
    },
    grid: {
      show: true,
      borderColor: `hsl(${cssProps.border})`,
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: "12px",
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const category = w.globals.labels[dataPointIndex];
        return `
          <div class="px-3 py-2 bg-popover border border-border rounded-lg shadow-lg">
            <div class="font-medium text-popover-foreground text-sm">${category}</div>
            <div class="text-xs text-muted-foreground mt-1">
              Impact: <span class="font-semibold text-foreground">${value.toFixed(4)}</span>
            </div>
          </div>
        `;
      }
    },
    legend: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.1
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken',
          value: 0.1
        }
      }
    }
  };

  return (
    <div className="w-full">
      {!global && (
        <div className="flex justify-center items-center gap-6 mb-6 p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm shadow-sm"
              style={{ backgroundColor: themeColors.secondary }}
            ></div>
            <span className="text-sm font-medium text-foreground">
              Increases Default Risk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm shadow-sm"
              style={{ backgroundColor: themeColors.primary }}
            ></div>
            <span className="text-sm font-medium text-foreground">
              Decreases Default Risk
            </span>
          </div>
        </div>
      )}
      <div className="relative">
        <Chart
          options={options}
          series={chartData.series}
          type="bar"
          height={height}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default BarChart;
