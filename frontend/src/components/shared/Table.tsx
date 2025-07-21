import React, { useCallback, useMemo } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type SortConfig<T> = {
  key: keyof T;
  direction: 'asc' | 'desc';
} | null;

type Props<T> = {
  columns: Column<T>[];
  data: T[];
   selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedIds: string[], selectedItems: T[]) => void;
   idAccessor?: keyof T;
   loading?: boolean;
   emptyMessage?: string;
   className?: string;
   sortable?: boolean;
};

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  selectable = false,
  selectedRows = new Set<string>(),
  onSelectionChange,
  idAccessor = ('_id' in (data[0] || {})) ? '_id' as keyof T : 'id' as keyof T,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  sortable = true,
}: Props<T>) => {
  const [sortConfig, setSortConfig] = React.useState<SortConfig<T>>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortConfig, sortable]);

   const handleSort = useCallback((accessor: keyof T) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.accessor === accessor);
    if (column?.sortable === false) return;
    
    setSortConfig(prevConfig => {
      if (prevConfig?.key === accessor) {
        return prevConfig.direction === 'asc' 
          ? { key: accessor, direction: 'desc' }
          : null;  
      }
      return { key: accessor, direction: 'asc' };
    });
  }, [sortable, columns]);

   const handleRowSelect = useCallback((id: string) => {
    if (!selectable || !onSelectionChange) return;
    
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    
    const selectedItems = data.filter(item => newSelectedRows.has(String(item[idAccessor])));
    onSelectionChange(Array.from(newSelectedRows), selectedItems);
  }, [selectable, selectedRows, onSelectionChange, data, idAccessor]);

   const handleSelectAll = useCallback(() => {
    if (!selectable || !onSelectionChange) return;
    
    const allIds = data.map(item => String(item[idAccessor]));
    const allSelected = allIds.every(id => selectedRows.has(id));
    
    if (allSelected) {
      onSelectionChange([], []);
    } else {
      onSelectionChange(allIds, data);
    }
  }, [selectable, data, selectedRows, onSelectionChange, idAccessor]);

   const selectAllState = useMemo(() => {
    if (!selectable || data.length === 0) return 'none';
    
    const allIds = data.map(item => String(item[idAccessor]));
    const selectedCount = allIds.filter(id => selectedRows.has(id)).length;
    
    if (selectedCount === 0) return 'none';
    if (selectedCount === allIds.length) return 'all';
    return 'some';
  }, [selectable, data, selectedRows, idAccessor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {selectable && (
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAllState === 'all'}
                  ref={input => {
                    if (input) input.indeterminate = selectAllState === 'some';
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className={`p-3 text-left text-sm font-medium text-gray-700 ${
                  sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => handleSort(column.accessor)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {sortable && column.sortable !== false && (
                    <span className="text-gray-400">
                      {sortConfig?.key === column.accessor ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕'
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => {
            const id = String(row[idAccessor]);
            return (
              <tr
                key={id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  selectable && selectedRows.has(id) ? 'bg-blue-50' : ''
                }`}
              >
                {selectable && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(id)}
                      onChange={() => handleRowSelect(id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={String(column.accessor)} className="p-3 text-sm text-gray-900">
                    {column.render 
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor] != null 
                        ? String(row[column.accessor]) 
                        : '-'
                    }
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
