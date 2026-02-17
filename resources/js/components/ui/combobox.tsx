import { useMemo, useCallback, useState } from "react"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "./command"
import { CheckIcon } from "lucide-react"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { FORM_CONFIG } from "@/config/forms"

export const Combobox = ({
  id,
  value,
  placeholder = "-",
  disabled,
  open,
  setOpen,
  options = [],
  loading,
  onSelect,
}) => {
  const [search, setSearch] = useState("")

  // Resuelve el form exacto desde el id del campo
  const resolvedForm = useMemo(() => {
    if (!id) return null
    const key = id.startsWith("id_") ? id.slice(3) : id
    return FORM_CONFIG[key] ?? null
  }, [id])

  const selectedLabel = useMemo(() => {
    if (value === "" || value == null) return ""
    return options.find(o => String(o.id) === String(value))?.label ?? ""
  }, [options, value])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const s = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(s))
  }, [options, search])

  const handleSelect = useCallback(
    idSelected => {
      onSelect(String(value) === String(idSelected) ? "" : idSelected)
      setOpen(false)
      setSearch("")
    },
    [onSelect, setOpen, value]
  )

  return (
    <Popover {...{ open, onOpenChange: setOpen }} modal={false}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            {...{
              id,
              disabled,
              value: selectedLabel,
              placeholder,
              readOnly: true,
            }}
            className="w-full cursor-pointer"
          />
        </div>
      </PopoverTrigger>

      {/* Sin ancho fijo */}
      <PopoverContent className="p-0">
        <Command>
          <div className="flex items-center px-2 py-1 gap-1">
            <CommandInput
              {...{
                disabled,
                value: search,
                onValueChange: setSearch,
                placeholder: "Buscar...",
              }}
            />

            {resolvedForm && (
              <NewRecordButton
                {...{
                  view: resolvedForm.view,
                  title: resolvedForm.title,
                  fields: resolvedForm.fields,
                }}
              />
            )}
          </div>

          <CommandList>
            {loading && <CommandEmpty>Cargando...</CommandEmpty>}

            {!loading && filteredOptions.length === 0 && (
              <CommandEmpty>No hay opciones.</CommandEmpty>
            )}

            <CommandGroup>
              {filteredOptions.map(opt => {
                const isSelected = String(value) === String(opt.id)
                return (
                  <CommandItem
                    key={opt.id}
                    value={opt.label}
                    onSelect={() => handleSelect(opt.id)}
                  >
                    {opt.label}
                    {isSelected && (
                      <CommandShortcut>
                        <CheckIcon className="w-4 h-4" />
                      </CommandShortcut>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
