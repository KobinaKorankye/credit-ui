import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getNPLDonutData } from './helpers';
import numeral from 'numeral';
import CountLegend from './legends/CountLegend';


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

    const getRatioToShow = () => {
        let total = 0
        data.forEach((d) => {
            total += d.value
        })

        return (data[ratioIndexToShow].value)/total
    }

    return (
        <>
            <ResponsiveContainer className={'relative'} width="100%" height={180}>
                {showRatio &&
                    <div className='absolute w-full h-full text-2xl text-dark font-semibold flex items-center justify-center'>
                        {numeral(getRatioToShow()).format("0.00%")}
                    </div>
                }
                <PieChart>
                    <Pie
                        data={data}
                        cx={'50%'}
                        cy={'50%'}
                        innerRadius={70}
                        outerRadius={90}
                        // fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                        stroke='none'
                        labelLine={false}
                        label={renderCustomizedLabel} // Custom label function
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col gap-1 mt-2'>
                {data.map((item,index) => (
                    <CustomLegend index={index} {...item} key={item.name} />
                ))}
            </div>
        </>
    );
};

export default DonutChart;
