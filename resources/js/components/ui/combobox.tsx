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

  // Resuelve la config del form desde id
  const resolvedForm = useMemo(() => {
    const key = id?.startsWith("id_") ? id.replace("id_", "") : id
    return FORM_CONFIG?.[key]
  }, [id])

  const selectedLabel = useMemo(() => {
    if (value === "" || value === null) return ""
    return options.find(o => String(o.id) === String(value))?.label ?? ""
  }, [options, value])

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const s = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(s))
  }, [options, search])

  const handleSelect = useCallback(
    (idSelected: any) => {
      onSelect(String(value) === String(idSelected) ? "" : idSelected)
      setOpen(false)
      setSearch("")
    },
    [onSelect, setOpen, value]
  )

  return (
    <>
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
              className="w-full pr-10 cursor-pointer"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full">
          <Command>
            <div className="relative flex items-center px-2 py-1">
              <CommandInput
                {...{
                  disabled,
                  value: search,
                  onValueChange: setSearch,
                  placeholder: "Buscar...",
                }}
                className="pr-10"
              />

              {/* NewRecordButton integrado dentro del input */}
              {resolvedForm && (
                <NewRecordButton
                  view={resolvedForm.view}
                  title={resolvedForm.title}
                  formFields={{ fields: resolvedForm.fields }}
                  disabled={false}
                  buttonClassName="h-7 w-7 p-0"
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
    </>
  )
}
