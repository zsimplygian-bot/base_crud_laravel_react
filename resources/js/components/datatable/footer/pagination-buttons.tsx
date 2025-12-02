// components/datatable/footer/pagination-buttons.tsx
import { useEffect } from "react"
import { SmartButton } from "@/components/smart-button"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { usePaginationButtons } from "@/hooks/datatable/footer/use-pagination-buttons"
import { cn } from "@/lib/utils"
const iconMap = {
  first: ChevronsLeft,
  previous: ChevronLeft,
  next: ChevronRight,
  last: ChevronsRight,
}
const tooltipMap = {
  first: "Primera página",
  previous: "Página anterior",
  next: "Página siguiente",
  last: "Última página",
}
export const PaginationButtons = ({
  totalRows,
  pageIndex,
  setPageIndex,
  pageSize,
  onTotalPages,
}: {
  totalRows: number
  pageIndex: number
  setPageIndex: (page: number) => void
  pageSize: number
  onTotalPages: (total: number) => void
}) => {
  const { totalPages, buttons } = usePaginationButtons(
    totalRows, pageIndex, setPageIndex, pageSize
    )
  useEffect(() => {
    onTotalPages(totalPages)
  }, [totalPages, onTotalPages])
  return (
    <div className="flex items-center gap-1">
      {buttons.map((btn, i) => {
        const Icon = iconMap[btn.type]
        return (
          <SmartButton
            key={i}
            icon={Icon}
            tooltip={tooltipMap[btn.type]}
            onClick={btn.goToPage}
            className={cn(
              "h-9 w-9", // Tu tamaño favorito: 36px circular
              btn.disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        )
      })}
    </div>
  )
}