import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenuBase from "@/components/dropdown-menu";
import { DownloadIcon, FileDownIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { useDataExport } from "@/hooks/datatable/toolbar/use-datatable-export";
interface ExportMenuProps {
  view: string;
  columns: any[];
  data: any[];
}
export const ExportMenu = memo(function ExportMenu({ view, columns, data }: ExportMenuProps) {
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);
  const items = useMemo(() => [
    { label: "CSV", icon: FileDownIcon, action: exportToCSV },
    { label: "Excel", icon: FileSpreadsheetIcon, action: exportToExcel },
    { label: "PDF", icon: FileTextIcon, action: exportToPDF },
  ], [exportToCSV, exportToExcel, exportToPDF]);
  return (
    <DropdownMenuBase
      label="Exportar"
      items={items}
      trigger={
        <Button variant="outline" size="sm">
          <DownloadIcon className="w-3 h-3 opacity-80" /> Exportar
        </Button>
      }
    />
  );
});