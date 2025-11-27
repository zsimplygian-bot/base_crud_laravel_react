import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";
import { Head } from "@inertiajs/react";
import AppToasterHandler from "@/components/app-toaster-handler";
interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}
export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
      <Head />
      <AppToasterHandler />
      {children}
    </AppLayoutTemplate>
  );
}