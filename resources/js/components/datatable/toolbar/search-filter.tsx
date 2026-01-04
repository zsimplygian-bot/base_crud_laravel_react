import { memo, useCallback, useState, useEffect, useMemo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartButton } from "@/components/smart-button";
import { SearchIcon, FilterIcon } from "lucide-react";
import { FormField } from "@/components/form/form-fields";

interface SearchFilterProps {
  searchFields: Array<{ id?: string; label: string; type?: string }>;
  visibleFields: string[];
  setVisibleFields: (v: string[]) => void;
  values: Record<string, string>;
  setValues: (v: Record<string, string>) => void;
  onApply: (filters: Record<string, string>) => void;
}

const optionsCache: Record<string, { loading?: boolean; loaded?: boolean; options?: any[] }> = {};

export const SearchFilter = memo(function SearchFilter({
  searchFields = [],
  visibleFields,
  setVisibleFields,
  values,
  setValues,
  onApply
}: SearchFilterProps) {

  const safeVisibleFields = Array.isArray(visibleFields) ? visibleFields : [];

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [draftValues, setDraftValues] = useState<Record<string, string>>(values);

  useEffect(() => setDraftValues(values), [values]);

  const searchFieldsWithId = useMemo(
    () => [{ id: "id", label: "ID", type: "text" }, ...searchFields],
    [searchFields]
  );

  // ✅ Setter directo, sin funciones
  const toggleField = useCallback((key: string, checked: boolean) => {
    const next = checked
      ? [...safeVisibleFields, key]
      : safeVisibleFields.filter(v => v !== key);
    setVisibleFields(next);
  }, [safeVisibleFields, setVisibleFields]);

  const items = useMemo(() =>
    searchFieldsWithId.map(({ id, label }) => {
      const key = id ?? label;
      return {
        id: key,
        type: "checkbox" as const,
        label: label.toUpperCase(),
        checked: safeVisibleFields.includes(key),
        onChange: (v: boolean) => toggleField(key, v)
      };
    }),
    [searchFieldsWithId, safeVisibleFields, toggleField]
  );

  useEffect(() => {
    safeVisibleFields.forEach(async key => {
      const field = searchFieldsWithId.find(f => (f.id ?? f.label) === key);
      if (!field || field.type !== "combobox") return;
      if (optionsCache[key]?.loaded || optionsCache[key]?.loading) return;

      optionsCache[key] = { loading: true };
      const res = await fetch(`/api/listas?campo=${key}`);
      const json = await res.json();
      optionsCache[key] = { loaded: true, options: json.data ?? [] };
    });
  }, [safeVisibleFields, searchFieldsWithId]);

  const applyFilters = useCallback(() => {
    const payload: Record<string, string> = {};
    safeVisibleFields.forEach(key => {
      if (draftValues[key]) payload[key] = draftValues[key];
    });
    setValues(draftValues);
    onApply(payload);
  }, [draftValues, safeVisibleFields, setValues, onApply]);

  return (
    <div className="flex items-center gap-2 flex-wrap overflow-visible">
      <SmartDropdown
        label="Buscar por"
        triggerIcon={SearchIcon}
        items={items}
        closeOnSelect={false}
      />

      {safeVisibleFields.map(key => {
        const field = searchFieldsWithId.find(f => (f.id ?? f.label) === key);
        if (!field) return null;

        const options = optionsCache[key]?.options ?? [];

        return (
          <div key={key} className="w-44 overflow-visible">
            <FormField
              {...{
                id: key,
                label: field.label,
                type: field.type === "combobox" ? "combobox" : field.type ?? "text",
                value: draftValues[key] ?? "",
                options,
                loading: !!optionsCache[key]?.loading,
                open: !!openMap[key]
              }}
              setOpen={v => setOpenMap(p => ({ ...p, [key]: v }))}
              onChange={e => setDraftValues(p => ({ ...p, [key]: e.target.value }))}
              onSelect={val => setDraftValues(p => ({ ...p, [key]: String(val) }))}
            />
          </div>
        );
      })}

      {safeVisibleFields.length > 0 && (
        <SmartButton icon={FilterIcon} tooltip="Filtrar" onClick={applyFilters} />
      )}
    </div>
  );
});
