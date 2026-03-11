import { Users } from "lucide-react"
export const miembroForm = {
  view: "miembro",
  title: "Miembro",
  icon: Users, // <-- icono de la tabla, se puede usar en NewRecordButton, tabs, etc.
  fields: [
    { id: "id_coordinador", label: "Coordinador", type: "combobox", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "dni", label: "DNI", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "ape_nom", label: "Apellidos y nombres", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "id_rol_miembro", label: "Rol", type: "combobox", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "telefono", label: "Telefono",  width:"1/2", required: false },
    { id: "mesa_numero", label: "N° Mesa", searchable: true, width:"1/2" },
    { id: "fecha_encuentro", label: "Fecha encuentro", type: "datetime", required: false },
    { id: "ubicacion", label: "Ubicación", required: false },
    { id: "id_estado_miembro", label: "Estado", type: "combobox", default: "1", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "observaciones", label: "Observaciones", type: "textarea", searchable: true, width:"1/2", required: false },
  ],
}