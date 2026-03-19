import * as React from "react";
import { useMemo, useState } from "react";
import { generateName } from "../helpers";
import { mappings } from "../constants";
import Button from "./Button";

const defaultColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "full_name",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 260,
    valueGetter: (value, row) => `${generateName(row.person_id)}`,
  },
  {
    field: "credit_amount",
    headerName: "Loan amount (GHS)",
    width: 230,
    type: 'number',
    valueGetter: (value, row) => `${row.credit_amount.toFixed(2)}`,
  },
  {
    field: "duration",
    headerName: "Loan duration (months)",
    width: 230,
    type: 'number',
  },
  {
    field: "purpose",
    headerName: "Purpose",
    width: 190,
    valueGetter: (value, row) => `${mappings[row.purpose]}`,
  },
];

export default function MUIDataTable({
  rows,
  columns = defaultColumns,
  rowKeysToShow = [],
  onRowClick,
  pageSize = 6,
  loading = false
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updated_rows = useMemo(() => {
    return rows.map((row, index) => {
      const newRow = {};
      newRow.id = index;
      if (!rowKeysToShow.length) {
        rowKeysToShow = Object.keys(row);
      }
      Object.keys(row).forEach((key) => {
        if (rowKeysToShow.includes(key)) {
          newRow[key] = row[key];
        }
      });
      return newRow;
    });
  }, [rows, rowKeysToShow]);

  const totalPages = Math.ceil(updated_rows.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = updated_rows.slice(startIndex, endIndex);

  const getColumnValue = (row, column) => {
    if (column.valueGetter) {
      return column.valueGetter(row[column.field], row);
    }
    return mappings[row[column.field]] || row[column.field];
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {/* Table header skeleton */}
            <div className="flex space-x-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>

            {/* Table rows skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Loading data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {isMobile ? (
        // Mobile Card View
        <div className="divide-y divide-border">
          {currentRows.map((row, index) => (
            <div
              key={row.id}
              onClick={() => onRowClick && onRowClick({ row })}
              className="p-4 transition-colors hover:bg-muted/50 cursor-pointer"
            >
              <div className="space-y-2">
                {columns.slice(0, 3).map((column) => ( // Show only first 3 columns on mobile
                  <div key={column.field} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {column.headerName}:
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {getColumnValue(row, column)}
                    </span>
                  </div>
                ))}
                {columns.length > 3 && (
                  <div className="text-xs text-muted-foreground pt-1">
                    Tap to view more details
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop Table View
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                    style={{ minWidth: column.width || 'auto' }}
                  >
                    {column.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick({ row })}
                  className="border-b border-border transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  {columns.map((column) => (
                    <td key={column.field} className="p-4 align-middle">
                      {getColumnValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/25">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Rows per page:</span>
          <span className="text-sm text-muted-foreground sm:hidden">Per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="h-8 w-16 rounded border border-input bg-background px-2 text-sm touch-target"
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-sm text-muted-foreground text-center">
            {startIndex + 1}-{Math.min(endIndex, updated_rows.length)} of {updated_rows.length}
          </span>
          <div className="flex items-center gap-1">
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
              >
                First
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              {isMobile ? '‹' : 'Previous'}
            </Button>
            {!isMobile && (
              <span className="px-2 text-sm text-muted-foreground">
                {currentPage + 1} of {totalPages}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              {isMobile ? '›' : 'Next'}
            </Button>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                Last
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
