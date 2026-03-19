import React from 'react';

const ChartTypeSelector = ({ 
  value, 
  onValueChange, 
  label = 'Chart Type',
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-medium text-foreground">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onValueChange(e.target.value)}
        className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="area">Area Chart</option>
        <option value="bar">Bar Chart</option>
      </select>
    </div>
  );
};

export default ChartTypeSelector;
