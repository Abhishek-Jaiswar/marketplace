import type { ReactNode } from "react"

import { EmptyState, ErrorState } from "@workspace/ui/components/states"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

export interface DataTableColumn<Row> {
  key: string
  header: string
  cell: (row: Row) => ReactNode
  /** Right-aligns the column and uses aligned figures. */
  numeric?: boolean
  className?: string
}

export interface DataTableProps<Row> {
  /** Describes the table to assistive technology. */
  caption: string
  columns: DataTableColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row) => string
  isLoading?: boolean
  /** Message explaining the failure. Replaces the rows when set. */
  error?: string | undefined
  onRetry?: () => void
  empty?: { title: string; description?: string; action?: ReactNode }
  onRowClick?: (row: Row) => void
  /** Rendered under the rows, typically `Pagination`. */
  footer?: ReactNode
  className?: string
}

const LOADING_ROWS = 5

export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  isLoading = false,
  error,
  onRetry,
  empty,
  onRowClick,
  footer,
  className,
}: DataTableProps<Row>) {
  const cellClasses = (column: DataTableColumn<Row>) =>
    cn(
      "px-3 py-2",
      column.numeric && "text-right tabular-nums",
      column.className
    )

  const showEmpty = !isLoading && !error && rows.length === 0

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      {error ? (
        <ErrorState message={error} {...(onRetry ? { onRetry } : {})} />
      ) : showEmpty ? (
        <EmptyState title={empty?.title ?? "Nothing here yet"} {...empty} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead className="text-sm text-muted-foreground">
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(cellClasses(column), "font-medium")}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: LOADING_ROWS }, (_, index) => (
                    <tr key={index} className="row-density">
                      {columns.map((column) => (
                        <td key={column.key} className="px-3 py-2">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row) => (
                    <tr
                      key={rowKey(row)}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={cn(
                        "row-density",
                        onRowClick && "cursor-pointer hover:bg-accent"
                      )}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className={cellClasses(column)}>
                          {column.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
      {footer ? <div className="border-t border-border">{footer}</div> : null}
    </div>
  )
}
