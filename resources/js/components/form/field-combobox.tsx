import { useState, useMemo, useCallback } from "react";
import { Combobox } from "@/components/ui/combobox";
import { useListOptions } from "@/hooks/form/use-list-options";
import { useSelectedOption } from "@/hooks/form/use-selected-option";
import { Link } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
export const FieldCombobox = ({ id, value, field, disabled, setData }) => {
  const [open, setOpen] = useState(false);
  // Create button logic (integrado aquí)
  const fieldsWithCreateButton = useMemo(
    () => [
      "id_cliente",
      "id_mascota",
      "id_raza",
      "id_especie",
      "id_motivo_historia_clinica",
      "id_motivo_cita",
      "id_procedimiento",
      "id_medicamento",
    ],
    []
  );
  const shouldRenderCreateButton = (fieldKey) =>
    fieldsWithCreateButton.includes(fieldKey);
  const getCreateLink = (fieldKey) => {
    const key = fieldKey.replace(/^id_/, "");
    return `/${key}/form/create`;
  };
  const { options, loading, loaded, loadFullList } =
    useListOptions(field.key, field.param);
  const { selected, loadingSelected } =
    useSelectedOption(field.key, value);
  // Merge options
  const mergedOptions = useMemo(() => {
    if (!loaded) return selected ? [selected] : [];
    if (selected && !options.some(o => o.id == selected.id)) {
      return [selected, ...options];
    }
    return options;
  }, [loaded, options, selected]);
  // Final label
  const selectedLabel = useMemo(() => {
    if (selected?.label) return selected.label;
    const opt = mergedOptions.find((o) => o.id == value);
    return opt?.label ?? "";
  }, [selected, mergedOptions, value]);
  // Loading
  const showLoading =
    (!loaded && loadingSelected) || (open && loading);
  // Open handler
  const handleOpen = useCallback(
    (next) => {
      if (next && !loaded) loadFullList();
      setOpen(next);
    },
    [loaded, loadFullList]
  );
  // Select handler
  const handleSelect = useCallback(
    (v) => {
      setData(field.key, v);
      setOpen(false);
    },
    [setData, field.key]
  );
  // Create button
  const CreateButton = shouldRenderCreateButton(field.key) ? (
    <Link
      href={getCreateLink(field.key)}
      target="_blank"
      className="flex items-center justify-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <PlusIcon className="w-4 h-4" />
    </Link>
  ) : null;
  return (
    <Combobox
      id={id}
      value={value?.toString() ?? ""}
      placeholder={field.placeholder}
      disabled={disabled}
      open={open}
      setOpen={handleOpen}
      loading={showLoading}
      options={mergedOptions}
      selectedLabel={selectedLabel}
      onSelect={handleSelect}
      CreateButton={CreateButton}
    />
  );
};