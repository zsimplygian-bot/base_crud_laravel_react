import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";  // ← Agregado para control directo
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
interface FormProps {
  form_data: any;
  formFields: any;
  sheetFields?: any;
  action: string;
  custom_title: string;
  view: string;
  title: string;
  width_form?: string;
  readonly?: boolean;
  toggleOptions?: any;
  queryparams?: string | Record<string, any>;
  apiConfig?: ApiConfigEntry;
  submitForm?: React.FormEventHandler;
  debug?: boolean;
}
export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  sheetFields,
  action,
  custom_title,
  view,
  title,
  width_form = "w-full",
  readonly = false,
  toggleOptions,
  queryparams,
  apiConfig,
  submitForm,
  debug = false,
}) => {
  const { data, setData, post, put, delete: inertiaDelete, processing, errors, recentlySuccessful, reset } =
    useForm(form_data);
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
    sheetFields,
    data,
    setData
  );
  const { hiddenFields, ToggleUI } = useToggleForm(toggleOptions, setData, data, view, action);
  const FetchButton = useFetchWithButton({ data, setData, apiConfig, view });
  // Detecta si hay archivos en data
  const hasFile = Object.values(data).some((v) => v instanceof File);
  // Handler personalizado: Usa router.post con FormData manual para orden garantizado
  const handleSubmitWithFiles: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (debug) {
      console.log("📤 Datos que se enviarán:", data);
      console.log("🔍 ¿Hay archivo?", hasFile);
    }
    const url = action === "create" 
      ? route(`${view}.store`) 
      : route(`${view}.update`, { [view]: data.id ?? data[`id_${view}`] });
    if (hasFile) {
      // Construir FormData: _method y _token PRIMERO para spoofing
      const formData = new FormData();
      // _token desde meta (estándar en Laravel)
      const tokenElement = document.querySelector('meta[name="csrf-token"]');
      const token = tokenElement?.getAttribute('content');
      if (!token) {
        console.error("❌ No se encontró CSRF token. Verifica <meta name='csrf-token'> en tu layout.");
        return;
      }
      formData.append('_token', token);
      // _method PRIMERO (usa 'PATCH' para resource routes default)
      if (action !== "create") {
        formData.append('_method', 'PATCH');  // ← Cambiado a PATCH
      }
      // Luego, append campos del data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'id' && key !== '_method') {  // Evita duplicados
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      // Debug: Log FormData (verifica orden en consola)
      if (debug) {
        console.log("🔍 Contenido de FormData (orden de append):");
        for (let [key, value] of formData.entries()) {
          console.log(key, typeof value === 'object' ? '[File]' : value);
        }
      }
      // Enviar con router.post + forceFormData (envía FormData as-is)
      router.post(url, formData, {
        forceFormData: true,
        preserveState: true,  // Preserva estado en errors
        preserveScroll: true,
        onSuccess: () => {
          reset();  // Limpia form en éxito
        },
        onError: (err) => {
          // Maneja errors manual (setea en data si usas)
          setData(prev => ({ ...prev, errors: err }));
        },
      });
    } else {
      // Sin archivo: Usa handler estándar (put para update)
      handleSubmit(e);
    }
  };
  // Usa el handler con archivos si aplica, sino original
  const finalSubmitHandler = submitForm ?? (hasFile ? handleSubmitWithFiles : handleSubmit);
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
            {debug && (
    <>
      {console.log("📋 formFields:", formFields)}
      {console.log("📤 data actual:", data)}
    </>
  )}
            <form
              onSubmit={finalSubmitHandler}
              action={route(`${view}.form`, { id: form_data?.id, action })}
              method="POST"
              className="space-y-2"
              encType="multipart/form-data"
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
      </div>
    </AppLayout>
  );
};
export default FormPage;