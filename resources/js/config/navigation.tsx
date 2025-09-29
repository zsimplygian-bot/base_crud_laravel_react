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
    icon: Users,
    title: "Clientes", href: "/cliente",
  },
  {
    icon: PawPrint,
    title: "Mascotas", href: "/mascota",
  },
  {
    icon: Calendar,
    title: "Citas", href: "/cita",
  },
  {
    icon: Stethoscope,
    title: "Historias clínicas", href: "/historia_clinica",
  },
  {
    icon: Syringe, // icono de vacuna 💉
    title: "Vacunas", href: "/vacuna",
  },
  {
    title: "Items",
    icon: BookOpen,
    children: [
               { title: "Especie", href: "/itemsimple?tipo=especie", icon: PawPrint,},
               { title: "Raza", href: "/raza", icon: PawPrint,},
               { title: "Motivo cita", href: "/itemsimple?tipo=motivo_cita", icon: Calendar,},
    ],
  },
];
// Footer (por ahora vacío, se puede extender con docs/repositorio)
const rawFooter: RawItem[] = [];
export const sidebarItems = buildNavStructure(rawSidebar);
export const footerNavItems = buildNavStructure(rawFooter);