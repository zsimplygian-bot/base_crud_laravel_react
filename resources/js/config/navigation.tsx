import { LayoutGrid, PawPrint, Calendar, Stethoscope, ClipboardList, Users, Syringe, BookOpen, User,
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
      ["Calendario", Calendar, "/calendario"],
    ],
  ],
  ["Mascotas", PawPrint, "/mascota"],
  ["Dueños", Users, "/cliente"],
  [  "Items",
    BookOpen,
    undefined,
    [
      ["Productos", Syringe, "/producto"],
      ["Procedimientos", ClipboardList, "/procedimiento"],
      ["Categoria productos", ClipboardList, "/categoria_producto"],
      ["Categoria procedimientos", ClipboardList, "/categoria_procedimiento"],
      ["Especie", PawPrint, "/especie"],
      ["Raza", PawPrint, "/raza"],
      ["Motivo", Calendar, "/motivo"],
      ["Motivo cita", Calendar, "/motivo_cita"],
      ["Motivo historia", Calendar, "/motivo_historia_clinica"],
      ["Usuario", User, "/user"],
    ],
  ],
];
export const sidebarItems = buildNav(rawSidebar);
export const footerNavItems = buildNav([]);