// layouts/pages/list-page.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableLayout } from "@/layouts/datatable-layout";
interface Props {
  title: string;
  custom_title: string;
  view: string;
  campos: { title: string; column: string }[];
  width_index?: string;
  queryparams?: any;
  toolbarfields?: any;
  footerFields?: any;
}
export const ListPage: React.FC<Props> = ({
  title,
  custom_title,
  view,
  campos,
  queryparams,
  toolbarfields,
  width_index,
  footerFields,
}) => {
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col rounded-xl p-4">
        <h1 className="text-2xl font-semibold mb-0">
          LISTADO DE {custom_title.toUpperCase()}
        </h1>
        <div className="overflow-x-auto w-full sm:w-[1580px] px-0 sm:px-4 md:px-0">
          <DataTableLayout
            campos={campos}
            view={view}
            width_index={width_index}
            toolbarfields={toolbarfields}
            footerFields={footerFields}
            queryparams={queryparams}
          />
        </div>
      </div>
    </AppLayout>
  );
};