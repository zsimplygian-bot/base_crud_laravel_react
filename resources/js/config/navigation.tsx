import {
  LayoutGrid,
  PawPrint,
  Calendar,
  Stethoscope,
  ClipboardList,
  Users,
  User,
  Syringe,
  BookOpen,
} from "lucide-react";
// Definición genérica de items de navegación
type RawItem = {
  title: string;
  icon: any;
  href?: string;
  children?: RawItem[];
};
// Función: convierte RawItem en estructura compatible con NavMain/NavFooter
function buildNavStructure(rawItems: RawItem[]) {
  return rawItems.map(({ title, icon, href, children }) => ({
    title,
    icon,
    href: href ?? (children?.length === 1 ? children[0].href : undefined),
    children: children?.length
      ? children.map((c) => ({
          title: c.title,
          href: c.href,
          icon: c.icon ?? icon,
        }))
      : undefined,
  }));
}
// Sidebar "crudo" en formato más limpio
const rawSidebar: RawItem[] = [
  {
    icon: LayoutGrid,
    title: "Dashboard", href: "/dashboard",
  },
  {
    icon: Stethoscope,
    title: "Historias clínicas", href: "/historia_clinica",
  },
  {
    icon: Calendar,
    title: "Citas", href: "/cita",
  },
  {
    icon: PawPrint,
    title: "Mascotas", href: "/mascota",
  },
  {
    icon: Users,
    title: "Dueños", href: "/cliente",
  },
  {
    title: "Items",
    icon: BookOpen,
    children: [
               { title: "Medicamentos", href: "/medicamento", icon: Syringe,},
               { title: "Procedimientos", href: "/procedimiento", icon: ClipboardList,},
               { title: "Especie", href: "/especie", icon: PawPrint,},
               { title: "Raza", href: "/raza", icon: PawPrint,},
               { title: "Motivo cita", href: "/motivo_cita", icon: Calendar,},
               { title: "Motivo historia", href: "/motivo_historia_clinica", icon: Calendar,},
    ],
  },
];
// Footer (por ahora vacío, se puede extender con docs/repositorio)
const rawFooter: RawItem[] = [];
export const sidebarItems = buildNavStructure(rawSidebar);
export const footerNavItems = buildNavStructure(rawFooter);