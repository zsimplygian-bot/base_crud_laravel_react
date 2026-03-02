import { memo, useCallback, useState, useEffect, useMemo } from "react"
import { SmartDropdown } from "@/components/smart-dropdown"
import { SmartButton } from "@/components/smart-button"
import { SearchIcon, Filter } from "lucide-react"
import { FormField } from "@/components/form/form-fields"
export const SearchFilter = memo(function SearchFilter({
  searchFields = [], visibleFields, setVisibleFields, values = {}, setValues, onApply, }) {
  const safeVisibleFields = Array.isArray(visibleFields) ? visibleFields : []
  const [draftValues, setDraftValues] = useState(values)
  useEffect(() => {
    setDraftValues(values)
  }, [values])
  const searchFieldsWithId = useMemo(
    () => [{ id: "id", label: "ID", type: "text" }, ...searchFields], [searchFields] )
  const toggleField = useCallback(
    (key, checked) => {
      setVisibleFields( checked ? [...safeVisibleFields, key] : safeVisibleFields.filter(v => v !== key) )
    }, [safeVisibleFields, setVisibleFields] )
  const items = useMemo( () =>
      searchFieldsWithId.map(({ id, label }) => {
        const key = id ?? label
        return {
          id: key,
          type: "checkbox",
          label: label.toUpperCase(),
          checked: safeVisibleFields.includes(key),
          onChange: v => toggleField(key, v),
        }
      }), [searchFieldsWithId, safeVisibleFields, toggleField] )
  const normalizeValue = e => e?.target?.value ?? e
  const applyFilters = useCallback(() => {
    const payload = {}
    safeVisibleFields.forEach(key => {
      if (draftValues[key] !== undefined && draftValues[key] !== "") {
        payload[key] = draftValues[key]
      }
    })
    if (typeof setValues === "function") setValues(draftValues)
    onApply(payload)
  }, [draftValues, safeVisibleFields, setValues, onApply])
  const isFilterDisabled = !safeVisibleFields.some(
    key => draftValues[key] !== undefined && draftValues[key] !== ""
  )
  return (
    <div className={`flex items-start ${safeVisibleFields.length > 0 ? "gap-2" : ""}`}>
      <SmartDropdown {...{ label: "Buscar por:", triggerIcon: SearchIcon, items, closeOnSelect: false, }} />
      {/* Scroll solo en X, Y libre, sin stacking context */}
      <div className="flex gap-2 max-w-[320px] md:max-w-full pt-2 overflow-x-auto overflow-y-visible">
        {safeVisibleFields.map(key => {
          const field = searchFieldsWithId.find(f => (f.id ?? f.label) === key)
          if (!field) return null
          return (
            <div key={key} className="flex-shrink-0 relative overflow-visible z-[30]">
              <FormField {...{ id: key, label: field.label, type: field.type, value: draftValues[key] ?? "",
                  onChange: e => setDraftValues(p => ({ ...p, [key]: normalizeValue(e) })),
                  onSelect: v => setDraftValues(p => ({ ...p, [key]: v })), }} />
            </div>
          )
        })}
      </div>
      {safeVisibleFields.length > 0 && (
        <SmartButton {...{ icons: Filter, tooltip: "Filtrar", onClick: applyFilters, disabled: isFilterDisabled, }} />
      )}
    </div>
  )
})