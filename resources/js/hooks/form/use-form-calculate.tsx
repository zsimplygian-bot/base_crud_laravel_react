import { useEffect } from "react";
const toTexto = (m = 0) => {
  m = parseInt(m, 10) || 0;
  const a = Math.floor(m / 12);
  const r = m % 12;
  if (a === 0 && r === 0) return "0 meses";
  if (a === 0) return `${r} meses`;
  if (r === 0) return `${a} año${a > 1 ? "s" : ""}`;
  return `${a} año${a > 1 ? "s" : ""}, ${r} meses`;
};
export const useFormCalculate = (setData, data) => {
  const update = (key, value) => {
    setData(key, value);
    if (key === "edad") {
      setData("edad_extendida", toTexto(value));
    }
  };
  // inicialización en UPDATE
  useEffect(() => {
    if (data.edad != null && !data.edad_extendida) {
      setData("edad_extendida", toTexto(data.edad));
    }
  }, [data.edad]);
  return update;
};