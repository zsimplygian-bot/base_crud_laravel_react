import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormAction } from "@/hooks/form/use-form-action";
import { FormFieldsRenderer } from "@/components/form/form-fields";
import { getTitle } from "@/hooks/custom-titles";
interface FormProps {
  form_data: any;
  formFields: any;
  action: string;
  custom_title: string;
  view: string;
  title: string;
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
  const { data, setData, post, put, delete: inertiaDelete, processing, errors, recentlySuccessful, reset } = useForm(form_data);
  const isMobile = useIsMobile();
  const { title: formTitle, description, cardBorderClass, readonly: configReadonly, handleSubmit, FooterButtons } =
  useFormAction(action, custom_title, form_data, view, post, put, inertiaDelete, processing, recentlySuccessful, queryparams, data, setData, reset);
    const displayTitle = getTitle(view);
  return (
    <AppLayout breadcrumbs={[{ title: displayTitle, href: view }]}>
      <Head title={displayTitle} />
      <div className="flex flex-1 flex-col gap-4 p-4 rounded-xl">
        <Card className={`${!isMobile ? width_form : "w-full"} border-2 ${cardBorderClass}`}>
          <CardHeader>
            <div className="flex flex-wrap items-start gap-x-4">
              <div>
                <CardTitle>{formTitle} {displayTitle.toUpperCase()}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {debug && (console.log("Fields:", formFields), console.log("Data:", data))}
            <form onSubmit={submitForm ?? handleSubmit} encType="multipart/form-data" className="space-y-2">
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
              {FooterButtons}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
export default FormPage;