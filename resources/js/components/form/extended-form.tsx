import { useEffect, useMemo, useState, useCallback } from "react"
import axios from "axios"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { Textarea } from "@/components/ui/textarea"
import { SmartButton } from "@/components/smart-button"
import { FilePreviewDialog } from "@/components/file-preview-dialog"
import { Image as ImageIcon, FileText } from "lucide-react"

export const ExtendedForm = ({ extendedFields, recordId, mode }) => {
  if (!extendedFields || !recordId) return null

  const VIEW_TO_KEY = {
    historia_clinica_seguimiento: "seguimientos",
    historia_clinica_producto: "productos",
    historia_clinica_procedimiento: "procedimientos",
    historia_clinica_anamnesis: "anamnesis",
  }

  // Bloques válidos desde config
  const blocks = useMemo(
    () =>
      Object.values(extendedFields).filter(
        b => b && typeof b === "object" && b.view && Array.isArray(b.fields)
      ),
    [extendedFields]
  )

  const [recordsMap, setRecordsMap] = useState({})
  const [previewFile, setPreviewFile] = useState(null)
  const [openPreview, setOpenPreview] = useState(false)

  const fetchRecords = useCallback(() => {
    if (!blocks.length) return
    axios
      .get(`/api/historia/${recordId}/records`)
      .then(r => setRecordsMap(r.data?.data ?? {}))
      .catch(() => {})
  }, [blocks.length, recordId])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // Mantiene exactamente el comportamiento correcto de records
  const recordsByDay = useMemo(() => {
    const dayMap = {}

    blocks.forEach(block => {
      const key = VIEW_TO_KEY[block.view]
      ;(recordsMap[key] ?? []).forEach(record => {
        const day = record.fecha
          ? String(record.fecha).split(" ")[0]
          : "unknown"

        if (!dayMap[day]) dayMap[day] = []

        dayMap[day].push({
          ...record,
          _title: block.title,
          _view: block.view,
          _formFields: block.fields,
          _displayFields: block.recordFields?.length
            ? block.recordFields
            : block.fields,
        })
      })
    })

    return Object.keys(dayMap)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(day => ({ day, records: dayMap[day] }))
  }, [blocks, recordsMap])

  const buildTextareaValue = record =>
    record._displayFields
      .map(f => {
        const val = record[f.id]
        return val != null && val !== ""
          ? f.label
            ? `${f.label}: ${val}`
            : String(val)
          : null
      })
      .filter(Boolean)
      .join("\n")

  const hasRecords = recordsByDay.some(d => d.records.length > 0)

  return (
    <div className="space-y-2">
      {/* NEW RECORD BUTTONS – MISMO PATRÓN QUE ACTIONBUTTONS */}
      {mode === "update" && blocks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {blocks.map(block => (
            <NewRecordButton
              key={block.view}
              {...{
                view: block.view,
                title: block.title,
                fields: block.fields.map(f =>
                  f.id === "id_historia_clinica"
                    ? { ...f, value: recordId } // Inyecta FK
                    : f
                ),
                onSuccess: fetchRecords,
              }}
            />
          ))}
        </div>
      )}

      <div className="overflow-y-auto space-y-3 pr-1">
        {!hasRecords && (
          <div className="text-xs italic text-muted-foreground">
            Sin información adicional
          </div>
        )}

        {recordsByDay.map(({ day, records }) => (
          <div key={day}>
            <div className="text-xs font-medium text-muted-foreground">
              {day}
            </div>

            {records.map((record, i) => {
              const value = buildTextareaValue(record)
              const row_id = record[`id_${record._view}`]
              const isImage =
                record.archivo &&
                /\.(jpg|jpeg|png|webp|gif)$/i.test(record.archivo)

              return (
                <div
                  key={`${record._view}-${row_id ?? i}`}
                  className="space-y-1"
                >
                  <div className="text-xs font-medium flex justify-between items-center">
                    <span>{record._title}</span>

                    <div className="flex items-center gap-1">
                      {record.archivo && (
                        <SmartButton
                          {...{
                            icon: isImage ? ImageIcon : FileText,
                            variant: "ghost",
                            onClick: () => {
                              setPreviewFile(record.archivo)
                              setOpenPreview(true)
                            },
                          }}
                        />
                      )}

                      {mode === "update" && row_id && (
                        <ActionButtons
                          {...{
                            row_id,
                            view: record._view,
                            title: record._title,
                            fields: record._formFields,
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
                        className: "resize-none bg-muted overflow-y-auto",
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
