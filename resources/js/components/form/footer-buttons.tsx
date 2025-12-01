// components/datatable/form-footer-buttons.tsx
import { Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { BackwardButton } from "@/components/navigation-button";

// Íconos lucide-react
import { Loader2, Save, CheckCircle, Trash2 } from "lucide-react";

interface Props {
  view: string;
  queryString?: string;
  config: any;
  type: "create" | "update" | "delete";
  handleSubmit: (e: React.FormEvent) => void;
  recentlySuccessful: boolean;
  processing: boolean;
}

export const FormFooterButtons = ({
  view,
  queryString,
  config,
  type,
  handleSubmit,
  recentlySuccessful,
  processing,
}: Props) => {
  // icono según el estado
  const icon = processing
    ? <Loader2 className="w-4 h-4 animate-spin" />
    : type === "create"
    ? <Save className="w-4 h-4" />
    : type === "update"
    ? <CheckCircle className="w-4 h-4" />
    : <Trash2 className="w-4 h-4" />;

  const Btn = () =>
    config.t ? (
      <Button
        size="sm"
        type="submit"
        disabled={processing}
        className={`${config.c} flex items-center gap-2 text-white`}
        onClick={handleSubmit}
      >
        {icon}
        {config.t}
      </Button>
    ) : null;

  return (
    <div className="flex items-center justify-between mt-4">
      <BackwardButton label="Regresar" />

      <div className="flex items-center gap-4">
        <Transition
          show={recentlySuccessful}
          enter="transition"
          enterFrom="opacity-0"
          leave="transition"
          leaveTo="opacity-0"
        >
          <p
            className={`text-sm ${
              type === "delete" ? "text-red-600" : "text-neutral-600"
            } dark:text-neutral-400`}
          >
            Guardado
          </p>
        </Transition>

        <Btn />
      </div>
    </div>
  );
};
