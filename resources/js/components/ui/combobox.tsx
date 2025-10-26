import { useState, useCallback, useMemo } from "react";
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
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
// Hook para controlar la lógica del botón crear
export function useCreateButtonLink() {
  const fieldsWithCreateButton = useMemo(() => {
    return [
      "id_cliente",
      "id_mascota",
      "id_raza",
      "id_especie",
      "id_motivo_historia_clinica",
      "id_motivo_cita",
      "id_procedimiento",
      "id_medicamento",
    ];
  }, []);
  const shouldRenderCreateButton = (fieldKey: string) =>
    fieldsWithCreateButton.includes(fieldKey);
  const getCreateLink = (fieldKey: string) => {
    const key = fieldKey.replace(/^id_/, "");
    const special = ["especie", "motivo_cita", "motivo_historia_clinica"];
    if (special.includes(key)) {
      return `/itemsimple/form/create?tipo=${key}`;
    }
    return `/${key}/form/create`;
  };
  return {
    shouldRenderCreateButton,
    getCreateLink,
  };
}
interface ComboboxProps {
  value: string;
  fieldKey: string;
  options: { id: string | number; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
}
export const Combobox: React.FC<ComboboxProps> = ({
  value,
  fieldKey,
  options,
  disabled,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const { shouldRenderCreateButton, getCreateLink } = useCreateButtonLink();

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
      setOpen(false);
    },
    [onChange]
  );
  const selectedLabel = useMemo(
    () => options.find((opt) => opt.id.toString() === value)?.label || "",
    [options, value]
  );
  const commandFilter = useCallback(
    (itemValue: string, search: string) => {
      if (!search) return 1;
      const option = options.find((opt) => opt.id.toString() === itemValue);
      return option?.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
    },
    [options]
  );
  return (
    <div className="flex w-full items-center gap-2">
      <Popover open={open} onOpenChange={setOpen} className="flex-1">
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              readOnly
              disabled={disabled}
              placeholder={placeholder || "-"}
              value={selectedLabel}
              className="w-full pr-10 cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ChevronsUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full">
          <Command filter={commandFilter}>
            <div className="flex items-center justify-between gap-2 px-2">
              <CommandInput placeholder="Buscar..." disabled={disabled} className="flex-1" />
              {shouldRenderCreateButton(fieldKey) && (
                <Link
                  href={getCreateLink(fieldKey)}
                  className="flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  title="Agregar nuevo"
                >
                  <PlusIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
            <CommandList>
              <CommandEmpty>No hay opciones disponibles.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.id.toString()}
                    onSelect={handleSelect}
                    className="text-left"
                  >
                    {opt.label}
                    {value === opt.id.toString() && <CommandShortcut>✓</CommandShortcut>}
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