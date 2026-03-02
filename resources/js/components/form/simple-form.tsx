import { useEffect, useMemo, useState } from "react"
import { useForm, router } from "@inertiajs/react"
import InputError from "@/components/input-error"
import { SmartButton } from "@/components/smart-button"
import { Save, Edit, Trash } from "lucide-react"
import { FormField } from "@/components/form/form-fields"
import axios from "axios"

export const SimpleForm = ({
  mode, endpoint, recordId, fields, extended_form, ExtendedForm, open, onSuccess,
}: any) => {
  const safeFields: any[] = Array.isArray(fields) ? fields : []

  const MODE: any = {
    store: { submit: "Registrar", disabled: false, showSubmit: true, method: "post", icon: Save, className: "bg-blue-600 hover:bg-blue-700 text-white" },
    update: { submit: "Actualizar", disabled: false, showSubmit: true, method: "put", icon: Edit, className: "bg-green-600 hover:bg-green-700 text-white" },
    delete: { submit: "Eliminar", disabled: true, showSubmit: true, method: "delete", icon: Trash, className: "bg-red-600 hover:bg-red-700 text-white" },
    info: { submit: null, disabled: true, showSubmit: false, method: null },
  }[mode]

  const normalizedFields = useMemo(
    () => safeFields.map(f => ({ ...f, name: f.name ?? f.id })),
    [safeFields]
  )

  const initialData = useMemo(
    () =>
      Object.fromEntries(
        normalizedFields.map(f => [
          f.name,
          f.value != null ? String(f.value) : f.default != null ? String(f.default) : "",
        ])
      ),
    [normalizedFields]
  )

  const form = useForm(initialData)
  const { data, setData, submit, processing, errors, reset } = form
  const [record, setRecord] = useState<any>(null)
  const view: string | undefined = endpoint?.split("/").pop()

  useEffect(() => {
    if (mode !== "store" && recordId) {
      axios.get(`${endpoint}/${recordId}`).then(r => setRecord(r.data))
    }
  }, [mode, recordId, endpoint])

  useEffect(() => {
    if (!record) return
    normalizedFields.forEach(f =>
      setData(f.name, record[f.name] != null ? String(record[f.name]) : "")
    )
  }, [record, normalizedFields, setData])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const hasFile: boolean = Object.entries(data).some(
      ([k, v]) => v instanceof File || k.endsWith("_remove")
    )

    const url: string = MODE.method === "post" ? endpoint : `${endpoint}/${recordId}`

    if (!hasFile) {
      if (MODE.method)
        submit(MODE.method, url, {
          onSuccess: () => {
            reset()
            onSuccess?.() // ✅ solo aquí se cierra el modal
          },
        })
      return
    }

    const formData = new FormData()
    const token: string | null = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content")

    if (!token) return

    formData.append("_token", token)
    if (MODE.method !== "post") formData.append("_method", MODE.method)

    Object.entries(data).forEach(
      ([k, v]) => v != null && formData.append(k, v instanceof File ? v : String(v))
    )

    router.post(url, formData, {
  forceFormData: true,
  preserveState: true,   // 🔥 CLAVE
  preserveScroll: true,  // 🔥 CLAVE
  onSuccess: () => {
    reset()
    onSuccess?.()
  },
})
  }

  const getColClass = (width?: string) => {
    if (!width) return "col-span-12"
    if (width === "1/2") return "col-span-6"
    if (width === "1/3") return "col-span-4"
    if (width === "1/4") return "col-span-3"
    return "col-span-12"
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-x-4 gap-y-4">
        {normalizedFields.map(f => (
          <div key={f.name} className={getColClass(f.width)}>
            <FormField
              {...{
                ...f,
                value: data[f.name],
                disabled: MODE.disabled,
                onChange: (v: any) => setData(f.name, v?.target ? v.target.value : v),
                onSelect: (id: any) => setData(f.name, String(id)),
                setData,
                view,
              }}
            />
            {errors[f.name] && <InputError message={errors[f.name]} />}
          </div>
        ))}

        {MODE.showSubmit && (
          <div className="col-span-12 flex justify-end">
            <SmartButton
              {...{
                icons: MODE.icon,
                disabled: processing,
                className: MODE.className,
                tooltip: MODE.submit,
                ...(mode === "delete"
                  ? {
                      onClick: handleSubmit,
                      confirmation: {
                        title: "Confirmar eliminación",
                        description: "Esta acción eliminará el registro permanentemente.",
                      },
                    }
                  : { type: "submit" }),
              }}
            />
          </div>
        )}
      </form>

      {ExtendedForm && extended_form && (
        <ExtendedForm {...{ view, data, recordId, mode, extended_form }} />
      )}
    </div>
  )
}