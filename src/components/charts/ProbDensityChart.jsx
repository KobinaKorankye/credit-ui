import numeral from 'numeral';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function formatNumber(value) {
    return numeral(value).format('0a');  // Format to "K" for thousands, "M" for millions
}

export default function ProbDensityChart({ data, hideY, grid, height = 250 }) {
    // Get the KDE data for the specified column

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart height={250}>
                {grid &&
                    <CartesianGrid strokeDasharray="3 3" />
                }
                <XAxis className='text-xs font-semibold' tickFormatter={formatNumber} dataKey="x" type="number" />
                {!hideY && <YAxis className='text-xs font-semibold' />}
                <Tooltip />
                <Legend
                    verticalAlign="top"
                    layout="centric"
                    align="right"
                    wrapperStyle={{
                        fontSize: '0.77rem', fontWeight: "600", color: 'black'
                    }}
                />

                {/* Area plot for Non-Performing (Defaults) */}
                <Area
                    type="monotone"
                    dataKey="y"
                    data={data[0].data}  // Data for Non-Performing
                    name={data[0].name}  // Name for the legend
                    stroke={data[0].color}  // Stroke color for the curve
                    fill={data[0].color}  // Fill color for the area
                    dot={false}
                />

                {/* Area plot for Performing (Non-Defaults) */}
                <Area
                    type="monotone"
                    dataKey="y"
                    data={data[1].data}  // Data for Performing
                    name={data[1].name}  // Name for the legend
                    stroke={data[1].color}  // Stroke color for the curve
                    fill={data[1].color}  // Fill color for the area
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};