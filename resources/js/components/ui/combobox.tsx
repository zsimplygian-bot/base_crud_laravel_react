import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "./command";
import { ChevronsUpDownIcon, Loader2, CheckIcon } from "lucide-react";
export const Combobox = ({
  id,
  value,
  placeholder,
  disabled,
  open,
  setOpen,
  loading,
  options,
  selectedLabel,
  onSelect,
  CreateButton,
}) => {
  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              id={id}
              readOnly
              disabled={disabled}
              placeholder={placeholder || "-"}
              value={selectedLabel}
              className="w-full pr-10 cursor-pointer"
            />
            {loading ? (
              <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <ChevronsUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Command>
            <div className="flex items-center justify-between gap-2 px-2">
              <CommandInput
                placeholder="Buscar..."
                disabled={disabled || loading}
                className="flex-1"
              />
              {CreateButton}
            </div>
            <CommandList>
              {!loading && options.length === 0 && (
                <CommandEmpty>No hay opciones disponibles.</CommandEmpty>
              )}
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.label.toLowerCase()} // BÚSQUEDA FUNCIONAL
                    onSelect={() => onSelect(opt.id)}
                  >
                    {opt.label}

                    {value === opt.id.toString() && (
                      <CommandShortcut>
                        <CheckIcon className="w-4 h-4" />
                      </CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};