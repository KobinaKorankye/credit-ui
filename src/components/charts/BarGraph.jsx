import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { getChartColors, getCSSCustomProperties } from '../../utils/colorUtils';

export default function BarGraph({ data, grid, height = 400 }) {
    const chartColors = getChartColors();

    // Assign theme colors to data if not already provided
    const dataWithThemeColors = data.map((entry, index) => ({
        ...entry,
        color: entry.color || chartColors[index % chartColors.length]
    }));

    // Responsive sizing and configuration
    const getResponsiveConfig = () => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                return {
                    height: Math.min(height, 300),
                    fontSize: '10px',
                    barSize: '15%',
                    tickMargin: 5
                };
            } else if (width < 1024) { // tablet
                return {
                    height: Math.min(height, 350),
                    fontSize: '11px',
                    barSize: '12%',
                    tickMargin: 8
                };
            }
        }
        // desktop
        return {
            height: height,
            fontSize: '12px',
            barSize: '10%',
            tickMargin: 10
        };
    };

    const config = getResponsiveConfig();

    return (
        <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={dataWithThemeColors} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis
                    className='text-xs font-semibold'
                    dataKey="name"
                    tick={{
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: config.fontSize
                    }}
                    tickMargin={config.tickMargin}
                    interval={0}
                    angle={window?.innerWidth < 640 ? -45 : 0}
                    textAnchor={window?.innerWidth < 640 ? 'end' : 'middle'}
                    height={window?.innerWidth < 640 ? 60 : 30}
                />
                <YAxis
                    className='text-xs font-semibold'
                    tick={{
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: config.fontSize
                    }}
                    tickMargin={config.tickMargin}
                />
                {grid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--popover-foreground))',
                        fontSize: '0.875rem'
                    }}
                />
                <Bar barSize={config.barSize} dataKey="value">
                    {
                        dataWithThemeColors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};