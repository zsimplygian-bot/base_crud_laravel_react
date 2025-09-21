import { useEffect, useRef } from "react";
type UseFormCalculateParams = {
  view: string;
  data: Record<string, any>;
  setData: (field: string, value: any) => void;
};
export function useFormCalculate({ view, data, setData }: UseFormCalculateParams) {
  const initialized = useRef(false);
  useEffect(() => {
    if (view !== "liquidacion") return;
    const valor = parseFloat(data.valor ?? "");
    let porcentajeBase = parseFloat(data.porcentaje ?? "");
    // Aumentar porcentaje * 4 si tipo_liquid = 1 y nrorev = 1
    if (parseInt(data.id_tipo_liquid) === 1 && parseInt(data.nrorev) === 1) {
      porcentajeBase *= 4;
    }
    const porcentaje = porcentajeBase / 100;
    const tasamin = parseFloat(data.tasamin ?? "");
    const tasamax = parseFloat(data.tasamax ?? "");
    const igv = parseFloat(data.igv ?? "");
    const canCalculate = !isNaN(valor) && !isNaN(porcentaje);
    if (!canCalculate) {
      setData("porcenaplica", "");
      setData("igvporcen", "");
      setData("subtotal", "");
      setData("total", "");
      return;
    }
    // 1. Calcular porcenaplica
    const porcenaplica = valor * porcentaje;
    setData("porcenaplica", porcenaplica.toFixed(2));
    // 2. Calcular igvporcen
    const igvporcen = (!isNaN(igv)) ? ((porcenaplica / 100) * igv) : 0;
    setData("igvporcen", igvporcen.toFixed(2));
    // 3. Calcular subtotal
    const subtotal = porcenaplica + igvporcen;
    setData("subtotal", subtotal.toFixed(2));
    // 4. Calcular total (con límites tasamin / tasamax)
    let total = subtotal;
    if (!isNaN(tasamin)) total = Math.max(total, tasamin);
    if (!isNaN(tasamax) && tasamax > 0) total = Math.min(total, tasamax);
    setData("total", total.toFixed(2));
    initialized.current = true;
  }, [
    view,
    data.valor,
    data.porcentaje,
    data.igv,
    data.tasamin,
    data.tasamax,
    data.id_tipo_liquid,
    data.nrorev
  ]);
}