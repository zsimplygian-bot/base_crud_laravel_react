import { useMemo } from "react";

export function useCreateButtonLink() {
  const fieldsWithCreateButton = useMemo(() => {
    return [
      "id_distrito",
      "id_pfildelegado",
      "id_persona_j",
      "id_persona_n",
      "id_propietario_j",
      "id_propietario_n",
      "id_tramitador",
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
