import {
  LayoutGrid,
  Tag,
  PawPrint,
  Calendar,
  Stethoscope,
  ClipboardList,
  FileText,
  Users,
  User,
  Building,
  Car,
  MapPin,
  BookOpen,
  Folder,
} from "lucide-react";
// Función genérica para construir la estructura esperada por NavMain/NavFooter
function buildNavStructure(
  rawItems: Array<[string, any, Array<[string, string, any?]>]>
) {
  return rawItems.map(([title, icon, items]) => ({
    title,
    icon,
    href: items.length === 1 ? items[0][1] : undefined, // Solo si tiene un solo hijo
    children: items.length > 1
      ? items.map(([subTitle, href, subIcon]) => ({
          title: subTitle,
          href,
          icon: subIcon ?? icon,
        }))
      : undefined,
  }));
}
// Declaración simple para Sidebar
const rawSidebar = [
  ["Dashboard", LayoutGrid, [["Dashboard", "/dashboard"]]],

  ["Cliente", User, [
    ["Cliente", "/cliente", Users],
  ]],

  ["Mascota", PawPrint, [
    ["Mascotas", "/mascota", PawPrint],
  ]],

  ["Cita", Calendar, [
    ["Citas", "/cita", Calendar],
  ]],

  ["Consulta", Stethoscope, [
    ["Consultas", "/consulta", ClipboardList],
  ]],

  ["Estado", BookOpen, [
    ["Estado", "/itemsimple?tipo=estado"],
  ]],
];

// Declaración para Footer
const rawFooter = [
  ["Repositorio", Folder, [["Repositorio", "https://github.com/laravel/react-starter-kit"]]],
  ["Documentación", BookOpen, [["Documentación", "https://laravel.com/docs/starter-kits"]]],
];
// Exporta con estructura compatible
export const sidebarItems = buildNavStructure(rawSidebar);
export const footerNavItems = buildNavStructure(rawFooter);