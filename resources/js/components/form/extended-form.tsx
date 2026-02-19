import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { Textarea } from "@/components/ui/textarea"
import { SmartButton } from "@/components/smart-button"
import { FilePreviewDialog } from "@/components/file-preview-dialog"
import { Image as ImageIcon, FileText, Plus, ClipboardList, Syringe, Stethoscope } from "lucide-react"
export const VIEW_CONFIG = {
  historia_clinica_seguimiento: { key: "seguimientos", className: "bg-gray-700 hover:bg-gray-800 text-white", icons: [Plus, ClipboardList] },
  historia_clinica_producto: { key: "productos", className: "bg-green-700 hover:bg-green-800 text-white", icons: [Plus, Syringe] },
  historia_clinica_procedimiento: { key: "procedimientos", className: "bg-blue-700 hover:bg-blue-800 text-white", icons: [Plus, Stethoscope] },
  historia_clinica_anamnesis: { key: "anamnesis", className: "bg-red-700 hover:bg-red-800 text-white", icons: [Plus, FileText] },
}
export const ExtendedForm = ({ extendedFields, recordId, mode }) => {
  if (!extendedFields || !recordId) return null
  const blocks = useMemo(() => Object.values(extendedFields).filter(b => b?.view && Array.isArray(b.fields)), [extendedFields])
  const [recordsMap, setRecordsMap] = useState({})
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [openPreview, setOpenPreview] = useState(false)
  const fetchRecords = useCallback(() => {
    if (!blocks.length) return
    axios.get(`/api/historia/${recordId}/records`).then(r => setRecordsMap(r.data?.data ?? {})).catch(() => {})
  }, [blocks.length, recordId])
  useEffect(fetchRecords, [fetchRecords])
  const recordsByDay = useMemo(() => {
    const map: any = {}
    blocks.forEach(b =>
      (recordsMap[VIEW_CONFIG[b.view]?.key] ?? []).forEach(r => {
        const day = r.fecha?.split(" ")[0] ?? "unknown"
        ;(map[day] ??= []).push({
          ...r,
          _title: b.title,
          _view: b.view,
          _formFields: b.fields,
          _displayFields: b.recordFields?.length ? b.recordFields : b.fields,
        })
      })
    )
    return Object.keys(map).sort((a, b) => +new Date(b) - +new Date(a)).map(day => ({ day, records: map[day] }))
  }, [blocks, recordsMap])
  const buildValue = r => r._displayFields.map(f => r[f.id] ? (f.label ? `${f.label}: ${r[f.id]}` : r[f.id]) : null).filter(Boolean).join("\n")
  return (
    <div className="space-y-2">
      {mode === "update" && (
        <div className="flex flex-wrap gap-2">
          {blocks.map(b => {
            const cfg = VIEW_CONFIG[b.view] ?? {}
            return (
              <NewRecordButton
                key={b.view}
                {...{
                  view: b.view,
                  title: b.title,
                  icons: cfg.icons,
                  buttonClassName: cfg.className,
                  fields: b.fields.map(f => f.id === "id_historia_clinica" ? { ...f, value: recordId } : f),
                  onSuccess: fetchRecords,
                }}
              />
            )
          })}
        </div>
      )}
      <div className="space-y-3 pr-1 overflow-y-auto">
        {!recordsByDay.some(d => d.records.length) && (
          <div className="text-xs italic text-muted-foreground">Sin información adicional</div>
        )}
        {recordsByDay.map(({ day, records }) => (
          <div key={day}>
            <div className="text-sm font-medium text-muted-foreground">{day}</div>
            {records.map((r, i) => {
              const row_id = r[`id_${r._view}`]
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(r.archivo ?? "")
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
                            onClick: () => { setPreviewFile(r.archivo); setOpenPreview(true) },
                          }}
                        />
                      )}
                      {mode === "update" && row_id && (
                        <ActionButtons {...{ row_id, view: r._view, title: r._title, fields: r._formFields, onSuccess: fetchRecords }} />
                      )}
                    </div>
                  </div>
                  {value && <Textarea {...{ readOnly: true, value, rows: 4, className: "resize-none bg-muted" }} />}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <FilePreviewDialog {...{ open: openPreview, onOpenChange: setOpenPreview, file: previewFile }} />
    </div>
  )
}