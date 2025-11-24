// components/datatable/toolbar/new-record-button.tsx
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
export function NewRecordButton({ view }) {
  return (
    <Link href={`/${view}/form/create`}>
      <Button size="sm" variant="outline" className="gap-1 text-sm">
        <PlusIcon className="w-3 h-3 opacity-80 hover:opacity-100 transition" />
        Nuevo
      </Button>
    </Link>
  );
}