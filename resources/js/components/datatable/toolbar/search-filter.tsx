import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon } from "lucide-react"
import { SmartDropdown } from "@/components/smart-dropdown"
import { useSearchFilter } from "@/hooks/datatable/toolbar/use-search-filter"
interface Column {
  header: string
  accessor: string
}
export function SearchFilter(props: {
  columns: Column[]
  localSelectedColumn: string | null
  setLocalSelectedColumn: (v: string | null) => void
  localSearchTerm: string
  setLocalSearchTerm: (v: string) => void
  onSearch: () => void
}) {
  const {
    inputRef,
    inputVisible,
    closeSearch,
    placeholder,
    menuItems,
    handleKeyDown
  } = useSearchFilter(props)
  // items sin SDItem — igual que ExportMenu
  const items = menuItems.map(m => ({
    label: m.label,
    icon: m.icon,
    action: m.action
  }))
  return (
    <div className="flex items-center gap-2 w-full">
      <SmartDropdown
        label="Buscar por"
        triggerIcon={SearchIcon}
        items={items}
      />
      {inputVisible && (
        <div className="relative w-40 md:w-36">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={props.localSearchTerm}
            onChange={e => props.setLocalSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm w-full"
          />
          {props.localSearchTerm && (
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <XIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}