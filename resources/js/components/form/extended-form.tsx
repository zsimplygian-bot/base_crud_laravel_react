import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { FORM_CONFIG } from "@/config/forms"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { Textarea } from "@/components/ui/textarea"
import { SmartButton } from "@/components/smart-button"
import { FilePreviewDialog } from "@/components/file-preview-dialog"
import { Image as ImageIcon, FileText, Plus } from "lucide-react"

export const ExtendedForm = ({ extended_form, recordId, mode, view }) => {
  if (!view || !recordId || !Array.isArray(extended_form) || !extended_form.length) return null
  const blocks = useMemo(
    () =>
      extended_form
        .map(v => FORM_CONFIG[v])
        .filter(b => b?.view && Array.isArray(b.fields)),
    [extended_form]
  )

  const [records, setRecords] = useState<any[]>([])
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [openPreview, setOpenPreview] = useState(false)

  const fetchRecords = useCallback(() => {
    axios
      .get(`/api/${view}/${recordId}/records`)
      .then(r => setRecords(r.data?.data ?? []))
      .catch(() => {})
  }, [view, recordId])

  useEffect(fetchRecords, [fetchRecords])

  const recordsByDay = useMemo(() => {
    const map: Record<string, any[]> = {}

    records.forEach(r => {
      const rawDate = r.fecha?.split(" ")[0] ?? r.created_at?.split("T")[0]
      const day = rawDate ?? "unknown"
      map[day] ??= []

      const block = blocks.find(b => b.view === r._view)

      map[day].push({
        ...r,
        _title: block?.title ?? r._view,
        _view: r._view,
        _formFields: block?.fields ?? [],
        _displayFields: block?.recordFields?.length
          ? block.recordFields
          : block?.fields ?? [],
      })
    })

    return Object.keys(map)
      .sort((a, b) => +new Date(b) - +new Date(a))
      .map(day => ({ day, records: map[day] }))
  }, [records, blocks])

  const buildValue = r =>
  r._displayFields
    .map(f => {
      const v = r[f.id]

      if (v === null || v === undefined || v === "") return null // Campo vacío

      if (Array.isArray(v) && v.length === 0) return null // Array sin items

      if (f.format === "join" && Array.isArray(v)) {
        const text = v
          .map(item =>
            f.template.replace(/\{(\w+)\}/g, (_, k) => item?.[k] ?? "")
          )
          .filter(Boolean) // Elimina textos vacíos
          .join(f.separator ?? ", ")

        if (!text) return null // Si no generó texto

        return f.label ? `${f.label}: ${text}` : text
      }

      return f.label ? `${f.label}: ${v}` : v
    })
    .filter(Boolean) // Elimina null
    .join("\n") 
  return (
    <div className="space-y-2 max-h-[410px] overflow-y-auto pr-1">
      {mode === "update" && (
        <div className="flex flex-wrap gap-2">
          {blocks.map(b => {
            const idField = `id_${view}`

            return (
              <NewRecordButton
                key={b.view}
                {...{
                  view: b.view,
                  title: b.title,
                  icon: b.icon,
                  icons: [Plus, b.icon].filter(Boolean),
                  fields: b.fields.map(f =>
                    f.id === idField
                      ? { ...f, value: recordId }
                      : f
                  ),
                  size: "sm",
                  onSuccess: fetchRecords,
                }}
              />
            )
          })}
        </div>
      )}

      <div className="space-y-3">
        {!recordsByDay.some(d => d.records.length) && (
          <div className="text-xs italic text-muted-foreground">
            Sin información adicional
          </div>
        )}

        {recordsByDay.map(({ day, records }) => (
          <div key={day}>
            <div className="text-sm font-medium text-muted-foreground">
              {day}
            </div>

            {records.map((r, i) => {
              const row_id = r[`id_${r._view}`]
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(
                r.archivo ?? ""
              )
              const value = buildValue(r)

              return (
                <div key={`${r._view}-${row_id ?? i}`} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span>{r._title}</span>

                    <div className="flex gap-1">
                      {r.archivo && (
                        <SmartButton
                          {...{
                            icons: isImage ? ImageIcon : FileText,
                            variant: "ghost",
                            onClick: () => {
                              setPreviewFile(r.archivo)
                              setOpenPreview(true)
                            },
                          }}
                        />
                      )}

                      {mode === "update" && row_id && (
                        <ActionButtons
                          {...{
                            row_id,
                            view: r._view,
                            title: r._title,
                            fields: r._formFields,
                            extended_form: FORM_CONFIG[r._view]?.extended_form,
                            onSuccess: fetchRecords,
                            size: "sm",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {value && (
                    <Textarea
                      {...{
                        readOnly: true,
                        value,
                        rows: 4,
                        className: "resize-none bg-muted",
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <FilePreviewDialog
        {...{
          open: openPreview,
          onOpenChange: setOpenPreview,
          file: previewFile,
        }}
      />
    </div>
  )
}