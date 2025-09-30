// layouts/pages/form-page.tsx
import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import LayoutForm from "@/layouts/form-layout";

interface FormProps {
  form_data: any;
  formFields: any;
  modalFields: any[]; // ⚡ campos dinámicos para el modal
  action: string;
  custom_title: string;
  view: string;
  title: string;
  width_form?: string;
  toggleOptions?: any;
  queryparams?: any;
  apiConfig?: any;
  seguimientos?: Seguimiento[];
}

type Seguimiento = Record<string, any>;

const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 w-full flex justify-center">{children}</div>
  </div>
);

const SeguimientoFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  seguimiento?: Seguimiento | null;
  historiaId: number;
  modalFields: any[];
  view: string;
}> = ({ open, onClose, seguimiento, historiaId, modalFields, view }) => {
  // Inicializamos los datos dinámicamente según modalFields
  const initialData = modalFields.reduce((acc, field) => {
    acc[field.name] = seguimiento?.[field.name] ?? (field.type === "date" ? new Date().toISOString().slice(0, 10) : "");
    return acc;
  }, {} as Record<string, any>);

  const { data, setData, post, put, reset } = useForm({
    [`id_${view}`]: historiaId, // ⚡ FK dinámica
    ...initialData,
  });

  // Sincronizar valores cuando cambie seguimiento o modalFields
  useEffect(() => {
    const newData = modalFields.reduce((acc, field) => {
      acc[field.name] = seguimiento?.[field.name] ?? (field.type === "date" ? new Date().toISOString().slice(0, 10) : "");
      return acc;
    }, {} as Record<string, any>);
    setData({ [`id_${view}`]: historiaId, ...newData });
  }, [seguimiento, modalFields]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const routeName = `${view}.seguimientos`;
    if (seguimiento) {
      put(route(`${routeName}.update`, seguimiento.id), {
        data,
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      post(route(`${routeName}.store`), {
        data,
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <ModalBackdrop>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-3/4 max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {seguimiento ? "Editar Seguimiento" : "Nuevo Seguimiento"}
        </h3>
        <form onSubmit={submit} className="flex flex-col gap-3">
          {modalFields.map((field) =>
            field.type === "textarea" ? (
              <textarea
                key={field.name}
                value={data[field.name]}
                onChange={(e) => setData(field.name, e.target.value)}
                className="w-full min-h-[80px] rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                placeholder={field.label}
                required={field.required}
              />
            ) : (
              <input
                key={field.name}
                type={field.type}
                value={data[field.name]}
                onChange={(e) => setData(field.name, e.target.value)}
                className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                placeholder={field.label}
                required={field.required}
              />
            )
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
};

export const FormPage: React.FC<FormProps> = ({
  form_data,
  formFields,
  modalFields = [],
  action,
  custom_title,
  view,
  title,
  queryparams,
  width_form,
  toggleOptions,
  apiConfig,
  seguimientos = [],
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editSeguimiento, setEditSeguimiento] = useState<Seguimiento | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const mainId = form_data?.[`id_${view}`] ?? Number(window.location.pathname.split("/").pop() ?? 0);
  const showActions = action !== "info" && action !== "delete";

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(route(`${view}.seguimientos.destroy`, deleteId), {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeleteId(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col gap-6 p-4">
        {/* Formulario principal */}
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

        {/* Seguimientos */}
        {action !== "create" && (
          <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEGUIMIENTO:</h2>
              {showActions && (
                <button
                  onClick={() => {
                    setEditSeguimiento(null);
                    setModalOpen(true);
                  }}
                  className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 transition"
                >
                  + Agregar
                </button>
              )}
            </div>

            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {seguimientos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No hay seguimientos registrados.</p>
              ) : (
                seguimientos.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start"
                  >
                    <div>
                      {modalFields.map((field) =>
                        s[field.name] ? (
                          <p
                            key={field.name}
                            className={`text-sm ${field.type === "textarea" ? "font-medium" : "text-gray-600 dark:text-gray-300"}`}
                          >
                            {field.label}: {s[field.name]}
                          </p>
                        ) : null
                      )}
                    </div>
                    {showActions && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            setEditSeguimiento(s);
                            setModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-yellow-500 text-white text-xs hover:bg-yellow-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(s.id);
                            setDeleteModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Crear/Editar Seguimiento */}
        <SeguimientoFormModal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          seguimiento={editSeguimiento}
          historiaId={mainId}
          modalFields={modalFields}
          view={view} // 🔹 pasa la vista al modal
        />

        {/* Modal Confirmación Eliminar */}
        {isDeleteModalOpen && (
          <ModalBackdrop>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ¿Estás seguro de que deseas eliminar este seguimiento?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </ModalBackdrop>
        )}
      </div>
    </AppLayout>
  );
};
