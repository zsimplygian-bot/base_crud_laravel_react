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
  if (!extended_form || !recordId || !view) return null

  // Resuelve los forms extendidos desde FORM_CONFIG usando solo strings
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

  // Un solo endpoint dinámico
  const fetchRecords = useCallback(() => {
    axios
      .get(`/api/${view}/${recordId}/records`)
      .then(r => setRecords(r.data?.data ?? []))
      .catch(() => {})
  }, [view, recordId])

  useEffect(fetchRecords, [fetchRecords])

  // Agrupa todos los registros por día
  const recordsByDay = useMemo(() => {
    const map: Record<string, any[]> = {}

    records.forEach(r => {
      const rawDate = r.fecha?.split(" ")[0] ?? r.created_at?.split("T")[0] // Quita hora en ambos casos
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
      if (!v) return null

      // Formato join para arrays
      if (f.format === "join" && Array.isArray(v)) {
        const text = v
          .map(item =>
            f.template.replace(
              /\{(\w+)\}/g,
              (_, k) => item[k] ?? ""
            )
          )
          .join(f.separator ?? ", ")

        return f.label ? `${f.label}: ${text}` : text
      }

      // Valor simple
      return f.label ? `${f.label}: ${v}` : v
    })
    .filter(Boolean)
    .join("\n")
  return (
    <div className="space-y-2">
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
                  onSuccess: fetchRecords,
                }}
              />
            )
          })}
        </div>
      )}

      <div className="space-y-3 pr-1 overflow-y-auto">
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
                            icon: isImage ? ImageIcon : FileText,
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
      extended_form: FORM_CONFIG[r._view]?.extended_form, // Solo si existe
      onSuccess: fetchRecords,
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