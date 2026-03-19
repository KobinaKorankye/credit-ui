import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import numeral from 'numeral';

const CreditDistributionChart = ({ data, height = 300 }) => {
    const [chartType, setChartType] = useState('area');

    // Get theme-aware colors
    const getChartColors = () => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        return [
            computedStyle.getPropertyValue('--chart-1').trim(),
            computedStyle.getPropertyValue('--chart-2').trim(),
            computedStyle.getPropertyValue('--chart-3').trim(),
            computedStyle.getPropertyValue('--chart-4').trim(),
            computedStyle.getPropertyValue('--chart-5').trim(),
        ];
    };

    const chartColors = getChartColors();

    // Process data for better visualization
    const processedData = data && data.length > 0 ? data.map((series, index) => ({
        ...series,
        color: series.color || chartColors[index % chartColors.length],
        data: series.data || []
    })) : [];

    // Combine data for single chart display with probability scaling
    const PROBABILITY_SCALE_FACTOR = 1000; // Scale factor to make small probabilities visible

    const combinedData = processedData.length > 0 && processedData[0].data ?
        processedData[0].data.map((item, index) => {
            const result = { x: item.x };
            processedData.forEach((series, seriesIndex) => {
                // Scale probability values to make them visible
                const originalValue = series.data[index]?.y || 0;
                result[`series_${seriesIndex}`] = originalValue * PROBABILITY_SCALE_FACTOR;
            });
            return result;
        }) : [];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <div className="mb-2">
                        <span className="text-sm font-medium text-foreground">
                            Amount: {numeral(label).format('₵0,0')}
                        </span>
                    </div>
                    {payload.map((entry, index) => {
                        // Convert back to original probability value for display
                        const originalValue = entry.value / PROBABILITY_SCALE_FACTOR;
                        return (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {processedData[index]?.name || `Series ${index + 1}`}: {numeral(originalValue).format('0.0000')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    // Custom legend
    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium text-foreground">
                            {processedData[index]?.name || entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    if (!data || data.length === 0 || !processedData[0]?.data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-muted-foreground text-sm">No distribution data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Chart Type Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Credit Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                        Distribution analysis of credit amounts
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            chartType === 'area' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Area
                    </button>
                    <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            chartType === 'bar' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Bar
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                        <AreaChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                {processedData.map((series, index) => (
                                    <linearGradient key={index} id={`gradient_${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={series.color} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={series.color} stopOpacity={0.1} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="x"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => numeral(value).format('0a')}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    // Convert back to original probability for display
                                    const originalValue = value / PROBABILITY_SCALE_FACTOR;
                                    return numeral(originalValue).format('0.0000');
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                            {processedData.map((series, index) => (
                                <Area
                                    key={index}
                                    type="monotone"
                                    dataKey={`series_${index}`}
                                    stroke={series.color}
                                    fill={`url(#gradient_${index})`}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </AreaChart>
                    ) : (
                        <BarChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="x"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => numeral(value).format('0a')}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    // Convert back to original probability for display
                                    const originalValue = value / PROBABILITY_SCALE_FACTOR;
                                    return numeral(originalValue).format('0.0000');
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                            {processedData.map((series, index) => (
                                <Bar
                                    key={index}
                                    dataKey={`series_${index}`}
                                    fill={series.color}
                                    radius={[2, 2, 0, 0]}
                                    opacity={0.8}
                                />
                            ))}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CreditDistributionChart;
