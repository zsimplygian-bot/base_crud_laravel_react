import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
export function useDataExport(
  view: string,
  columns: any[],
  data: any[],
  queryparams: Record<string, any> = {}
) {
  const generateFileName = (ext: string) => {
    const now = new Date();
    const dateStr = now.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(/[/,:\s]/g, "-");
    // Construir los query params como ?key=value&key2=value2
    const paramStr = Object.entries(queryparams)
      .filter(([_, val]) => val != null && val !== "") // evitar nulos/vacíos
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    const encodedParamStr = paramStr ? `_${paramStr.replace(/[^\w\-=&]/g, "_")}` : "";
    return `${view}${encodedParamStr}_${dateStr}.${ext}`;
  };
  const exportToCSV = () => {
  // Construir los datos: primero encabezados, luego filas
  const csvArray = [columns.map(c => c.header), ...data.map(row => columns.map(col => row[col.accessor]))];

  // Usar PapaParse para generar CSV
  let csv = Papa.unparse(csvArray);

  // Agregar BOM para que Excel reconozca UTF-8 correctamente (tildes y ñ)
  csv = "\uFEFF" + csv;

  // Crear blob y descargar
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName("csv");
  link.click();
};
  const exportToExcel = () => {
    const header = columns.map(col => col.header);
    const rows = data.map(row => columns.map(col => row[col.accessor]));
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    // Estilo de encabezado en negrita
    header.forEach((_, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIdx });
      if (!ws[cellAddress]) return;
      ws[cellAddress].s = {
        font: { bold: true },
      };
    });
    // Autoajustar columnas al contenido más largo
    const columnWidths = header.map((col, i) => {
      const maxLength = Math.max(
        col.length,
        ...rows.map(row => String(row[i] || "").length)
      );
      return { wch: maxLength + 2 }; // +2 para padding
    });
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    // ⚠️ Requiere XLSX `cellStyles: true` para aplicar estilos
    XLSX.writeFile(wb, generateFileName("xlsx"), { cellStyles: true });
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Export", 10, 10);
    columns.forEach((col, idx) => doc.text(col.header, 10, 20 + idx * 10));
    data.forEach((row, r) => {
      doc.text(columns.map(col => String(row[col.accessor])).join(" "), 10, 30 + r * 10);
    });
    doc.save(generateFileName("pdf"));
  };
  return { exportToCSV, exportToExcel, exportToPDF };
}