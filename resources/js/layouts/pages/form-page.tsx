import { Head } from "@inertiajs/react";
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
  queryparams?: string;
  apiConfig?: ApiConfigEntry;
  submitForm?: React.FormEventHandler;
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
}) => {
  const { data, setData, post, put, delete: inertiaDelete, processing, errors, recentlySuccessful } = useForm(form_data);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const isMobile = useIsMobile();

  useFormCalculate({ view, data, setData });

  const { title: formTitle, description, borderColor, readonly: configReadonly, handleSubmit, FooterButtons } =
    useFormAction(
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

  const handleSubmitWithLog: React.FormEventHandler = (e) => {
    e.preventDefault();
    console.log("📤 Datos que se enviarán:", data);
    handleSubmit(e);
  };

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card className={`bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${!isMobile ? width_form : ""} border-2 ${borderColor}`}>
          <CardHeader>
            <div className="flex items-start flex-wrap gap-x-4">
              <div>
                <CardTitle>{formTitle}</CardTitle>
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
