import { useMemo, useCallback, useState, useEffect } from "react"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./command"
import { CheckIcon, RotateCcw, EyeIcon } from "lucide-react"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
import { FORM_CONFIG } from "@/config/forms"
import { getLista, getListaSync, resetLista } from "@/hooks/use-listas-cache"
export const Combobox = ({ id, value, placeholder = "-", disabled, open, setOpen, onSelect, lista, }: any) => {
  const [search, setSearch] = useState("")
  const [tick, setTick] = useState(0) // Fuerza re-render cuando cambia cache
  const [openDetail, setOpenDetail] = useState(false) // Modal detalle
  const resolvedForm = useMemo(() => {
    if (!id) return null
    const key = id.startsWith("id_") ? id.slice(3) : id
    return FORM_CONFIG[key] ?? null
  }, [id])
  const campoLista = useMemo(() => lista ?? id ?? null, [id, lista])
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
    resetLista(campoLista) // Limpia cache
    await getLista(campoLista, true) // Fuerza fetch
    setTick(t => t + 1)
  }, [campoLista])
  const showEye = !!resolvedForm // Siempre visible si existe config
  return (
    <>
      <Popover {...{ open, onOpenChange: setOpen }} modal={false}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input {...{ id, disabled, value: selectedLabel, placeholder, readOnly: true }} />
            {showEye && (
              <SmartButton {...{ icon: EyeIcon, tooltip: value ? "Ver detalle" : "Seleccione un registro", variant: "ghost",
                  disabled: !value, className: "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0",
                  onClick: e => { e.stopPropagation() // Evita abrir el popover
                    if (!value) return setOpenDetail(true) } }} />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit">
          <Command>
            <div className="inline-block">
              <div className="relative w-full p-1">
                <CommandInput {...{ disabled, value: search, onValueChange: setSearch, placeholder: "Buscar..."
                  }} className="w-full pr-20" />
                {resolvedForm && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <SmartButton {...{ icon: RotateCcw, onClick: handleRefresh, tooltip: "Refrescar", className: "h-6 w-6 p-0", }} />
                    <NewRecordButton
                      {...{ view: resolvedForm.view, title: resolvedForm.title, fields: resolvedForm.fields,
                        buttonClassName: "h-6 w-6 p-0", }} />
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
                        {opt.label}
                        {isSelected && <CheckIcon className="absolute right-1 h-4 w-4" />}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      {openDetail && resolvedForm && (
        <SmartModal {...{ type: "sheet", open: openDetail, onOpenChange: setOpenDetail, title: `Detalle ${resolvedForm.title}`, size: "w-[90%] sm:w-[450px]" }} >
          <SimpleForm {...{ mode: "info", endpoint: `/${resolvedForm.view}`, recordId: value, fields: resolvedForm.fields,
              open: openDetail, onSuccess: () => setOpenDetail(false) }} />
        </SmartModal>
      )}
    </>
  )
}