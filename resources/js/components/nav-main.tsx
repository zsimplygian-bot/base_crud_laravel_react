import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const isActive = (href: string | undefined): boolean => {
    if (!href) return false;
    const [hrefPath, hrefQuery] = href.split('?');
    const [currentPath] = page.url.split('?');
    const queryParams = new URLSearchParams(page.url.split('?')[1] || '');
    const hrefParams = new URLSearchParams(hrefQuery || '');
    const pathMatch = currentPath.startsWith(hrefPath);
    const allParamsMatch = Array.from(hrefParams.entries()).every(
      ([key, value]) => queryParams.get(key) === value
    );
    return pathMatch && allParamsMatch;
  };
  // Estado inicial: menús abiertos si alguna subruta está activa
  const initialOpenMenus = useMemo(() => {
    const open: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children?.some((child) => isActive(child.href))) {
        open[item.title] = true;
      }
    });
    return open;
  }, [items]);
  const [openMenus, setOpenMenus] = useState(initialOpenMenus);
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus[item.title] || false;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild={true}
              onClick={() => hasChildren && toggleMenu(item.title)}
              isActive={isActive(item.href)}
              tooltip={{ children: item.title }}
            >
              {hasChildren ? (
                // Botón padre: icono + texto a la izquierda, flecha a la derecha
                <div className="w-full flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </div>
                  <span className="text-xs">{isOpen ? '▾' : '▸'}</span>
                </div>
              ) : (
                // Botón sin hijos
                <Link href={item.href} prefetch className="w-full flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
            {hasChildren && isOpen && (
              <div className="submenu-wrapper mt-1 space-y-1">
                {item.children.map((child) => (
                  <SidebarMenuButton
                    key={child.title}
                    asChild
                    isActive={isActive(child.href)}
                    tooltip={{ children: child.title }}
                  >
                    <Link
                      href={child.href}
                      prefetch
                      className="w-full flex items-center gap-2 text-sm pl-6" // <-- aquí agregas padding-left
                    >
                      {child.icon && <child.icon className="w-4 h-4" />}
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        );
      })}
      </SidebarMenu>
    </SidebarGroup>
  );
}