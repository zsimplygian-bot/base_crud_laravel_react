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
  value: (string | number)[];
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

  const selectedOptions = options.filter((opt) => value.includes(opt.id));
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = (id: string | number) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  const removeItem = (id: string | number) => {
    onChange(value.filter((v) => v !== id));
  };

  const clearSearch = () => setSearchTerm("");

  const maxVisibleBadges = 3;
  const visibleBadges = selectedOptions.slice(0, maxVisibleBadges);
  const hasOverflow = selectedOptions.length > maxVisibleBadges;

  return (
    <Select open={open} onOpenChange={setOpen} disabled={disabled}>
      <SelectTrigger
        className={cn(
          className,
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-80 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1"
        )}
      >
        <div
          className="flex flex-wrap gap-1 flex-1 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedOptions.length > 0 ? (
            <>
              {visibleBadges.map((opt) => (
                <span
                  key={opt.id}
                  className="flex items-center bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs max-w-[120px] truncate"
                  title={opt.label}
                >
                  {opt.label}
                  <button
                    type="button"
                    className="ml-1 hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();     // <- clave para evitar que abra el select
                      e.stopPropagation();    // <- clave para que funcione el click
                      removeItem(opt.id);
                    }}
                  >
                    <XIcon className="w-3 h-3 pointer-events-none" />
                  </button>
                </span>
              ))}
              {hasOverflow && (
                <span className="flex items-center bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                  ...
                </span>
              )}
            </>
          ) : (
            <span className="text-sm truncate">{placeholder}</span>
          )}
        </div>
        <SelectValue className="hidden" />
      </SelectTrigger>

      <SelectContent>
        {searchable && (
          <div className="p-2 flex items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none pr-6"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  tabIndex={-1}
                >
                  &times;
                </button>
              )}
            </div>
            {allowCreate && onCreateLink && (
              <Link
                href={onCreateLink}
                className="flex-shrink-0 p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                title="Agregar nuevo"
              >
                <Plus size={16} />
              </Link>
            )}
          </div>
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => {
            const isSelected = value.includes(opt.id);
            return (
              <div
                key={opt.id}
                className={cn(
                  "flex items-center justify-between px-2 py-2 text-sm rounded cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => toggle(opt.id)}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckIcon className="w-4 h-4 text-primary" />}
              </div>
            );
          })
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No se encontraron resultados
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
