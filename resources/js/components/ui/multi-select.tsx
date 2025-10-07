import * as React from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, XIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

type Option = { id: string | number; label: string };

type MultiSelectProps = {
  options: Option[];
  value: (string | number)[] | string | number | undefined;
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  allowCreate?: boolean;
  onCreateLink?: string;
  className?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "-",
  disabled = false,
  searchable = true,
  allowCreate = false,
  onCreateLink,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // ✅ safeValue y arrays memorizados
  const safeValue = React.useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const selectedOptions = React.useMemo(
    () => options.filter((opt) => safeValue.includes(opt.id)),
    [options, safeValue]
  );
  const filteredOptions = React.useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  const toggle = React.useCallback(
    (id: string | number) =>
      onChange(safeValue.includes(id) ? safeValue.filter((v) => v !== id) : [...safeValue, id]),
    [safeValue, onChange]
  );

  const removeItem = React.useCallback(
    (id: string | number) => onChange(safeValue.filter((v) => v !== id)),
    [safeValue, onChange]
  );

  const clearSearch = React.useCallback(() => setSearchTerm(""), []);

  const maxVisibleBadges = 3;
  const visibleBadges = selectedOptions.slice(0, maxVisibleBadges);
  const hasOverflow = selectedOptions.length > maxVisibleBadges;

  return (
    <Select open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger
        className={cn(
          className,
          "border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-80"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {selectedOptions.length > 0 ? (
            <>
              {visibleBadges.map((opt) => (
                <Badge key={opt.id} label={opt.label} onRemove={() => removeItem(opt.id)} />
              ))}
              {hasOverflow && <span className="flex items-center bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">...</span>}
            </>
          ) : (
            <span className="text-sm truncate">{placeholder}</span>
          )}
        </div>
        <SelectValue className="hidden" />
      </SelectTrigger>

      <SelectContent>
        {searchable && (
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            clearSearch={clearSearch}
            allowCreate={allowCreate}
            onCreateLink={onCreateLink}
          />
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => {
            const isSelected = safeValue.includes(opt.id);
            return (
              <OptionItem
                key={opt.id}
                label={opt.label}
                selected={isSelected}
                onClick={() => toggle(opt.id)}
              />
            );
          })
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">No se encontraron resultados</div>
        )}
      </SelectContent>
    </Select>
  );
};

// 💠 Componentes auxiliares
const Badge: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="flex items-center bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs max-w-[120px] truncate" title={label}>
    {label}
    <button type="button" className="ml-1 hover:text-destructive" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}>
      <XIcon className="w-3 h-3 pointer-events-none" />
    </button>
  </span>
);

const SearchInput: React.FC<{
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  clearSearch: () => void;
  allowCreate?: boolean;
  onCreateLink?: string;
}> = ({ searchTerm, setSearchTerm, clearSearch, allowCreate, onCreateLink }) => (
  <div className="p-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none pr-6"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      {searchTerm && (
        <button type="button" onClick={(e) => { e.stopPropagation(); clearSearch(); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black" tabIndex={-1}>
          &times;
        </button>
      )}
    </div>
    {allowCreate && onCreateLink && (
      <Link href={onCreateLink} className="flex-shrink-0 p-1 rounded bg-blue-500 hover:bg-blue-600 text-white" title="Agregar nuevo" onClick={(e) => e.stopPropagation()}>
        <Plus size={16} />
      </Link>
    )}
  </div>
);

const OptionItem: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <div
    className={cn(
      "flex items-center justify-between px-2 py-2 text-sm rounded cursor-pointer",
      selected ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent hover:text-accent-foreground"
    )}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
  >
    <span>{label}</span>
    {selected && <CheckIcon className="w-4 h-4 text-primary" />}
  </div>
);
