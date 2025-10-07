import { useMemo } from "react";
export function useCreateButtonLink() {
  const fieldsWithCreateButton = useMemo(() => {
    return [
      "id_cliente",
      "id_mascota",
      "id_raza",
      "id_especie",
    ];
  }, []);
  const shouldRenderCreateButton = (fieldKey: string) =>
    fieldsWithCreateButton.includes(fieldKey);
  const getCreateLink = (fieldKey: string) =>
    `/${fieldKey.replace(/^id_/, "")}/form/create`;
  return {
    shouldRenderCreateButton,
    getCreateLink,
  };
}