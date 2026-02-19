import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import type { NavItem } from "@/types"
const ICON_SIZE = 20 // Tamaño default iconos sidebar
export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const isActive = (href?: string) => href && page.url.startsWith(href.split("?")[0])
  const toggleMenu = (title: string) =>
    setOpenMenus(p => ({ ...p, [title]: !p[title] }))
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    for (const i of items) {
      if (i.children?.some(c => isActive(c.href))) initial[i.title] = true
    }
    setOpenMenus(initial)
  }, [items])
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          const hasChildren = !!item.children?.length
          const open = openMenus[item.title]
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={() => hasChildren && toggleMenu(item.title)}
                isActive={isActive(item.href)}
                tooltip={{ children: item.title }}
              >
                {hasChildren ? (
                  <div className="flex justify-between w-full items-center">
                    <div className="flex gap-2 items-center">
                      {item.icon && (
                        <item.icon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs">{open ? "▾" : "▸"}</span>
                  </div>
                ) : (
                  <Link href={item.href} prefetch className="flex gap-2 w-full items-center">
                    {item.icon && (
                      <item.icon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
                    )}
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {hasChildren && open && (
                <div className="mt-1 space-y-1">
                  {item.children.map(c => (
                    <SidebarMenuButton
                      key={c.title}
                      asChild
                      isActive={isActive(c.href)}
                      tooltip={{ children: c.title }}
                    >
                      <Link href={c.href} prefetch className="flex gap-2 text-sm pl-6 items-center">
                        {c.icon && (
                          <c.icon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
                        )}
                        <span>{c.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ))}
                </div>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}