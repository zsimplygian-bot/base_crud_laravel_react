import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { Transition } from "@headlessui/react";

export type FormActionType = "create" | "update" | "delete" | "info";

interface ActionConfigBase {
  formAction: string;
  method: "POST" | "PUT" | "DELETE";
  buttonText: string;
  buttonClass: string;
  buttonIcon: JSX.Element;
  description: string;
  titlePrefix: string;
  readonly?: boolean;
}

const ACTION_CONFIGS: Record<FormActionType, ActionConfigBase> = {
  create: {
    formAction: "store",
    method: "POST",
    buttonText: "Registrar",
    buttonClass: "bg-blue-500 hover:bg-blue-600 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Ingresa los datos cuidadosamente.",
    titlePrefix: "REGISTRO DE",
  },
  update: {
    formAction: "update",
    method: "PUT",
    buttonText: "Actualizar",
    buttonClass: "bg-green-600 hover:bg-green-500 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Actualiza los datos con cuidado.",
    titlePrefix: "ACTUALIZAR",
  },
  delete: {
    formAction: "destroy",
    method: "DELETE",
    buttonText: "Eliminar",
    buttonClass: "bg-red-500 hover:bg-red-700 text-white destructive",
    buttonIcon: <Trash2 className="w-4 h-4" />,
    description: "¿Estás seguro que deseas eliminar? Esta acción es irreversible.",
    titlePrefix: "ELIMINAR",
    readonly: true,
  },
  info: {
    formAction: "info",
    method: "POST",
    buttonText: "",
    buttonClass: "bg-gray-500 hover:bg-gray-600 text-white",
    buttonIcon: <Save className="w-4 h-4" />,
    description: "Consulta la información.",
    titlePrefix: "INFORMACIÓN DE",
    readonly: true,
  },
};

const getFormDataId = (form_data: Record<string, any>, view: string, queryparams?: any) =>
  form_data[`id_${view}`] ??
  (view === "itemsimple" && queryparams?.tipo ? form_data[`id_${queryparams.tipo}`] : undefined);

export const useFormAction = (
  action: string,
  customTitle: string,
  form_data: Record<string, any>,
  view: string,
  post: any,
  patch: any,
  inertiaDelete: any,
  processing: boolean,
  recentlySuccessful: boolean,
  queryparams?: Record<string, any> | string
) =>
  useMemo(() => {
    const safeAction = (action || "create") as FormActionType;
    const config = ACTION_CONFIGS[safeAction];
    const formDataId = getFormDataId(form_data, view, queryparams);

    let cleanTitle = customTitle;
    if (cleanTitle.endsWith("s") || cleanTitle.endsWith("S")) cleanTitle = cleanTitle.slice(0, -1);
    const title = `${config.titlePrefix} ${cleanTitle.toUpperCase()}`;
    const isDestructive = safeAction === "delete";

    const queryString =
      typeof queryparams === "string"
        ? `?tipo=${queryparams}`
        : queryparams
        ? `?${new URLSearchParams(Object.entries(queryparams).map(([k, v]) => [k, String(v)])).toString()}`
        : "";

    // Bordes adaptados a modo claro/oscuro
    const cardBorderMap: Record<FormActionType, string> = {
      create: "border-blue-300 dark:border-blue-900",
      update: "border-green-300 dark:border-green-900",
      delete: "border-red-300 dark:border-red-900",
      info: "border-gray-300 dark:border-gray-700",
    };

    const cardBorderClass = cardBorderMap[safeAction];

    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      switch (config.method) {
        case "POST":
          post(route(`${view}.${config.formAction}`));
          break;
        case "PUT":
          formDataId && patch(route(`${view}.${config.formAction}`, formDataId));
          break;
        case "DELETE":
          formDataId && inertiaDelete(route(`${view}.${config.formAction}`, formDataId));
          break;
      }
    };

    const ActionButton = () =>
      config.buttonText ? (
        <Button
          size="sm"
          type="submit"
          disabled={processing}
          className={`${config.buttonClass} flex items-center gap-2`}
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : config.buttonIcon}
          {config.buttonText}
        </Button>
      ) : null;

    const FooterButtons = (
      <div className="flex items-center justify-between mt-4">
        <Link href={`/${view}${queryString}`}>
          <Button size="sm" variant="outline">
            <ArrowLeft className="w-4 h-4" /> Regresar
          </Button>
        </Link>
        <div className="flex items-center gap-x-4">
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className={`text-sm ${isDestructive ? "text-red-600" : "text-neutral-600"} dark:text-neutral-400`}>
              Guardado
            </p>
          </Transition>
          <ActionButton />
        </div>
      </div>
    );

    return {
      config,
      title,
      isDestructive,
      description: config.description,
      readonly: config.readonly || false,
      handleSubmit,
      FooterButtons,
      formDataId,
      cardBorderClass,
    };
  }, [action, customTitle, form_data, view, post, patch, inertiaDelete, processing, recentlySuccessful, queryparams]);
