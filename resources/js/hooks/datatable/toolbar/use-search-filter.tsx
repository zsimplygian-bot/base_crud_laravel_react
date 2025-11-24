import { useRef, useState, useEffect, useMemo, useCallback } from "react";
interface Column {
  header: string;
  accessor: string;
}
export function useSearchFilter({
  columns,
  localSelectedColumn,
  setLocalSelectedColumn,
  setLocalSearchTerm,
  onSearch,
}: {
  columns: Column[];
  localSelectedColumn: string | null;
  setLocalSelectedColumn: (v: string | null) => void;
  localSearchTerm: string;
  setLocalSearchTerm: (v: string) => void;
  onSearch: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState(false);
  // focus automático cuando aparece el input
  useEffect(() => {
    if (inputVisible) setTimeout(() => inputRef.current?.focus(), 50);
  }, [inputVisible]);
  const closeSearch = useCallback(() => {
    setInputVisible(false);
    setLocalSelectedColumn(null);
    setLocalSearchTerm("");
  }, [setLocalSelectedColumn, setLocalSearchTerm]);
  const placeholder = useMemo(() => {
    const col = columns.find(c => c.accessor === localSelectedColumn);
    return col ? `Buscar ${col.header.toLowerCase()}` : "";
  }, [columns, localSelectedColumn]);
  const menuItems = useMemo(
    () =>
      columns.map(col => ({
        label: col.header.toUpperCase(),
        action: () => {
          setLocalSelectedColumn(col.accessor);
          setInputVisible(true);
        },
      })),
    [columns, setLocalSelectedColumn]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearch();
    },
    [onSearch]
  );
  return {
    inputRef,
    inputVisible,
    setInputVisible,
    closeSearch,
    placeholder,
    menuItems,
    handleKeyDown,
  };
}