import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useRef } from "react";
import { useForm } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormCalculate } from "@/hooks/use-form-calculate";
import useToggleForm from "@/hooks/use-form-toggle";
import { useFormAction } from "@/hooks/use-form-action";
import { FormFieldsRenderer } from "@/components/form-fields";
import { ApiConfigEntry, useFetchWithButton } from "@/hooks/use-fetch-with-button";
import SeguimientoSection from "@/layouts/seguimiento"; // ✅ Aquí se importa la funcionalidad separada
interface FormProps {
  form_data: any;
  formFields: any;
  modalFields?: any[];
  procedimientoFields?: any[];
  medicamentoFields?: any[];
  anamnesisFields?: any[];
  action: string;
  custom_title: string;
  view: string;
  title: string;
  width_form?: string;
  readonly?: boolean;
  toggleOptions?: any;
  queryparams?: any;
  apiConfig?: ApiConfigEntry;
  seguimientos?: any[];
  procedimientos?: any[];
  medicamentos?: any[];
  anamnesis?: any[];
  debug?: boolean;
}
export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  modalFields = [],
  procedimientoFields = [],
  medicamentoFields = [],
  anamnesisFields = [],
  action,
  custom_title,
  view,
  title,
  width_form = "w-full",
  readonly = false,
  toggleOptions,
  queryparams,
  apiConfig,
  seguimientos = [],
  procedimientos = [],
  medicamentos = [],
  anamnesis = [],
  debug = false,
}) => {
  const { data, setData, post, put, delete: inertiaDelete, processing, errors, recentlySuccessful, reset } = useForm(form_data);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const isMobile = useIsMobile();

  useFormCalculate({ view, data, setData });

  const {
    title: formTitle,
    description,
    cardBorderClass,
    readonly: configReadonly,
    handleSubmit,
    FooterButtons,
  } = useFormAction(
    action,
    custom_title,
    form_data,
    view,
    post,
    put,
    inertiaDelete,
    processing,
    recentlySuccessful,
    queryparams,
    [],
    data,
    setData
  );

  const { hiddenFields, ToggleUI } = useToggleForm(toggleOptions, setData, data, view, action);
  const FetchButton = useFetchWithButton({ data, setData, apiConfig, view });

  // Detecta si hay archivos
  const hasFile = Object.values(data).some((v) => v instanceof File);

  const handleSubmitWithFiles: React.FormEventHandler = (e) => {
    e.preventDefault();
    const url =
      action === "create"
        ? route(`${view}.store`)
        : route(`${view}.update`, { [view]: data.id ?? data[`id_${view}`] });

    const formData = new FormData();
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
    if (!token) return;

    formData.append("_token", token);
    if (action !== "create") formData.append("_method", "PATCH");

    Object.entries(data).forEach(([key, value]) => {
      if (value != null && key !== "id" && key !== "_method") {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    router.post(url, formData, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const finalSubmitHandler = hasFile ? handleSubmitWithFiles : handleSubmit;

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex flex-1 flex-col gap-4 p-4 rounded-xl">
        <Card className={`${!isMobile ? width_form : "w-full"} border-2 ${cardBorderClass}`}>
          <CardHeader>
            <div className="flex flex-wrap items-start gap-x-4">
              <div>
                <CardTitle>{formTitle}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              {ToggleUI && <div className="mt-1"><ToggleUI /></div>}
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={finalSubmitHandler}
              encType="multipart/form-data"
              className="space-y-2"
            >
              <div className="flex flex-wrap gap-4">
                <FormFieldsRenderer
                  formFields={formFields}
                  data={data}
                  setData={setData}
                  errors={errors}
                  readonly={readonly || configReadonly}
                  hiddenFields={hiddenFields}
                  isMobile={isMobile}
                  inputRefs={inputRefs}
                  view={view}
                  apiConfig={apiConfig}
                  FetchButton={FetchButton}
                />
              </div>
              {FooterButtons}
            </form>
          </CardContent>
        </Card>

        {/* ✅ Sección separada de registros, modal y eliminación */}
        {action !== "create" && (
          <SeguimientoSection
            view={view}
            action={action}
            formId={form_data?.[`id_${view}`]}
            seguimientos={seguimientos}
            procedimientos={procedimientos}
            medicamentos={medicamentos}
            anamnesis={anamnesis}
            modalFields={modalFields}
            procedimientoFields={procedimientoFields}
            medicamentoFields={medicamentoFields}
            anamnesisFields={anamnesisFields}
            debug={debug}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default FormPage;
