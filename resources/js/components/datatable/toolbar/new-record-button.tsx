import { useState } from "react";
import { Plus } from "lucide-react";
import { SmartButton } from "@/components/smart-button";
import { SmartModal } from "@/components/smart-modal";
import { SimpleForm } from "@/components/form/simple-form";
export const NewRecordButton = ({ view, formFields, onSuccess }) => {
  const [open, setOpen] = useState(false);
  if (!view || !formFields?.fields?.length) return null;
  return (
    <><SmartButton {...{ icon: Plus, tooltip: `Nuevo ${view}`, onClick: () => setOpen(true) }} />
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${view}`, description: "Ingresa los datos correctamente" }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields: formFields.fields, open,
            onSuccess: () => { setOpen(false); onSuccess?.(); } }} />
      </SmartModal>
    </>
  );
};