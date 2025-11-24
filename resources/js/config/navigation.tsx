import { LayoutGrid, PawPrint, Calendar, Stethoscope, ClipboardList, Users, Syringe, BookOpen,
  } from "lucide-react";
// Tipo base mínimo y rápido de escribir
type NavDef = [
  title: string,
  icon: any,
  href?: string,
  children?: NavDef[]
];
// Transformador dinámico del formato compacto → estructura final
function buildNav(defs: NavDef[]) {
  return defs.map((item) => {
    const [title, icon, href, children] = item;
    return {
      title,
      icon,
      href: href ?? (children?.length === 1 ? children[0][2] : undefined),
      children: children
        ? children.map(([ct, ci, ch]) => ({
            title: ct,
            icon: ci ?? icon,
            href: ch,
          }))
        : undefined,
    };
  });
}
// Definición *ultra simple*
const rawSidebar: NavDef[] = [
  ["Dashboard", LayoutGrid, "/dashboard"],
  ["Historias clínicas", Stethoscope, "/historia_clinica"],
  [ "Citas",
    Calendar,
    undefined,
    [
      ["Listado", Calendar, "/cita"],
      ["Calendario", Calendar, "/cita/calendario"],
    ],
  ],
  ["Mascotas", PawPrint, "/mascota"],
  ["Dueños", Users, "/cliente"],
  [  "Items",
    BookOpen,
    undefined,
    [
      ["Medicamentos", Syringe, "/medicamento"],
      ["Procedimientos", ClipboardList, "/procedimiento"],
      ["Especie", PawPrint, "/especie"],
      ["Raza", PawPrint, "/raza"],
      ["Motivo cita", Calendar, "/motivo_cita"],
      ["Motivo historia", Calendar, "/motivo_historia_clinica"],
    ],
  ],
];
export const sidebarItems = buildNav(rawSidebar);
export const footerNavItems = buildNav([]);