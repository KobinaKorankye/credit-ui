import React from 'react';
import { TbAnalyze } from 'react-icons/tb';

const sizeMap = {
  small: 'w-5 h-5',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const CustomLoader = ({ size = 'large', text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <TbAnalyze className={`animate-spin text-primary ${sizeMap[size] || sizeMap.large}`} />
      {text && (
        <span className="text-sm font-medium text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

export const ChartLoader = ({ height = 300 }) => (
  <div className="flex items-center justify-center w-full" style={{ height }}>
    <CustomLoader size="medium" />
  </div>
);

export const TableLoader = ({ rows = 5 }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-muted h-10 w-10"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const CardLoader = () => (
  <div className="animate-pulse p-6 bg-card rounded-lg border">
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-1/3"></div>
      <div className="h-16 bg-muted rounded"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const AnalysisLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <CustomLoader size="xl" />
  </div>
);

export default CustomLoader;
