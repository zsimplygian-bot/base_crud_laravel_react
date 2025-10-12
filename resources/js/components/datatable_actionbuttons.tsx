import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  FileTextIcon,
} from "lucide-react";
import { Link } from "@inertiajs/react";

interface ActionButtonsProps {
  rowId: string;
  view: string;
  queryString: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rowId,
  view,
  queryString,
}) => {
  const isHonora = view === "detalle_liquidacion";
  const basePath = isHonora ? `/liquidacion/form` : `/${view}/form`;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(rowId);
    } catch (error) {
      console.error("Error copying ID:", error);
    }
  };

  const actions = [
    {
      label: "Detalle",
      href: `${basePath}/info/${rowId}${queryString}`,
      icon: EyeIcon,
      color: "text-blue-500",
      isExternal: false,
    },
    // Solo incluir Editar y Eliminar si no es "honora"
    ...(!isHonora
      ? [
          {
            label: "Editar",
            href: `${basePath}/update/${rowId}${queryString}`,
            icon: EditIcon,
            color: "text-green-600",
            isExternal: false,
          },
          {
            label: "Eliminar",
            href: `${basePath}/delete/${rowId}${queryString}`,
            icon: TrashIcon,
            color: "text-red-600",
            isExternal: false,
          },
        ]
      : []),
    // Incluir Imprimir si la vista es válida
    ...(view === "historia_clinica"
      ? [
          {
            label: "Imprimir",
            href: `/${view}/pdf/${rowId}${queryString}`,
            icon: FileTextIcon,
            color: "text-cyan-600",
            isExternal: true,
          },
        ]
      : []),
  ];
  const renderAction = (
    label: string,
    href: string,
    Icon: React.ElementType,
    color: string,
    isExternal = false
  ) => (
    <DropdownMenuItem key={label} asChild>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 ${color}`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </a>
      ) : (
        <Link href={href} className={`flex items-center gap-2 ${color}`}>
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      )}
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          title="Acciones"
          aria-label="Acciones"
        >
          ...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyId}>
          <CopyIcon className="w-4 h-4" />
          Copiar ID
        </DropdownMenuItem>
        {actions.map(({ label, href, icon, color, isExternal }) =>
          renderAction(label, href, icon, color, isExternal)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
