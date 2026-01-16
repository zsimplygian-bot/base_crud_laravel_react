import { useMemo, useCallback, useState } from "react";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "./command";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
export const Combobox = ({
  id, value, placeholder = "-", disabled, open, setOpen, options = [], loading, onSelect, }) => {
  const [search, setSearch] = useState("");
  const selectedLabel = useMemo(() => {
    if (value === "" || value === null) return "";
    return options.find(o => String(o.id) === String(value))?.label ?? "";
  }, [options, value]);
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const s = search.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(s));
  }, [options, search]);
  const handleSelect = useCallback((idSelected: any) => {
    onSelect(String(value) === String(idSelected) ? "" : idSelected);
    setOpen(false); // Cierra siempre
    setSearch(""); // Limpia busqueda
  }, [onSelect, setOpen, value]);
  return (
    <Popover {...{ open, onOpenChange: setOpen }}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            {...{
              id, disabled, value: selectedLabel, placeholder, readOnly: true
            }}
            className="w-full pr-10 cursor-pointer"
          />
          <ChevronsUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput {...{ disabled, value: search, onValueChange: setSearch, placeholder: "Buscar..." }} />
          <CommandList>
            {loading && <CommandEmpty>Cargando...</CommandEmpty>}
            {!loading && filteredOptions.length === 0 && (
              <CommandEmpty>No hay opciones.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map(opt => {
                const isSelected = String(value) === String(opt.id);
                return (
                  <CommandItem key={opt.id} value={opt.label} onSelect={() => handleSelect(opt.id)} >
                    {opt.label}
                    {isSelected && (
                      <CommandShortcut>
                        <CheckIcon className="w-4 h-4" />
                      </CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};