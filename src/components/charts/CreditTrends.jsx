import React, { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import ChartTypeSelector from '../selectors/ChartTypeSelector';
import TopModeSelector from '../selectors/TopModeSelector';
import GranularitySelector from '../selectors/GranularitySelector';
import numeral from 'numeral';
import {
  format,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  addDays,
  addWeeks,
  addMonths,
  addYears
} from 'date-fns';

const CreditTrends = ({ loanData = [] }) => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState('area');
  const [trendMode, setTrendMode] = useState('amount');
  const [granularity, setGranularity] = useState('monthly');

  // Get theme-appropriate colors
  const getChartColor = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    switch (theme) {
      case 'dark':
        return computedStyle.getPropertyValue('--chart-1').trim();
      case 'transflow-light':
        return computedStyle.getPropertyValue('--chart-1').trim();
      case 'transflow-dark':
        return computedStyle.getPropertyValue('--chart-1').trim();
      default:
        return computedStyle.getPropertyValue('--chart-1').trim();
    }
  };

  const chartColor = getChartColor();

  // Process real loan data based on granularity
  const processedData = useMemo(() => {
    if (!loanData || loanData.length === 0) {
      return [];
    }

    // Extract all loan dates
    const loanDates = loanData
      .map(loan => parseISO(loan.date_updated || loan.created_at || loan.date_created))
      .filter(Boolean)
      .sort((a, b) => a - b);

    const minDate = loanDates[0];
    const maxDate = loanDates[loanDates.length - 1];

    if (!minDate || !maxDate) return [];

    // Set start and end points by granularity
    let start, end, incrementFn, startFn, labelFormat;

    switch (granularity) {
      case 'daily':
        incrementFn = addDays;
        startFn = startOfDay;
        labelFormat = 'MMM dd';
        break;
      case 'weekly':
        incrementFn = addWeeks;
        startFn = startOfWeek;
        labelFormat = 'MMM dd';
        break;
      case 'monthly':
        incrementFn = addMonths;
        startFn = startOfMonth;
        labelFormat = 'MMM yyyy';
        break;
      case 'yearly':
        incrementFn = addYears;
        startFn = startOfYear;
        labelFormat = 'yyyy';
        break;
      default:
        incrementFn = addMonths;
        startFn = startOfMonth;
        labelFormat = 'MMM yyyy';
    }

    const buckets = [];
    let cursor = startFn(minDate);

    while (cursor <= maxDate) {
      const bucketStart = cursor;
      const bucketEnd = incrementFn(bucketStart, 1);

      const loansInBucket = loanData.filter(loan => {
        const loanDate = parseISO(loan.date_updated || loan.created_at || loan.date_created);
        return loanDate >= bucketStart && loanDate < bucketEnd;
      });

      const totalAmount = loansInBucket.reduce((sum, loan) => {
        return sum + (loan.loan_amount || loan.credit_amount || 0);
      }, 0);

      buckets.push({
        date: format(bucketStart, labelFormat),
        amount: totalAmount,
        count: loansInBucket.length,
        fullDate: bucketStart
      });

      cursor = bucketEnd;
    }

    return buckets;
  }, [loanData, granularity]);

  // Tooltip content
  const tooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Period
              </span>
              <span className="font-bold text-muted-foreground">
                {label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {trendMode === 'amount' ? 'Amount' : 'Count'}
              </span>
              <span className="font-bold">
                {trendMode === 'amount'
                  ? `₵${value?.toLocaleString()}`
                  : value?.toLocaleString()
                }
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = processedData.map(item => ({
    date: item.date,
    total: trendMode === 'amount' ? item.amount : item.count
  }));

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Credit Trend Over Time</h3>
          <p className="text-sm text-muted-foreground">
            {granularity.charAt(0).toUpperCase() + granularity.slice(1)} credit {trendMode === 'amount' ? 'value' : 'volume'} analysis
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ChartTypeSelector
            value={chartType}
            onValueChange={setChartType}
            label="Type"
            className="min-w-[100px]"
          />
          <TopModeSelector
            mode={trendMode}
            onModeChange={setTrendMode}
            label="Show"
            className="min-w-[120px]"
          />
          <GranularitySelector
            value={granularity}
            onValueChange={setGranularity}
            label="Granularity"
            className="min-w-[120px]"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  trendMode === 'amount'
                    ? `₵${numeral(value).format('0.0a')}`
                    : numeral(value).format('0a')
                }
              />
              <Tooltip content={tooltipContent} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={chartColor}
                fillOpacity={1}
                fill="url(#fillTotal)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  trendMode === 'amount'
                    ? `₵${numeral(value).format('0.0a')}`
                    : numeral(value).format('0a')
                }
              />
              <Tooltip content={tooltipContent} />
              <Bar
                dataKey="total"
                fill={chartColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CreditTrends;
