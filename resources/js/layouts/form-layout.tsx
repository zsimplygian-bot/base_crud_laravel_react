// FormPage.tsx
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
    data,
    setData,
    reset
  );
  const { hiddenFields, ToggleUI } = useToggleForm(toggleOptions, setData, data, view, action);
  const FetchButton = useFetchWithButton({ data, setData, apiConfig, view });
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
              onSubmit={submitForm ?? handleSubmit}
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