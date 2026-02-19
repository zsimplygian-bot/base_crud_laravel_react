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
        <div className="w-full">
          <Input
            {...{
              id,
              disabled,
              value: selectedLabel,
              placeholder,
              readOnly: true,
            }}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-fit">
  <Command>
    <div className="inline-block">
      {/* Header */}
      <div className="relative w-full p-1">
        <CommandInput
          {...{
            disabled,
            value: search,
            onValueChange: setSearch,
            placeholder: "Buscar...",
          }}
          className="w-full pr-9"
        />

        {resolvedForm && (
          <NewRecordButton
            {...{
              view: resolvedForm.view,
              title: resolvedForm.title,
              fields: resolvedForm.fields,
              buttonClassName:
                "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0",
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
                className="relative pr-6"
              >
                {opt.label}
                {isSelected && (
                  <CheckIcon className="absolute right-1 h-4 w-4" />
                )}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </div>
  </Command>
</PopoverContent>

    </Popover>
  )
}
