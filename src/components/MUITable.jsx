import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { generateName } from "../helpers";
import { mappings } from "../constants";

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
  pageSize=6
}) {
  let updated_rows = useMemo(() => {
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

  return (
      <DataGrid
        rows={updated_rows}
        style={{ paddingLeft: 20 }}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: pageSize },
          },
        }}
        onRowClick={onRowClick}
        pageSizeOptions={[6, 10]}
        sx={{
          '& .MuiDataGrid-columnHeader': {
            marginRight: '16px',
          },
          '& .MuiDataGrid-cell': {
            marginRight: '16px',
          },
        }}
        // checkboxSelection
      />
  );
}
