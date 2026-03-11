import {
  LayoutGrid,
  PawPrint,
  Calendar,
  Stethoscope,
  ClipboardList,
  Users,
  BookOpen,
  User,
  Syringe,
  Tags,
  Dog,
  ListChecks,
} from "lucide-react"
import { useHasRole } from "@/hooks/use-hasrole"

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
  ["Historias clínicas", ClipboardList, "/historia"],
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
  ["Miembros", User, "/miembro"],
  [
    "Items",
    BookOpen,
    undefined,
    [
      ["Productos", Syringe, "/producto"],
      ["Procedimientos", Stethoscope, "/procedimiento"],
      ["Categoría productos", Tags, "/categoria_producto"],
      ["Categoría procedimientos", Tags, "/categoria_procedimiento"],
      ["Especie", Dog, "/especie"],
      ["Raza", PawPrint, "/raza"],
      ["Motivo", ClipboardList, "/motivo"],
      ["Usuarios", User, "/user"],
    ],
  ],
]

export const sidebarItems = () => {
  const isRol3 = useHasRole(3)

  let filtered: NavDef[]

  if (isRol3) {
    filtered = rawSidebar.filter(([title]) => title === "Miembros") // Rol 3 solo ve Miembros
  } else {
    filtered = rawSidebar.filter(([title]) => title !== "Miembros") // Otros roles no ven Miembros
  }

  return buildNav(filtered)
}

export const footerNavItems = buildNav([])