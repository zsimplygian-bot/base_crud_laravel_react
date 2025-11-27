export const DATA_TABLE_TITLES = {
  historia_clinica: "Historia clínica",
  mascota: "Mascotas",
  medicamento: "Medicamentos",
  usuario: "Usuarios",
  cita: "Citas",
  cliente: "Dueños",
  // agrega lo que necesites
};
export const getTitle = (view) => {
  return DATA_TABLE_TITLES[view] 
    ? DATA_TABLE_TITLES[view]
    : view.replace(/_/g, " ").toUpperCase();
};