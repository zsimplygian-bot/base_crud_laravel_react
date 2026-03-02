import { useMemo, useCallback, useState, useEffect } from "react"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./command"
import { CheckIcon, RotateCcw } from "lucide-react"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { SmartButton } from "@/components/smart-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { FORM_CONFIG } from "@/config/forms"
import { getLista, getListaSync, resetLista } from "@/hooks/use-listas-cache"
export const Combobox = ({
  id, value, placeholder = "-", disabled, open: openProp, setOpen: setOpenProp, onSelect, lista, }: any) => {
  const [openInternal, setOpenInternal] = useState(false) // Estado interno
  const open = openProp ?? openInternal
  const setOpen = setOpenProp ?? setOpenInternal
  const [search, setSearch] = useState("")
  const [tick, setTick] = useState(0)
  const campoLista = useMemo(() => lista ?? id ?? null, [id, lista])
  const resolvedForm = useMemo(() => {
    if (!id) return null
    const key = id.startsWith("id_") ? id.slice(3) : id
    return FORM_CONFIG[key] ?? null
  }, [id])
  const listaCache = useMemo(
    () => (campoLista ? getListaSync(campoLista) : null),
    [campoLista, tick]
  )
  const { options = [], loading, loaded } = listaCache ?? {}
  useEffect(() => {
    if (!campoLista || loaded) return
    getLista(campoLista).then(() => setTick(t => t + 1))
  }, [campoLista, loaded])
  useEffect(() => {
    if (!open || !campoLista) return
    getLista(campoLista).then(() => setTick(t => t + 1))
  }, [open, campoLista])
  const selectedLabel = useMemo(() => {
    if (!value) return ""
    return options.find(o => String(o.id) === String(value))?.label ?? ""
  }, [options, value])
  const filteredOptions = useMemo(() => {
    if (!search) return options
    const s = search.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(s))
  }, [options, search])
  const handleSelect = useCallback((idSelected: any) => {
    onSelect(String(value) === String(idSelected) ? "" : idSelected)
    setOpen(false)
    setSearch("")
  }, [onSelect, setOpen, value])
  const handleRefresh = useCallback(async () => {
    if (!campoLista) return
    resetLista(campoLista)
    await getLista(campoLista, true)
    setTick(t => t + 1)
  }, [campoLista])
  return (
    <Popover { ...{ open, onOpenChange: setOpen } } modal={false}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input { ...{ id, disabled, value: selectedLabel, placeholder, readOnly: true } } />
          {value && resolvedForm && (
            <div
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-muted"
              onClick={e => e.stopPropagation()} // Evita abrir el popover
              onMouseDown={e => e.stopPropagation()} // Evita focus en CommandInput
            >
              <ActionButtons { ...{ row_id: value, view: resolvedForm.view, title: resolvedForm.title, icon: resolvedForm.icon, fields: resolvedForm.fields, eye: true, } } />
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-fit">
        <Command>
          <div className="inline-block">
            <div className="relative w-full p-1">
              <CommandInput { ...{ disabled, value: search, onValueChange: setSearch, placeholder: "Buscar...", } } className="w-full pr-20" />
              {resolvedForm && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <SmartButton { ...{ icons: RotateCcw, onClick: handleRefresh, tooltip: "Refrescar", className: "h-6 w-6 p-0", } } />
                  <NewRecordButton { ...{ view: resolvedForm.view, title: resolvedForm.title, fields: resolvedForm.fields, buttonClassName: "h-6 w-6 p-0", } } />
                </div>
              )}
            </div>
            <CommandList>
              {loading && !loaded && <CommandEmpty>Cargando...</CommandEmpty>}
              {!loading && filteredOptions.length === 0 && <CommandEmpty>No hay opciones.</CommandEmpty>}
              <CommandGroup>
                {filteredOptions.map(opt => {
                  const isSelected = String(value) === String(opt.id)
                  return (
                    <CommandItem key={opt.id} value={opt.label} onSelect={() => handleSelect(opt.id)} className="relative pr-6" >
                      {opt.label} {isSelected && <CheckIcon className="absolute right-1 h-4 w-4" />}
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