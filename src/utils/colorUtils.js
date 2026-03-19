// Color utility functions for converting OKLCH to formats that chart libraries understand

/**
 * Convert OKLCH color to HSL format that chart libraries can use
 * This is a simplified conversion - for production, you might want to use a proper color conversion library
 */
function oklchToHsl(oklchString) {
  // Extract values from oklch(L C H) format
  const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) {
    // Fallback to a default blue if parsing fails
    return 'hsl(220, 70%, 50%)';
  }

  const [, l, c, h] = match;
  const lightness = parseFloat(l);
  const chroma = parseFloat(c);
  const hue = parseFloat(h);

  // Simplified conversion from OKLCH to HSL
  // This is an approximation - for exact conversion, use a proper color library
  const hslHue = hue;
  const hslSaturation = Math.min(100, chroma * 100 * 2); // Approximate conversion
  const hslLightness = Math.min(100, lightness * 100);

  return `hsl(${hslHue}, ${hslSaturation}%, ${hslLightness}%)`;
}

/**
 * Convert OKLCH color to hex format
 */
function oklchToHex(oklchString) {
  // For now, we'll use a mapping approach since exact OKLCH->RGB conversion is complex
  // In production, consider using a library like 'culori' for accurate conversions
  
  const colorMap = {
    // Transflow light theme colors
    'oklch(0.35 0.15 240)': '#08518A', // Primary blue
    'oklch(0.55 0.12 180)': '#2E8B8B', // Teal
    'oklch(0.65 0.15 300)': '#8B5A9F', // Purple
    'oklch(0.45 0.18 60)': '#B8860B', // Orange
    'oklch(0.6 0.14 120)': '#228B22', // Green
    
    // Transflow dark theme colors
    'oklch(0.65 0.18 240)': '#4A90E2', // Bright blue
    'oklch(0.7 0.15 180)': '#40B5B5', // Bright teal
    'oklch(0.75 0.18 300)': '#B57EDC', // Bright purple
    'oklch(0.7 0.2 60)': '#E6A500', // Bright orange
    'oklch(0.7 0.16 120)': '#32CD32', // Bright green
    
    // Default theme colors
    'oklch(0.704 0.04 256.788)': '#6366F1', // Default chart-1
    'oklch(0.696 0.17 162.48)': '#10B981', // Default chart-2
    'oklch(0.769 0.188 70.08)': '#F59E0B', // Default chart-3
    'oklch(0.627 0.265 303.9)': '#EF4444', // Default chart-4
    'oklch(0.645 0.246 16.439)': '#F97316', // Default chart-5
  };

  // Check if we have a direct mapping
  if (colorMap[oklchString]) {
    return colorMap[oklchString];
  }

  // Fallback: convert to HSL first, then approximate hex
  const hsl = oklchToHsl(oklchString);
  
  // Simple HSL to hex conversion (approximate)
  const hslMatch = hsl.match(/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    return hslToHex(parseFloat(h), parseFloat(s), parseFloat(l));
  }

  // Ultimate fallback
  return '#6366F1';
}

/**
 * Convert HSL to hex
 */
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Get theme colors in formats that chart libraries can understand
 */
export const getChartColors = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const chartColors = [
    computedStyle.getPropertyValue('--chart-1').trim(),
    computedStyle.getPropertyValue('--chart-2').trim(),
    computedStyle.getPropertyValue('--chart-3').trim(),
    computedStyle.getPropertyValue('--chart-4').trim(),
    computedStyle.getPropertyValue('--chart-5').trim(),
  ];

  // Convert colors to hex format for chart libraries
  return chartColors.map(color => {
    // Handle OKLCH format
    if (color.startsWith('oklch(')) {
      return oklchToHex(color);
    }
    // Handle HSL space-separated format
    const hslMatch = color.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      return hslToHex(parseFloat(h), parseFloat(s), parseFloat(l));
    }
    // If it's already in hsl() format, return as is for Recharts
    if (color.startsWith('hsl(')) {
      return color;
    }
    // Otherwise, wrap it in hsl() for Recharts compatibility
    return `hsl(${color})`;
  });
};

/**
 * Get specific theme colors for common use cases
 */
export const getThemeColors = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const primary = computedStyle.getPropertyValue('--chart-1').trim();
  const secondary = computedStyle.getPropertyValue('--chart-2').trim();
  const alt = computedStyle.getPropertyValue('--chart-3').trim();
  const surfaceLight = computedStyle.getPropertyValue('--chart-4').trim();

  // Convert color to hex
  const convertToHex = (colorString) => {
    // Handle OKLCH format
    if (colorString.startsWith('oklch(')) {
      return oklchToHex(colorString);
    }
    // Handle HSL space-separated format
    const hslMatch = colorString.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      return hslToHex(parseFloat(h), parseFloat(s), parseFloat(l));
    }
    return `hsl(${colorString})`;
  };

  return {
    primary: convertToHex(primary),
    secondary: convertToHex(secondary),
    alt: convertToHex(alt),
    surfaceLight: convertToHex(surfaceLight),
    // Also provide HSL versions for components that prefer them
    primaryHsl: `hsl(${primary})`,
    secondaryHsl: `hsl(${secondary})`,
    altHsl: `hsl(${alt})`,
    surfaceLightHsl: `hsl(${surfaceLight})`,
  };
};

/**
 * Get CSS custom properties in their original format (for CSS usage)
 */
export const getCSSCustomProperties = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  return {
    foreground: computedStyle.getPropertyValue('--foreground').trim(),
    mutedForeground: computedStyle.getPropertyValue('--muted-foreground').trim(),
    background: computedStyle.getPropertyValue('--background').trim(),
    border: computedStyle.getPropertyValue('--border').trim(),
    popover: computedStyle.getPropertyValue('--popover').trim(),
    popoverForeground: computedStyle.getPropertyValue('--popover-foreground').trim(),
  };
};
