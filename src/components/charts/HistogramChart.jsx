import numeral from 'numeral';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function formatNumber(value) {
    return numeral(value).format('0a');  // Format to "K" for thousands, "M" for millions
}

// Theme-aware color palette
const getChartColors = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return [
        `hsl(${computedStyle.getPropertyValue('--chart-1').trim()})`,
        `hsl(${computedStyle.getPropertyValue('--chart-2').trim()})`,
        `hsl(${computedStyle.getPropertyValue('--chart-3').trim()})`,
        `hsl(${computedStyle.getPropertyValue('--chart-4').trim()})`,
        `hsl(${computedStyle.getPropertyValue('--chart-5').trim()})`,
    ];
};

export default function HistogramChart({ data, grid, height=250 }) {
    const chartColors = getChartColors();

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart height={250} data={data[0].data.map((item, index) => ({
                x: item.name,  // Range name
                y1: item.value,  // Value for Defaults
                y2: data[1].data[index].value  // Value for Non-Defaults
            }))}>
                {grid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
                <XAxis
                    className='text-[0.6rem] font-bold'
                    dataKey="x"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                    className='text-xs font-semibold'
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--popover-foreground))'
                    }}
                />
                <Legend
                    verticalAlign="top"
                    layout="centric"
                    align="right"
                    wrapperStyle={{
                        fontSize: '0.77rem',
                        fontWeight: "600",
                        color: 'hsl(var(--foreground))'
                    }}
                />

                {/* Bar for Defaults */}
                <Bar
                    dataKey="y1"
                    name={data[0].name}  // Name for Defaults
                    fill={data[0].color || chartColors[0]}  // Fill color for Defaults
                    stroke={data[0].color || chartColors[0]}  // Stroke color for Defaults
                />

                {/* Bar for Non-Defaults */}
                <Bar
                    dataKey="y2"
                    name={data[1].name}  // Name for Non-Defaults
                    fill={data[1].color || chartColors[1]}  // Fill color for Non-Defaults
                    stroke={data[1].color || chartColors[1]}  // Stroke color for Non-Defaults
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
