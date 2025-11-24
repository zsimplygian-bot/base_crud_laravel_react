import { useCallback, useMemo } from "react";
interface Column {
  header: string;
  accessor: string;
}
export function useToggleColumns(
  columns: Column[],
  columnVisibility: Record<string, boolean>,
  setColumnVisibility: (v: Record<string, boolean>) => void
) {
  const toggle = useCallback(
    (key: string, value: boolean) =>
      setColumnVisibility(prev => ({ ...prev, [key]: value })),
    [setColumnVisibility]
  );
  const items = useMemo(
    () =>
      columns.map(c => ({
        type: "checkbox" as const,
        label: c.header,
        checked: columnVisibility[c.accessor] !== false,
        onChange: (v: boolean) => toggle(c.accessor, v),
      })),
    [columns, columnVisibility, toggle]
  );
  return { items };
}