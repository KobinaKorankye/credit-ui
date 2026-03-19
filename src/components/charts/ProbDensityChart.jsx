import numeral from 'numeral';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function formatNumber(value) {
    return numeral(value).format('0a');  // Format to "K" for thousands, "M" for millions
}

// Theme-aware color palette
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

export default function ProbDensityChart({ data, hideY, grid, height = 250 }) {
    const chartColors = getChartColors();

    // Responsive configuration
    const getResponsiveConfig = () => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                return {
                    height: Math.min(height, 200),
                    fontSize: '10px',
                    legendSize: '0.7rem',
                    margin: { top: 10, right: 10, left: 10, bottom: 10 }
                };
            } else if (width < 1024) { // tablet
                return {
                    height: Math.min(height, 225),
                    fontSize: '11px',
                    legendSize: '0.75rem',
                    margin: { top: 15, right: 15, left: 15, bottom: 15 }
                };
            }
        }
        // desktop
        return {
            height: height,
            fontSize: '12px',
            legendSize: '0.77rem',
            margin: { top: 20, right: 20, left: 20, bottom: 20 }
        };
    };

    const config = getResponsiveConfig();

    return (
        <ResponsiveContainer width="100%" height={config.height}>
            <AreaChart margin={config.margin}>
                {grid &&
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                }
                <XAxis
                    className='text-xs font-semibold'
                    tickFormatter={formatNumber}
                    dataKey="x"
                    type="number"
                    tick={{
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: config.fontSize
                    }}
                    tickMargin={5}
                />
                {!hideY && (
                    <YAxis
                        className='text-xs font-semibold'
                        tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: config.fontSize
                        }}
                        tickMargin={5}
                    />
                )}
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--popover-foreground))',
                        fontSize: '0.875rem'
                    }}
                />
                <Legend
                    verticalAlign="top"
                    layout="horizontal"
                    align={window?.innerWidth < 640 ? "center" : "right"}
                    wrapperStyle={{
                        fontSize: config.legendSize,
                        fontWeight: "600",
                        color: 'hsl(var(--foreground))',
                        paddingBottom: '10px'
                    }}
                />

                {/* Area plot for Non-Performing (Defaults) */}
                <Area
                    type="monotone"
                    dataKey="y"
                    data={data[0].data}  // Data for Non-Performing
                    name={data[0].name}  // Name for the legend
                    stroke={data[0].color || chartColors[0]}  // Stroke color for the curve
                    fill={data[0].color || chartColors[0]}  // Fill color for the area
                    fillOpacity={0.6}
                    dot={false}
                />

                {/* Area plot for Performing (Non-Defaults) */}
                <Area
                    type="monotone"
                    dataKey="y"
                    data={data[1].data}  // Data for Performing
                    name={data[1].name}  // Name for the legend
                    stroke={data[1].color || chartColors[1]}  // Stroke color for the curve
                    fill={data[1].color || chartColors[1]}  // Fill color for the area
                    fillOpacity={0.6}
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};