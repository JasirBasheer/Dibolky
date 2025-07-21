import { ITableProps } from "@/types/common";
import React from "react";



const Table = <T extends { id: string | number }>({ columns, data, onClick }: ITableProps<T>) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key as string} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onClick?.(item)}>
              {columns.map((column) => (
                <td key={column.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.render ? column.render(item) : (item[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
