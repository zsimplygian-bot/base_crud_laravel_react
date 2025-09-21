import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Edit } from "lucide-react";
import { Transition } from "@headlessui/react";

export type FormActionType = "create" | "update" | "delete" | "info" | "review";

type ActionConfig = {
  formAction: string;
  method: "POST" | "PUT" | "DELETE";
  buttonText: string;
  buttonClass: string;
  borderColor: string;
  description: string;
  titlePrefix: string;
  readonly?: boolean;
  showSubmitButton: (processing: boolean) => JSX.Element | null;
};

const ACTION_CONFIGS: Record<FormActionType, ActionConfig> = {
  create: {
    formAction: "store",
    method: "POST",
    buttonText: "Registrar",
    buttonClass:
      "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-600",
    borderColor: "border-blue-200 dark:border-blue-950",
    description: "Ingresa los datos cuidadosamente.",
    titlePrefix: "REGISTRO DE",
    showSubmitButton: (processing) => (
      <Button
        disabled={processing}
        type="submit"
        className={ACTION_CONFIGS.create.buttonClass}
      >
        <Save className="mr-2 h-4 w-4" />
        Registrar
      </Button>
    ),
  },
  update: {
    formAction: "update",
    method: "PUT",
    buttonText: "Actualizar",
    buttonClass:
      "bg-green-600 hover:bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-600",
    borderColor: "border-green-200 dark:border-green-950",
    description: "Actualiza los datos con cuidado.",
    titlePrefix: "ACTUALIZAR",
    showSubmitButton: (processing) => (
      <Button
        disabled={processing}
        type="submit"
        className={ACTION_CONFIGS.update.buttonClass}
      >
        <Save className="mr-2 h-4 w-4" />
        Actualizar
      </Button>
    ),
  },
  delete: {
    formAction: "destroy",
    method: "DELETE",
    buttonText: "Eliminar",
    buttonClass:
      "bg-red-700 hover:bg-red-800 text-white dark:bg-red-800 dark:hover:bg-red-700",
    borderColor: "border-red-200 dark:border-red-950",
    description: "¿Estás seguro que deseas eliminar? Esta acción es irreversible.",
    titlePrefix: "ELIMINAR",
    readonly: true,
    showSubmitButton: (processing) => (
      <Button
        disabled={processing}
        type="submit"
        className={ACTION_CONFIGS.delete.buttonClass}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Button>
    ),
  },
  review: {
    formAction: "store",
    method: "POST",
    buttonText: "Revisar",
    buttonClass:
      "bg-purple-500 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600",
    borderColor: "border-purple-300 dark:border-purple-900",
    description: "Revisa los datos cuidadosamente.",
    titlePrefix: "REVISAR",
    readonly: true,
    showSubmitButton: (processing) => (
      <Button
        disabled={processing}
        type="submit"
        className={ACTION_CONFIGS.review.buttonClass}
      >
        <Save className="mr-2 h-4 w-4" />
        Registrar
      </Button>
    ),
  },
  info: {
    formAction: "info",
    method: "POST",
    buttonText: "",
    buttonClass:
      "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-400 dark:hover:bg-gray-500",
    borderColor: "border-gray-200 dark:border-gray-800",
    description: "Consulta la información.",
    titlePrefix: "INFORMACIÓN DE",
    readonly: true,
    showSubmitButton: () => null,
  },
};

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
  queryparams?: Record<string, any> | string,
  reviewButton?: boolean
) => {
  return useMemo(() => {
    const safeAction = (action || "create") as FormActionType;
    const config = ACTION_CONFIGS[safeAction];

    // 🔍 Identificación de ID dinámico
    let formDataId: string | number | undefined = undefined;

    // Opción 1: id_{view}
    if (form_data[`id_${view}`]) {
      formDataId = form_data[`id_${view}`];
    }

    // Opción 2: caso especial para itemsimple y tipo dinámico
    else if (view === "itemsimple") {
      let tipo = "";

      if (typeof queryparams === "string") {
        tipo = queryparams;
      } else if (typeof queryparams === "object" && queryparams?.tipo) {
        tipo = String(queryparams.tipo);
      }

      if (tipo && form_data[`id_${tipo}`]) {
        formDataId = form_data[`id_${tipo}`];
      }
    }

    if (!formDataId && safeAction !== "create") {
      console.warn(
        `⚠️ No se encontró formDataId. Intentado: id_${view}` +
          (view === "itemsimple" && queryparams
            ? `, id_${typeof queryparams === "string" ? queryparams : queryparams.tipo}`
            : "")
      );
    }

    const routeName = `${view}.${config.formAction}`;

    const serializedQueryParams =
      typeof queryparams === "string"
        ? { tipo: queryparams }
        : queryparams
        ? Object.fromEntries(
            Object.entries(queryparams).map(([k, v]) => [k, String(v)])
          )
        : {};

    const queryString =
      Object.keys(serializedQueryParams).length > 0
        ? "?" + new URLSearchParams(serializedQueryParams).toString()
        : "";

    const title = `${config.titlePrefix} ${customTitle.toUpperCase()}`;

    const handleSubmit: React.FormEventHandler = (e) => {
      e.preventDefault();
      switch (config.method) {
        case "POST":
          post(route(routeName));
          break;
        case "PUT":
          if (formDataId) patch(route(routeName, formDataId));
          break;
        case "DELETE":
          if (formDataId) inertiaDelete(route(routeName, formDataId));
          break;
      }
    };

    const FooterButtons =
      view === "tasaliquid" ? (
        <></>
      ) : (
        <div className="flex items-center justify-between mt-4">
          <Link href={`/../${view}${queryString}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
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
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Guardado
              </p>
            </Transition>
            {config.showSubmitButton(processing)}
            {reviewButton && safeAction === "update" && formDataId && (
              <Link
                href={`/${view}/form/review/${formDataId}${queryString}`}
              >
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Revisar
                </Button>
              </Link>
            )}
          </div>
        </div>
      );

    return {
      ...config,
      title,
      handleSubmit,
      FooterButtons,
    };
  }, [
    action,
    customTitle,
    form_data,
    view,
    post,
    patch,
    inertiaDelete,
    processing,
    recentlySuccessful,
    queryparams,
    reviewButton,
  ]);
};
