import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
interface ToggleOptions<OptionKey extends string> {
  label: string;
  values: readonly OptionKey[];
  fields: Record<OptionKey, string[]>;
  autoDetect?: (data: Record<string, any>) => OptionKey | null;
}
function useToggleForm<OptionKey extends string = string>(
  toggleOptions: ToggleOptions<OptionKey> | null | undefined,
  setData: (field: string, value: any) => void,
  data: Record<string, any>,
  view?: string,
  action?: string
) {
  // Retorno seguro si no hay opciones válidas
  if (!toggleOptions?.values?.length) {
    return {
      activeOption: "",
      hiddenFields: [],
      ToggleUI: () => null,
    };
  }
  const { label, values, fields } = toggleOptions;
  const isDisabled = action === "info" || action === "delete";
  // Detectar cuál opción tiene datos llenos
  const detectActiveOption = useCallback((): OptionKey => {
    return (
      values.find(option =>
        (fields[option] || []).some(field => data[field] != null && data[field] !== "")
      ) || values[0]
    );
  }, [data, fields, values]);
  const [activeOption, setActiveOption] = useState<OptionKey>(() => detectActiveOption());
  const [userChanged, setUserChanged] = useState(false);
  // Limpiar campos no visibles (excepto en la vista 'liquidacion')
  const clearFieldsExcept = useCallback(
  (keepOption: OptionKey) => {
    if (view === "tasaliquid") return;
    const keepFields = new Set(fields[keepOption] || []);
    const allFields = Object.values(fields).flat();
    allFields.forEach(field => {
      if (!keepFields.has(field)) {
        setData(field, "");
      }
    });
  },
  [fields, setData, view]
);

  // Autodetección si no ha sido modificado por el usuario
  useEffect(() => {
    if (userChanged) return;
    const detected = detectActiveOption();
    if (detected !== activeOption) {
      setActiveOption(detected);
      clearFieldsExcept(detected);
    }
  }, [data, userChanged, activeOption, detectActiveOption, clearFieldsExcept]);
  // Cambio de opción por usuario
  const changeOption = useCallback(
    (option: OptionKey) => {
      if (option === activeOption) return;
      setUserChanged(true);
      setActiveOption(option);
      clearFieldsExcept(option);
    },
    [activeOption, clearFieldsExcept]
  );
  // Campos ocultos (para no renderizar en el form)
  const hiddenFields = useMemo(() => {
    const visible = new Set(fields[activeOption] || []);
    return Object.values(fields).flat().filter(f => !visible.has(f));
  }, [fields, activeOption]);
  // Componente para renderizar los botones de toggle
  const ToggleUI = () => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">{label}:</span>
      {values.map(opt => (
        <Button
          key={opt}
          type="button"
          variant={activeOption === opt ? "default" : "outline"}
          onClick={() => changeOption(opt)}
          disabled={isDisabled}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
  return {
    activeOption,
    hiddenFields,
    ToggleUI,
  };
}
export default useToggleForm;