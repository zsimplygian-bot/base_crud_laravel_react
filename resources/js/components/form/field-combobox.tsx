// components/datatable/FieldCombobox.tsx
import { useState, useMemo, useCallback } from "react";
import { Combobox } from "@/components/ui/combobox";
import { useListOptions } from "@/hooks/form/use-list-options";
import { useSelectedOption } from "@/hooks/form/use-selected-option";
import { ForwardButton } from "@/components/navigation-button";
import { PlusIcon } from "lucide-react";

export const FieldCombobox = ({ id, value, field, disabled, setData }) => {
  const [open, setOpen] = useState(false);

  // Campos que permiten botón "Nuevo"
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

  // Mezcla opciones con el seleccionado
  const mergedOptions = useMemo(() => {
    if (!loaded) return selected ? [selected] : [];
    if (selected && !options.some((o) => o.id == selected.id)) {
      return [selected, ...options];
    }
    return options;
  }, [loaded, options, selected]);

  const selectedLabel = useMemo(() => {
    if (selected?.label) return selected.label;
    const opt = mergedOptions.find((o) => o.id == value);
    return opt?.label ?? "";
  }, [selected, mergedOptions, value]);

  const showLoading =
    (!loaded && loadingSelected) || (open && loading);

  const handleOpen = useCallback(
    (next) => {
      if (next && !loaded) loadFullList();
      setOpen(next);
    },
    [loaded, loadFullList]
  );

  const handleSelect = useCallback(
    (v) => {
      setData(field.key, v);
      setOpen(false);
    },
    [setData, field.key]
  );

  // CreateButton usando ForwardButton
  const CreateButton = shouldRenderCreateButton(field.key) ? (
    <ForwardButton
      href={getCreateLink(field.key)}
      label=""
      icon={<PlusIcon className="w-4 h-4 opacity-80" />}
      className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded"
    />
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
