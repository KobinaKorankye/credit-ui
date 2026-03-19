import React from 'react';
import Card from './Card';

export default function DashboardLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 flex-wrap">
        <div className="h-10 bg-muted rounded w-48"></div>
        <div className="h-10 bg-muted rounded w-32"></div>
        <div className="h-10 bg-muted rounded w-40"></div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </div>
            <div>
              <div className="h-8 w-32 bg-muted rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted rounded"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-5">
        {/* NPL Ratio */}
        <Card title="NPL Ratio" className="lg:col-span-2">
          <div className="h-40 bg-muted rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </Card>

        {/* Credit Distribution */}
        <Card title="Credit Distribution" className="lg:col-span-4">
          <div className="h-48 bg-muted rounded"></div>
        </Card>

        {/* Default Rate */}
        <Card title="Default Rate" className="lg:col-span-2">
          <div className="h-40 bg-muted rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </Card>
      </div>

      {/* Application Trends */}
      <Card title="Application Trends">
        <div className="h-48 bg-muted rounded"></div>
      </Card>

      {/* Loan Summary */}
      <Card title="Loan Portfolio Summary">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="flex-1">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <div className="h-4 bg-muted rounded w-16 mx-auto lg:mx-0 mb-2"></div>
              <div className="h-8 bg-muted rounded w-32 mx-auto lg:mx-0"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mt-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="h-4 bg-muted rounded w-12 mx-auto lg:mx-0 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-20 mx-auto lg:mx-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card title="Recent Applications">
        <div className="space-y-3">
          {/* Table header */}
          <div className="flex space-x-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    </div>
  );
}
