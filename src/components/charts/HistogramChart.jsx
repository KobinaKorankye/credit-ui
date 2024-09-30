import numeral from 'numeral';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function formatNumber(value) {
    return numeral(value).format('0a');  // Format to "K" for thousands, "M" for millions
}

export default function HistogramChart({ data, grid, height=250 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart height={250} data={data[0].data.map((item, index) => ({
                x: item.name,  // Range name
                y1: item.value,  // Value for Defaults
                y2: data[1].data[index].value  // Value for Non-Defaults
            }))}>
                {grid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis className='text-[0.6rem] font-bold' dataKey="x" />
                <YAxis className='text-xs font-semibold' />
                <Tooltip />
                <Legend
                    verticalAlign="top"
                    layout="centric"
                    align="right"
                    wrapperStyle={{ fontSize: '0.77rem', fontWeight: "600", color: 'black' }}
                />

                {/* Bar for Defaults */}
                <Bar
                    dataKey="y1"
                    name={data[0].name}  // Name for Defaults
                    fill={data[0].color}  // Fill color for Defaults
                    stroke={data[0].color}  // Stroke color for Defaults
                />

                {/* Bar for Non-Defaults */}
                <Bar
                    dataKey="y2"
                    name={data[1].name}  // Name for Non-Defaults
                    fill={data[1].color}  // Fill color for Non-Defaults
                    stroke={data[1].color}  // Stroke color for Non-Defaults
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
