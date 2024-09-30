import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function BarGraph({ data, grid, height = 400 }) {

    console.log(data)

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <XAxis className='text-xs font-semibold' dataKey="name" />
                <YAxis className='text-xs font-semibold' />
                {grid && <CartesianGrid strokeDasharray="3 3" />}
                <Tooltip />
                <Bar barSize={'10%'} dataKey="value">
                    {
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};