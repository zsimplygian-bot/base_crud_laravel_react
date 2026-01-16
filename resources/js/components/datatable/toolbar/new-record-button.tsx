import { useState } from "react";
import { Plus } from "lucide-react";
import { SmartButton } from "@/components/smart-button";
import { SmartModal } from "@/components/smart-modal";
import { SimpleForm } from "@/components/form/simple-form";
export const NewRecordButton = ({ view, title, formFields, onSuccess }) => {
  const [open, setOpen] = useState(false);
  if (!view || !formFields) return null;
  return (
    <><SmartButton {...{ icon: Plus, tooltip: `Nuevo registro`, onClick: () => setOpen(true) }} />
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${title}`, description: "Ingresa los datos correctamente" }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields: formFields.fields, open,
            onSuccess: () => { setOpen(false); onSuccess?.(); } }} />
      </SmartModal>
    </>
  );
};