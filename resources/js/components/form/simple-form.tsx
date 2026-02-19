import { useEffect, useMemo, useState, useRef } from "react"
import { useForm, router } from "@inertiajs/react"
import InputError from "@/components/input-error"
import { SmartButton } from "@/components/smart-button"
import { Save, Edit, Trash } from "lucide-react"
import { FormField } from "@/components/form/form-fields"
import { getLista, getListaSync } from "@/hooks/use-listas-cache"
import axios from "axios"

const isCombobox = (f: any) => f?.type === "combobox"

const fieldCols = (w?: string) => {
  if (w === "1/2") return "col-span-12 md:col-span-6"
  if (w === "1/3") return "col-span-12 md:col-span-4"
  if (w === "1/4") return "col-span-12 md:col-span-3"
  return "col-span-12"
}

export const SimpleForm = ({ mode, endpoint, recordId, fields, extendedFields, ExtendedForm, open, onSuccess }: any) => {
  const safeFields = Array.isArray(fields) ? fields : []
  const MODE = {
    store: { submit: "Registrar", disabled: false, showSubmit: true, method: "post", icon: Save, className: "bg-blue-600 hover:bg-blue-700 text-white" },
    update: { submit: "Actualizar", disabled: false, showSubmit: true, method: "put", icon: Edit, className: "bg-green-600 hover:bg-green-700 text-white" },
    delete: { submit: "Eliminar", disabled: true, showSubmit: true, method: "delete", icon: Trash, className: "bg-red-600 hover:bg-red-700 text-white" },
    info: { submit: null, disabled: true, showSubmit: false, method: null },
  }[mode]

  const normalizedFields = useMemo(
    () => safeFields.map(f => ({ ...f, name: f.name ?? f.id, lista: isCombobox(f) ? f.name ?? f.id : f.lista })),
    [safeFields]
  )

  const initialData = useMemo(
    () => Object.fromEntries(normalizedFields.map(f => [f.name, f.value != null ? String(f.value) : f.default != null ? String(f.default) : ""])),
    [normalizedFields]
  )

  const form = useForm(initialData)
  const { data, setData, submit, processing, errors, reset } = form
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
  const [record, setRecord] = useState<any>(null)
  const [listsReady, setListsReady] = useState(false)
  const filledRef = useRef(false)

  useEffect(() => {
    if (!open) return
    setListsReady(false)
    filledRef.current = false
    const loadLists = async () => {
      await Promise.all(normalizedFields.filter(isCombobox).map(f => getLista(f.lista)))
      setListsReady(true)
    }
    loadLists()
  }, [open, normalizedFields])

  useEffect(() => {
    if (open && listsReady && mode === "store") reset(initialData)
  }, [open, listsReady, mode, initialData, reset])

  useEffect(() => {
    if (mode !== "store" && recordId && listsReady)
      axios.get(`${endpoint}/${recordId}`).then(res => setRecord(res.data))
  }, [mode, recordId, listsReady, endpoint])

  useEffect(() => {
    if (!record || !listsReady || filledRef.current) return
    filledRef.current = true
    normalizedFields.forEach(f => setData(f.name, record[f.name] != null ? String(record[f.name]) : ""))
  }, [record, listsReady, normalizedFields, setData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const hasFileOrRemove = Object.entries(data).some(([k, v]) => v instanceof File || k.endsWith("_remove"))
    const url = MODE.method === "post" ? endpoint : `${endpoint}/${recordId}`

    if (hasFileOrRemove) {
      const formData = new FormData()
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
      if (!token) return
      formData.append("_token", token)
      if (MODE.method !== "post") formData.append("_method", MODE.method)
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) formData.append(k, v instanceof File ? v : String(v))
      })
      router.post(url, formData, {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          reset()
          onSuccess?.()
        },
      })
      return
    }

    MODE.method && submit(MODE.method, url, {
      onFinish: () => {
        reset()
        onSuccess?.()
      },
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-x-4 gap-y-4 overflow-visible">
        {normalizedFields.map(f => {
          const lista = isCombobox(f) && getListaSync(f.lista)
          if (f.hidden)
            return <FormField key={f.name} id={f.name} type="hidden" value={data[f.name]} hidden onChange={v => setData(f.name, v)} />
          return (
            <div key={f.name} className={`overflow-visible ${fieldCols(f.width)}`}>
              <FormField
                id={f.name}
                label={f.label}
                type={f.type}
                value={data[f.name]}
                disabled={MODE.disabled}
                options={lista?.options ?? []}
                loading={!!lista?.loading}
                open={!!openMap[f.name]}
                setOpen={v => setOpenMap(p => ({ ...p, [f.name]: v }))}
                onChange={v => setData(f.name, v?.target ? v.target.value : v)}
                onSelect={id => {
                  setData(f.name, String(id))
                  setOpenMap(p => ({ ...p, [f.name]: false }))
                }}
                setData={setData}
                view={endpoint.split("/").pop()}
              />
              <InputError message={errors[f.name]} />
            </div>
          )
        })}

        {MODE.showSubmit && (
          <div className="col-span-12 flex justify-end">
            <SmartButton type="submit" icon={MODE.icon} disabled={processing} className={MODE.className} tooltip={MODE.submit} />
          </div>
        )}
      </form>

      {ExtendedForm && extendedFields && <ExtendedForm data={data} recordId={recordId} mode={mode} extendedFields={extendedFields} />}
    </div>
  )
}
