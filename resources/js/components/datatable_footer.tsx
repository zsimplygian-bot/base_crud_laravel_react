import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { FormFieldsRenderer } from "@/components/form-fields"
interface DataTableFooterProps {
  pageIndex: number
  setPageIndex: (index: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  totalRows: number
  view: string
  data?: Record<string, any>[]
  footerFields?: Record<string, any>
  isMobile?: boolean
}
export const DataTableFooter: React.FC<DataTableFooterProps> = ({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  totalRows,
  data = [],
  footerFields,
  isMobile = false,
}) => {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRows / pageSize)),
    [totalRows, pageSize]
  )
  const acumulado = useMemo(() => {
    if (!footerFields || !data.length) return {}
    return Object.keys(footerFields).reduce((acc, key) => {
      const sum = data.reduce((total, row) => {
        const val = parseFloat(row[key])
        return isNaN(val) ? total : total + val
      }, 0)
      acc[key] = sum
      return acc
    }, {} as Record<string, number>)
  }, [data, footerFields])
  const formData = useMemo(() => {
    const result: Record<string, string> = {}
    if (footerFields)
      for (const key in footerFields)
        result[key] = acumulado[key]
          ? `S/. ${acumulado[key].toFixed(1)}`
          : ""
    return result
  }, [acumulado, footerFields])
  const nav = [
    { icon: <ChevronsLeftIcon />, fn: () => setPageIndex(0), disable: pageIndex === 0 },
    { icon: <ChevronLeftIcon />, fn: () => setPageIndex(p => Math.max(p - 1, 0)), disable: pageIndex === 0 },
    { icon: <ChevronRightIcon />, fn: () => setPageIndex(p => Math.min(p + 1, totalPages - 1)), disable: pageIndex >= totalPages - 1 },
    { icon: <ChevronsRightIcon />, fn: () => setPageIndex(totalPages - 1), disable: pageIndex >= totalPages - 1 },
  ]
  const pageSizes = [10, 25, 50, 100, 250, 1000]
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
    {/* Footer con acumulados */}
      {footerFields && Object.keys(footerFields).length > 0 && data.length > 0 ? (
        <div className="relative w-full sm:max-w-[65%] overflow-x-auto">
          <div className="p-2 pl-1 rounded-lg shadow-md z-1 relative sm:-ml-1">
            <FormFieldsRenderer
              formFields={footerFields}
              data={formData}
              setData={() => {}}
              errors={{}}
              readonly
              configReadonly
              hiddenFields={[]}
              isMobile={isMobile}
            />
          </div>
        </div>
      ) : null}
      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm w-full sm:w-auto">
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2">
            <span>Filas:</span>
            <Select
              value={String(pageSize)}
              onValueChange={v => {
                setPageSize(Number(v))
                setPageIndex(0)
              }}
            >
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue>{pageSize}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pageSizes.map(s => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            {nav.map((n, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-8 w-8 p-0 border border-input"
                onClick={n.fn}
                disabled={n.disable}
              >
                {n.icon}
              </Button>
            ))}
          </div>
            <div className="text-center sm:text-right w-full sm:w-auto">
            Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
            <span className="font-medium">{totalPages}</span>
            <br />
            <span className="font-medium">{totalRows}</span> registros
          </div>
        </div>
      </div>
    </div>
  )
}