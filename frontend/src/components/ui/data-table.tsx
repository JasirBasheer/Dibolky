import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

type ColumnConfig<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data?.length > 0 ? (
          data.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
            >
              {columns.map((col, j) => (
                <TableCell key={j}>{col.render(row)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-8 text-gray-500">
              {emptyMessage}
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
}
