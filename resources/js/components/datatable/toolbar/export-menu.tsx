import { memo, useMemo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { DownloadIcon, FileDownIcon, FileSpreadsheetIcon, FileTextIcon, } from "lucide-react";
import { useDataExport } from "@/hooks/datatable/toolbar/use-datatable-export";
interface ExportMenuProps {
  view: string;
  columns: any[];
  data: any[];
}
export const ExportMenu = memo(function ExportMenu({ view, columns, data }: ExportMenuProps) {
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);
  const items = useMemo(
    () => [
      { label: "CSV", icon: FileDownIcon, action: exportToCSV },
      { label: "Excel", icon: FileSpreadsheetIcon, action: exportToExcel },
      { label: "PDF", icon: FileTextIcon, action: exportToPDF },
    ], [exportToCSV, exportToExcel, exportToPDF] );
  return (
    <SmartDropdown label="Exportar" triggerIcon={DownloadIcon} items={items} />
  );
});