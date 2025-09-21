// layouts/pages/form-page.tsx
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import LayoutForm from "@/layouts/form-layout";
interface FormProps {
  form_data: any;
  formFields: any;
  action: string;
  custom_title: string;
  view: string;
  title: string;
  width_form?: string;
  toggleOptions?: any;
  queryparams?: any;
  apiConfig?: any; 
}
export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  action,
  custom_title,
  view,
  title,
  queryparams,
  width_form,
  toggleOptions,
  apiConfig,
}) => {
  console.log("Form Component Props:", { view, apiConfig, formFields });
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <LayoutForm
          form_data={form_data}
          formFields={formFields}
          action={action}
          custom_title={custom_title}
          view={view}
          width_form={width_form}
          queryparams={queryparams}
          toggleOptions={toggleOptions}
          apiConfig={apiConfig}
        />
      </div>
    </AppLayout>
  );
};