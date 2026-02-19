import {
  LayoutGrid,
  PawPrint,
  Calendar,
  Stethoscope,
  ClipboardList,
  Users,
  BookOpen,
  User,
  Package,
  Tags,
  Dog,
  ListChecks,
} from "lucide-react"
// Tipo base mínimo
type NavDef = [
  title: string,
  icon: any,
  href?: string,
  children?: NavDef[]
]
// Transformador compacto → estructura final
function buildNav(defs: NavDef[]) {
  return defs.map(item => {
    const [title, icon, href, children] = item
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
    }
  })
}
// Definición con iconos más semánticos
const rawSidebar: NavDef[] = [
  ["Dashboard", LayoutGrid, "/dashboard"],
  ["Historias clínicas", ClipboardList, "/historia_clinica"],
  [
    "Citas",
    Calendar,
    undefined,
    [
      ["Listado", ListChecks, "/cita"],
      ["Calendario", Calendar, "/calendario"],
    ],
  ],
  ["Mascotas", PawPrint, "/mascota"],
  ["Dueños", Users, "/cliente"],
  [
    "Items",
    BookOpen,
    undefined,
    [
      ["Productos", Package, "/producto"], // Inventario / productos
      ["Procedimientos", Stethoscope, "/procedimiento"], // Actos médicos
      ["Categoría productos", Tags, "/categoria_producto"], // Clasificación
      ["Categoría procedimientos", Tags, "/categoria_procedimiento"], // Clasificación
      ["Especie", Dog, "/especie"], // Tipo de animal
      ["Raza", PawPrint, "/raza"], // Subtipo
      ["Motivo", ClipboardList, "/motivo"], // Razón de cita
      ["Usuarios", User, "/user"], // Gestión usuarios
    ],
  ],
]
export const sidebarItems = buildNav(rawSidebar)
export const footerNavItems = buildNav([])