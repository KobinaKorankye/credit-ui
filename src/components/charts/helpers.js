import * as d3 from 'd3'; // Import D3 for density estimation
import { themePalette } from '../../../themePalette';

export function getNPLDonutData(dataArray) {
  // Initialize sums for defaults and non-defaults
  let defaultsSum = 0;
  let nonDefaultsSum = 0;

  dataArray.forEach((item) => {
    const classValue = item.class || item.class_;
    const amount = item.credit_amount;

    // If class is 0, it's a default, otherwise it's a non-default
    if (classValue === 0) {
      defaultsSum += amount;
    } else if (classValue === 1) {
      nonDefaultsSum += amount;
    }
  });

  // Return the transformed result with color and border fields
  return [
    {
      name: `Non-Performing`,
      value: defaultsSum,
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `Performing`,
      value: nonDefaultsSum,
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}

export function getDefaultRateData(dataArray) {
  // Initialize counters for defaults and non-defaults
  let defaultsCount = 0;
  let nonDefaultsCount = 0;

  // Loop through the array and count defaults and non-defaults
  dataArray.forEach((item) => {
    const classValue = item.class || item.class_;

    if (classValue === 0) {
      defaultsCount++;  // Increment defaults count for class 0
    } else if (classValue === 1) {
      nonDefaultsCount++;  // Increment non-defaults count for class 1
    }
  });

  // Return the transformed result with color and border fields
  return [
    {
      name: `No. of Defaults`,
      value: defaultsCount,  // Count of defaults (class 0)
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `No. of Non-defaults`,
      value: nonDefaultsCount,  // Count of non-defaults (class 1)
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}


export function getNPLDonutDataFromObjOfArrays(X) {
  // Initialize sums for defaults and non-defaults
  let defaultsSum = 0;
  let nonDefaultsSum = 0;

  const classArray = X.class || X.class_
  classArray.forEach((classValue, index) => {
    const amount = X.credit_amount[index];

    // If class is 0, it's a default, otherwise it's a non-default
    if (classValue === 0) {
      defaultsSum += amount;
    } else if (classValue === 1) {
      nonDefaultsSum += amount;
    }
  });

  // Return the transformed result with color and border fields
  return [
    {
      name: `Non-Performing`,
      value: defaultsSum,
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `Performing`,
      value: nonDefaultsSum,
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}


export function getDefaultRateDataFromObjOfArrays(X) {
  // Initialize counters for defaults and non-defaults
  let defaultsCount = 0;
  let nonDefaultsCount = 0;

  // Loop through the class array and count defaults and non-defaults
  const classArray = X.class || X.class_
  classArray.forEach((classValue) => {
    if (classValue === 0) {
      defaultsCount++;  // Increment defaults count for class 0
    } else if (classValue === 1) {
      nonDefaultsCount++;  // Increment non-defaults count for class 1
    }
  });

  // Return the transformed result with color and border fields
  return [
    {
      name: `No. of Defaults`,
      value: defaultsCount,  // Count of defaults (class 0)
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `No. of Non-defaults`,
      value: nonDefaultsCount,  // Count of non-defaults (class 1)
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}

// Function to compute the KDE
function kde(kernel, thresholds, data) {
  return thresholds.map(t => ({ x: t, y: d3.mean(data, d => kernel(t - d)) }));
}

// Epanechnikov kernel function (for KDE smoothing)
function epanechnikov(bandwidth) {
  return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}

export function getKDEData(dataArray, columnName) {
  // Extract the column data from each object using the columnName
  const columnData = dataArray.map(item => item[columnName]);

  // Extract the class values (either `class` or `class_`)
  const classArray = dataArray.map(item => item.class || item.class_);

  // Split the column data into defaults (class 0) and non-defaults (class 1)
  const defaultValues = columnData.filter((_, i) => classArray[i] === 0);
  const nonDefaultValues = columnData.filter((_, i) => classArray[i] === 1);

  // Set up KDE parameters
  const bandwidth = 200;  // You can tweak the bandwidth
  const thresholds = d3.range(d3.min(columnData), d3.max(columnData), 50); // KDE thresholds

  // Compute KDE for defaults and non-defaults
  const kdeDefaults = kde(epanechnikov(bandwidth), thresholds, defaultValues);
  const kdeNonDefaults = kde(epanechnikov(bandwidth), thresholds, nonDefaultValues);

  // Return transformed KDE data for defaults and non-defaults, including colors and borders
  return [
    {
      name: `Defaults`,
      data: kdeDefaults,  // KDE data points for defaults
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `Non-defaults`,
      data: kdeNonDefaults,  // KDE data points for non-defaults
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}

export function getKDEDataFromObjOfArrays(X, columnName) {
  // Extract the column values dynamically using the columnName
  const columnData = X[columnName];

  const classArray = X.class || X.class_
  // Split the column data into defaults (class 0) and non-defaults (class 1)
  const defaultValues = columnData.filter((_, i) => classArray[i] === 0);
  const nonDefaultValues = columnData.filter((_, i) => classArray[i] === 1);

  // Set up KDE parameters
  const bandwidth = 200;  // You can tweak the bandwidth
  const thresholds = d3.range(d3.min(columnData), d3.max(columnData), 50); // KDE thresholds

  // Compute KDE for defaults and non-defaults
  const kdeDefaults = kde(epanechnikov(bandwidth), thresholds, defaultValues);
  const kdeNonDefaults = kde(epanechnikov(bandwidth), thresholds, nonDefaultValues);

  // Return transformed KDE data for defaults and non-defaults, including colors and borders
  return [
    {
      name: `Defaults`,
      data: kdeDefaults,  // KDE data points for defaults
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`  // Border class for defaults
    },
    {
      name: `Non-defaults`,
      data: kdeNonDefaults,  // KDE data points for non-defaults
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`  // Border class for non-defaults
    }
  ];
}


export function getColumnRangeHistogramData(data, column, numBins = 10) {
  const columnData = data[column];
  const classData = data.class || data.class_;

  // Find the minimum and maximum values in the column
  const minValue = Math.min(...columnData);
  const maxValue = Math.max(...columnData);

  // Calculate the bin size
  const binSize = (maxValue - minValue) / numBins;

  // Initialize bins for defaults and non-defaults
  const histDefaults = Array(numBins).fill(0);
  const histNonDefaults = Array(numBins).fill(0);

  // Loop through the data and categorize based on the class column
  columnData.forEach((value, index) => {
    const classValue = classData[index]; // Access the class for this row

    // Determine which bin this value falls into
    const binIndex = Math.min(
      Math.floor((value - minValue) / binSize),
      numBins - 1 // Ensure the max value falls into the last bin
    );

    // Increment the appropriate bin counter for the class
    if (classValue === 0) {
      histDefaults[binIndex]++;
    } else if (classValue === 1) {
      histNonDefaults[binIndex]++;
    }
  });

  // Generate the bin range labels for the histogram
  const binLabels = Array.from({ length: numBins }, (_, i) => {
    const binStart = (minValue + i * binSize).toFixed(2);
    const binEnd = (minValue + (i + 1) * binSize).toFixed(2);
    return `[${binStart}, ${binEnd}]`;
  });

  // Transform the histogram data for Recharts format
  const histDefaultsData = binLabels.map((label, index) => ({
    name: label,
    value: histDefaults[index],
  }));

  const histNonDefaultsData = binLabels.map((label, index) => ({
    name: label,
    value: histNonDefaults[index],
  }));

  // Return the transformed data in the format for Recharts
  return [
    {
      name: `Defaults`,
      data: histDefaultsData,  // Histogram data for defaults
      color: `${themePalette.secondary}`,  // Color for defaults
      border: `border-[${themePalette.secondary}]`,  // Border class for defaults
    },
    {
      name: `Non-defaults`,
      data: histNonDefaultsData,  // Histogram data for non-defaults
      color: `${themePalette.primary}`,  // Color for non-defaults
      border: `border-[${themePalette.primary}]`,  // Border class for non-defaults
    },
  ];
}

