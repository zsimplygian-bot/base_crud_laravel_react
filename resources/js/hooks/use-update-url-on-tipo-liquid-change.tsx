import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
type Props = {
  data: any;
};
export function useUpdateUrlOnTipoLiquidChange({ data }: Props) {
  const prevTipoRef = useRef<string | null>(null);
  useEffect(() => {
    const tipo = data?.id_tipo_liquid?.toString();
    if (!tipo) return;
    // Evitar múltiples redirecciones con el mismo valor
    if (prevTipoRef.current === tipo) return;
    const currentUrl = new URL(window.location.href);
    const currentTipoInUrl = currentUrl.searchParams.get("id_tipo_liquid");
    if (tipo !== currentTipoInUrl) {
      currentUrl.searchParams.set("id_tipo_liquid", tipo);
      prevTipoRef.current = tipo;
      router.visit(`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`, {
        preserveScroll: true,
        preserveState: false,
        only: ['formFields', 'form_data', 'sheetFields', 'queryparams'],
        replace: true,
      });
    }
  }, [data?.id_tipo_liquid]);
}