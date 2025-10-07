import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormCalculate } from "@/hooks/use-form-calculate";
import useToggleForm from "@/hooks/use-toggle-form";
import { useFormAction } from "@/hooks/use-form-action";
import { FormFieldsRenderer } from "@/components/form-fields";
// 👇 importamos el hook que hiciste
import { ApiConfigEntry, useFetchWithButton } from "@/hooks/use-fetch-with-button";
type LayoutFormProps = {
  form_data: any;
  formFields: any;
  sheetFields?: any;
  action: string;
  custom_title: string;
  view: string;
  width_form?: string;
  readonly?: boolean;
  queryparams?: string;
  toggleOptions?: any;
  submitForm?: React.FormEventHandler;
  apiConfig?: ApiConfigEntry;
};
const LayoutForm: React.FC<LayoutFormProps> = ({
  form_data,
  formFields,
  sheetFields,
  action,
  custom_title,
  view,
  width_form = "w-full",
  readonly = false,
  queryparams,
  toggleOptions,
  submitForm,
  apiConfig,
}) => {
  const {
    data,
    setData,
    post,
    put,
    delete: inertiaDelete,
    processing,
    errors,
    recentlySuccessful,
  } = useForm(form_data);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const isMobile = useIsMobile();
  useFormCalculate({ view, data, setData });
  const {
    title,
    description,
    borderColor,
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
  const { hiddenFields, ToggleUI } = useToggleForm(
    toggleOptions,
    setData,
    data,
    view,
    action
  );
  // 👇 inicializamos el botón dinámico para API
  const FetchButton = useFetchWithButton({
    data,
    setData,
    apiConfig,
    view,
  });
  const handleSubmitWithLog: React.FormEventHandler = (e) => {
    e.preventDefault();
    console.log("📤 Datos que se enviarán:", data);
    handleSubmit(e);
  };
  return (
    <Card
      className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
        !isMobile ? width_form : ""
      } border-2 ${borderColor}`}
    >
      <CardHeader>
        <div className="flex items-start flex-wrap gap-x-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="mt-1">
            <ToggleUI />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={submitForm ?? handleSubmitWithLog}
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
              readonly={readonly}
              configReadonly={configReadonly}
              hiddenFields={hiddenFields}
              isMobile={isMobile}
              inputRefs={inputRefs}
              view={view}
              apiConfig={apiConfig}
              FetchButton={FetchButton} // 👈 inyectamos el botón aquí
            />
          </div>
          {FooterButtons}
        </form>
      </CardContent>
    </Card>
  );
};
export default LayoutForm;