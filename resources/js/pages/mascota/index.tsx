import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "mascota";
const title = "Mascota";
const formFields = {
  fields: [
    { id: "mascota", label: "Mascota", required: true },
    { id: "id_cliente", label: "Cliente", type: "combobox" },
    { id: "id_raza", label: "Raza", type: "combobox" },
    { id: "id_sexo", label: "Sexo", type: "combobox"},
    { id: "id_estado_mascota", label: "Estado mascota", type: "combobox"},
    { id: "edad", label: "Edad" },
    { id: "color", label: "Color" },
    { id: "peso", label: "Peso" },
    { id: "observaciones", label: "Observaciones" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}