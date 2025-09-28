import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
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
  seguimientos?: Seguimiento[];
}

type Seguimiento = {
  id: number;
  detalle: string;
  tratamiento?: string;
  observaciones?: string;
  fecha: string;
  created_at: string;
};

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
  seguimientos = [],
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editSeguimiento, setEditSeguimiento] = useState<Seguimiento | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const historiaId = Number(window.location.pathname.split("/").pop());
  const { data, setData, post, put, processing, reset } = useForm({
    detalle: "",
    tratamiento: "",
    observaciones: "",
    fecha: new Date().toISOString().slice(0, 10),
    id_historia_clinica: form_data?.id || historiaId,
  });

  const showActions = action !== "info" && action !== "delete";

  const openEditModal = (s?: Seguimiento) => {
    if (s) {
      setEditSeguimiento(s);
      setData({
        detalle: s.detalle,
        tratamiento: s.tratamiento || "",
        observaciones: s.observaciones || "",
        fecha: s.fecha,
        id_historia_clinica: form_data?.id || historiaId,
      });
    } else {
      setEditSeguimiento(null);
      reset("detalle", "tratamiento", "observaciones", "fecha");
    }
    setModalOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const callback = {
      onSuccess: () => {
        reset("detalle", "tratamiento", "observaciones", "fecha");
        setModalOpen(false);
        setEditSeguimiento(null);
      },
    };
    editSeguimiento
      ? put(route("seguimientos.update", editSeguimiento.id), callback)
      : post(route("seguimientos.store"), callback);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(route("seguimientos.destroy", deleteId), {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeleteId(null);
      },
      onError: () => {
        setDeleteModalOpen(false);
        setDeleteId(null);
      },
    });
  };

  const ModalBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" /> {/* fondo oscuro semitransparente */}
      <div className="relative z-10">{children}</div>
    </div>
  );

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
        {view === "historia_clinica" && action !== "create" && (
          <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">SEGUIMIENTO:</h2>
              {showActions && (
                <button
                  onClick={() => openEditModal()}
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.detalle}</p>
                      {s.tratamiento && (
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Tratamiento: {s.tratamiento}
                        </p>
                      )}
                      {s.observaciones && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Obs: {s.observaciones}</p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.fecha}</p>
                    </div>
                    {showActions && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => openEditModal(s)}
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

        {/* Modal Crear/Editar */}
        {isModalOpen && showActions && (
          <ModalBackdrop>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {editSeguimiento ? "Editar Seguimiento" : "Nuevo Seguimiento"}
              </h3>
              <form onSubmit={submit} className="flex flex-col gap-3">
                <textarea
                  value={data.detalle}
                  onChange={(e) => setData("detalle", e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                  placeholder="Detalle del seguimiento..."
                  required
                />
                <textarea
                  value={data.tratamiento}
                  onChange={(e) => setData("tratamiento", e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                  placeholder="Tratamiento (opcional)"
                />
                <textarea
                  value={data.observaciones}
                  onChange={(e) => setData("observaciones", e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                  placeholder="Observaciones (opcional)"
                />
                <input
                  type="date"
                  value={data.fecha}
                  onChange={(e) => setData("fecha", e.target.value)}
                  className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </ModalBackdrop>
        )}

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
