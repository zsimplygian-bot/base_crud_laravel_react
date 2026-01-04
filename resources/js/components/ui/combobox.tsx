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
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";

export const Combobox = ({
  id,
  value,
  placeholder,
  disabled,
  open,
  setOpen,
  options,
  selectedLabel,
  onSelect,
}) => {
  const handleSelect = idSelected => {
    if (String(value) === String(idSelected)) {
      onSelect(""); // Deselecciona si vuelve a hacer click
    } else {
      onSelect(idSelected); // Seleccion normal
    }
    setOpen(false); // Cierra siempre
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              id={id}
              readOnly
              disabled={disabled}
              placeholder={placeholder ?? "-"} // Usa placeholder o "-"
              value={selectedLabel}
              className="w-full pr-10 cursor-pointer"
            />
            <ChevronsUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Command>
            <CommandInput placeholder="Buscar..." disabled={disabled} />
            <CommandList>
              {options.length === 0 && (
                <CommandEmpty>No hay opciones disponibles.</CommandEmpty>
              )}
              <CommandGroup>
                {options.map(opt => {
                  const isSelected = String(value) === String(opt.id);
                  return (
                    <CommandItem
                      key={opt.id}
                      value={opt.label.toLowerCase()}
                      onSelect={() => handleSelect(opt.id)}
                    >
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
    </div>
  );
};
