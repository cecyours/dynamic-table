"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable, usePagination, useSortBy } from "react-table";
import { useSearchParams } from "next/navigation";

const DataTable = ({ columns, fetchDataUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const searchParams = useSearchParams();

  // Ensure default values for query parameters
  const page = Number(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('searchTerm') || "";
  const sortBy = searchParams.get('sortBy') || "name";
  const sortOrder = searchParams.get('sortOrder') || "asc";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(fetchDataUrl, {
          params: { page, searchTerm, sortBy, sortOrder },
        });
        setData(res.data.data);
        setPageCount(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchDataUrl, page, searchTerm, sortBy, sortOrder]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        manualPagination: true,
        pageCount,
        manualSortBy: true,
      },
      useSortBy,
      usePagination
    );

  const handleSearch = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('searchTerm', value);
    params.set('page', 1); // Reset to page 1 on search
    // Update the URL search params without refreshing the page
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSort = (columnId) => {
    const isAscending = sortBy === columnId && sortOrder === "asc";
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', columnId);
    params.set('sortOrder', isAscending ? "desc" : "asc");
    params.set('page', 1); // Reset to page 1 on sort
    // Update the URL search params without refreshing the page
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    // Update the URL search params without refreshing the page
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm} // Ensure search input reflects the query
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
      />
  
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full border-collapse border border-gray-300">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                  {headerGroup.headers.map((column) => {
                    const { key, ...rest } = column.getHeaderProps();
                    return (
                      <th key={key} {...rest} className="p-2 border border-gray-300 cursor-pointer hover:bg-gray-300" onClick={() => handleSort(column.id)}>
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => {
                      const { key, ...rest } = cell.getCellProps();
                      return (
                        <td key={key} {...rest} className="p-2 border border-gray-300">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
  
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={Number(page) === index + 1}
            className={`p-2 border rounded ${Number(page) === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
  
};

export default DataTable;
