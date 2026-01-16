import { memo, useCallback, useState, useEffect, useMemo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartButton } from "@/components/smart-button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { FormField } from "@/components/form/form-fields";
import { getLista, getListaSync } from "@/hooks/use-listas-cache";

export const SearchFilter = memo(function SearchFilter({
  searchFields = [],
  visibleFields,
  setVisibleFields,
  values,
  setValues,
  onApply
}) {
  const safeVisibleFields = Array.isArray(visibleFields) ? visibleFields : [];
  const [draftValues, setDraftValues] = useState(values);
  useEffect(() => setDraftValues(values), [values]);

  const searchFieldsWithId = useMemo(
    () => [{ id: "id", label: "ID", type: "text" }, ...searchFields],
    [searchFields]
  );

  // Preload combobox lists
  useEffect(() => {
    safeVisibleFields.forEach(key => {
      const field = searchFieldsWithId.find(f => (f.id ?? f.label) === key);
      if (field?.type === "combobox") getLista(key);
    });
  }, [safeVisibleFields, searchFieldsWithId]);

  const toggleField = useCallback((key, checked) => {
    setVisibleFields(
      checked
        ? [...safeVisibleFields, key]
        : safeVisibleFields.filter(v => v !== key)
    );
  }, [safeVisibleFields, setVisibleFields]);

  const items = useMemo(
    () => searchFieldsWithId.map(({ id, label }) => {
      const key = id ?? label;
      return {
        id: key,
        type: "checkbox",
        label: label.toUpperCase(),
        checked: safeVisibleFields.includes(key),
        onChange: v => toggleField(key, v),
      };
    }),
    [searchFieldsWithId, safeVisibleFields, toggleField]
  );

  const normalizeValue = e => e?.target?.value ?? e;

  const applyFilters = useCallback(() => {
    const payload = {};
    safeVisibleFields.forEach(key => {
      if (draftValues[key] !== undefined && draftValues[key] !== "") {
        payload[key] = draftValues[key];
      }
    });
    setValues(draftValues);
    onApply(payload);
  }, [draftValues, safeVisibleFields, setValues, onApply]);

  // Habilita si al menos un campo visible tiene valor
  const isFilterDisabled = !safeVisibleFields.some(
    key => draftValues[key] !== undefined && draftValues[key] !== ""
  );

  return (
    <div className={`flex items-start ${safeVisibleFields.length > 0 ? "gap-2" : ""}`}>
      <SmartDropdown
        {...{
          label: "Buscar por",
          triggerIcon: SearchIcon,
          items,
          closeOnSelect: false,
        }}
      />
      <div className="overflow-x-auto flex gap-2 max-w-[320px] md:max-w-full pt-1">
        {safeVisibleFields.map(key => {
          const field = searchFieldsWithId.find(f => (f.id ?? f.label) === key);
          if (!field) return null;
          const cache = getListaSync(key);
          return (
            <div key={key} className="flex-shrink-0 overflow-visible">
              <FormField
                {...{
                  id: key,
                  label: field.label,
                  type: field.type,
                  value: draftValues[key] ?? "",
                  options: cache?.options ?? [],
                  loading: !!cache?.loading,
                  onChange: e =>
                    setDraftValues(p => ({ ...p, [key]: normalizeValue(e) })),
                  onSelect: v => setDraftValues(p => ({ ...p, [key]: v })),
                }}
              />
            </div>
          );
        })}
      </div>
      {safeVisibleFields.length > 0 && (
        <SmartButton
          {...{
            icon: FilterIcon,
            tooltip: "Filtrar",
            onClick: applyFilters,
            disabled: isFilterDisabled,
          }}
        />
      )}
    </div>
  );
});
