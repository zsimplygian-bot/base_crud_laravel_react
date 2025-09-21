import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

// Interfaz de autenticación
export interface Auth {
    user: User;
}

// Interfaz para los elementos de las migas de pan (breadcrumbs)
export interface BreadcrumbItem {
    title: string;
    href: string;
}

// Interfaz para un grupo de elementos de navegación (NavGroup)
export interface NavGroup {
    title: string;
    items: NavItem[];
}

// Interfaz para los elementos de navegación
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;  // Icono opcional
    isActive?: boolean;  // Determina si el item está activo
    hasSubmenu?: boolean;  // Indica si el item tiene submenú
    submenu?: {  // Submenú que será un array de objetos con título y enlace
        title: string;
        href: string;
    }[];
}

// Datos compartidos globalmente en la aplicación
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// Interfaz para el usuario autenticado
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // Permite propiedades adicionales
}
