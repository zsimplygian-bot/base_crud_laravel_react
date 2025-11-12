import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import DropdownMenuBase, { DItem } from "@/components/dropdown-menu";
interface Column {
  header: string;
  accessor: string;
}
interface SearchFilterProps {
  columns: Column[];
  localSelectedColumn: string | null;
  setLocalSelectedColumn: (v: string | null) => void;
  localSearchTerm: string;
  setLocalSearchTerm: (v: string) => void;
  onSearch: () => void;
}
export function SearchFilter({
  columns,
  localSelectedColumn,
  setLocalSelectedColumn,
  localSearchTerm,
  setLocalSearchTerm,
  onSearch
}: SearchFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState(false);
  useEffect(() => {
    if (inputVisible) setTimeout(() => inputRef.current?.focus(), 50);
  }, [inputVisible]);
  const closeSearch = () => {
    setInputVisible(false);
    setLocalSelectedColumn(null);
    setLocalSearchTerm("");
  };
  const menuItems: DItem[] = columns.map(col => ({
    label: col.header.toUpperCase(),
    action: () => {
      setLocalSelectedColumn(col.accessor);
      setInputVisible(true);
    }
  }));
  return (
    <div className="flex items-center gap-2 w-full">
    <DropdownMenuBase
        trigger={
        <Button variant="outline" size="sm">
            <SearchIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" />
        </Button>
        }
        label="Buscar por"
        items={menuItems}
        align="start"
    />
    {inputVisible && (
        <div className="relative w-40 md:w-36">
        <Input
            ref={inputRef}
            placeholder={`Buscar ${
            columns.find(c => c.accessor === localSelectedColumn)?.header.toLowerCase() ?? ""
            }`}
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSearch()}
            className="text-sm w-full"
        />
        {localSearchTerm && (
            <button
            type="button"
            onClick={closeSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            >
            <XIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" />
            </button>
        )}
        </div>
    )}
    </div>
  );
}