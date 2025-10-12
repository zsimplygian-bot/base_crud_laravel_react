import { useMemo } from "react";
export function useCreateButtonLink() {
  const fieldsWithCreateButton = useMemo(() => {
    return [
      "id_cliente",
      "id_mascota",
      "id_raza",
      "id_especie",
      "id_motivo_historia_clinica",
      "id_motivo_cita",
    ];
  }, []);
  const shouldRenderCreateButton = (fieldKey: string) =>
    fieldsWithCreateButton.includes(fieldKey);
  const getCreateLink = (fieldKey: string) => {
    const key = fieldKey.replace(/^id_/, "");
    const special = ["especie", "motivo_cita", "motivo_historia_clinica"];
    if (special.includes(key)) {
      return `/itemsimple/form/create?tipo=${key}`;
    }
    return `/${key}/form/create`;
  };
  return {
    shouldRenderCreateButton,
    getCreateLink,
  };
}