import React from 'react';
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./DataTable.css";

// A simple global filter for searching
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <input
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="form-control"
      style={{ width: '200px' }}
      placeholder="Search..."
    />
  );
}

// Reusable DataTable component
export default function DataTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index to 0
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div>
      {/* Search and Show Entries Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
       
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} 
        />
      </div>

      {/* Table */}
      <div class="table-container">
      <table {...getTableProps()} className="table ">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      {/* Pagination Controls Row */}
       <div className="horizontal-pagination-card">
        <div className="pagination-info">
          Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
        </div>
        <div className="pagination-buttons">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
          <button
            className="btn btn-sm btn-primary ms-2"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
