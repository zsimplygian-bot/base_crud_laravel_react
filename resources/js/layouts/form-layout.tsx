import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormAction } from "@/hooks/form/use-form-action";
import { FormFieldsRenderer } from "@/components/form/form-fields";
import { FormFooterButtons } from "@/components/form/footer-buttons";
import { useMemo } from "react";

interface FormProps {
  form_data: any;
  formFields: any;
  action: string;
  custom_title: string;
  view: string;
  width_form?: string;
  readonly?: boolean;
  queryparams?: string | Record<string, any>;
  submitForm?: React.FormEventHandler;
  debug?: boolean;
}

export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  action,
  custom_title,
  view,
  width_form = "w-full",
  readonly = false,
  queryparams,
  submitForm,
  debug = false,
}) => {

  // === backto añadido al estado inicial ===
  const initialData = useMemo(() => ({
    ...form_data,
    backto: localStorage.getItem("lp") ?? null,

  }), [form_data]);

  const {
    data,
    setData,
    post,
    put,
    delete: inertiaDelete,
    processing,
    errors,
    recentlySuccessful,
    reset
  } = useForm(initialData);

  const isMobile = useIsMobile();

  const {
    title: formTitle,
    description,
    cardBorderClass,
    readonly: configReadonly,
    handleSubmit,
    config,
    type,
    queryString,
    recentlySuccessful: formSaved,
    processing: formProcessing,
  } = useFormAction(
    action,
    custom_title,
    initialData,
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

  return (

      <div className="flex flex-1 flex-col gap-4 p-4 rounded-xl">
        <Card className={`${!isMobile ? width_form : "w-full"} border-2 ${cardBorderClass}`}>
          <CardHeader>
            <div className="flex flex-wrap items-start gap-x-4">
              <div>
                <CardTitle>
                  {formTitle}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {debug && (
              <>
                {console.log("Fields:", formFields)}
                {console.log("Data:", data)}
              </>
            )}

            {/* Submit sin wrapper, backto ya va dentro de data */}
            <form
              onSubmit={submitForm ?? handleSubmit}
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
                  isMobile={isMobile}
                  view={view}
                />
              </div>
              <FormFooterButtons
                view={view}
                queryString={queryString}
                config={config}
                type={type}
                handleSubmit={handleSubmit}
                recentlySuccessful={formSaved}
                processing={formProcessing}
              />
            </form>
          </CardContent>
        </Card>
      </div>
  );
};

export default FormPage;
