import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getNPLDonutData } from './helpers';
import numeral from 'numeral';
import CountLegend from './legends/CountLegend';

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


const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.1;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text x={x} y={y} fontSize={10} fontWeight={'500'} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const DonutChart = ({ data, showRatio, ratioIndexToShow, legendComponent: CustomLegend = CountLegend }) => {
    const chartColors = getChartColors();

    // Assign theme colors to data if not already provided
    const dataWithThemeColors = data?.map((entry, index) => ({
        ...entry,
        color: chartColors[index % chartColors.length]
    }));

    const getRatioToShow = () => {
        let total = 0
        dataWithThemeColors?.forEach((d) => {
            total += d.value
        })

        return dataWithThemeColors ? (dataWithThemeColors[ratioIndexToShow]?.value) / total : 0
    }

    // Responsive sizing based on screen size
    const getResponsiveSize = () => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                return { height: 160, innerRadius: 50, outerRadius: 70, fontSize: 'text-lg' };
            } else if (width < 1024) { // tablet
                return { height: 170, innerRadius: 60, outerRadius: 80, fontSize: 'text-xl' };
            }
        }
        // desktop
        return { height: 180, innerRadius: 70, outerRadius: 90, fontSize: 'text-2xl' };
    };

    const { height, innerRadius, outerRadius, fontSize } = getResponsiveSize();

    return (
        <div className='h-full w-full flex flex-col'>
            <ResponsiveContainer className={'relative mt-auto'} width="100%" height={height}>
                {showRatio &&
                    <div className={`absolute w-full h-full ${fontSize} font-semibold flex items-center justify-center text-foreground z-10`}>
                        {numeral(getRatioToShow()).format("0.00%")}
                    </div>
                }
                <PieChart>
                    <Pie
                        data={dataWithThemeColors}
                        cx={'50%'}
                        cy={'50%'}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        paddingAngle={0}
                        dataKey="value"
                        stroke='none'
                        labelLine={false}
                        label={renderCustomizedLabel}
                    >
                        {dataWithThemeColors?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            color: 'hsl(var(--popover-foreground))',
                            fontSize: '0.875rem'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col gap-1 mt-auto max-h-32 overflow-y-auto'>
                {dataWithThemeColors?.map((item, index) => (
                    <CustomLegend index={index} {...item} key={item.name} />
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
