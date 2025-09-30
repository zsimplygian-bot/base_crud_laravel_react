import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

interface Props {
  open: boolean;
  onClose: () => void;
  seguimiento?: any | null;
  historiaId: number;
  modalFields: any[];
}

export const SeguimientoFormModal: React.FC<Props> = ({
  open,
  onClose,
  seguimiento,
  historiaId,
  modalFields,
}) => {
  const initialData: any = {};

  modalFields.forEach((f) => {
    initialData[f.name] = f.name === "fecha" ? new Date().toISOString().slice(0, 10) : "";
  });
  initialData.id_historia_clinica = historiaId;

  const { data, setData, post, put, reset } = useForm(initialData);

  useEffect(() => {
    if (seguimiento) {
      const newData: any = {};
      modalFields.forEach((f) => {
        newData[f.name] = seguimiento[f.name] || (f.name === "fecha" ? new Date().toISOString().slice(0, 10) : "");
      });
      newData.id_historia_clinica = historiaId;
      setData(newData);
    } else {
      reset(initialData);
    }
  }, [seguimiento, open, modalFields]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seguimiento) {
      put(route("seguimientos.update", seguimiento.id), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      post(route("seguimientos.store"), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full flex justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-3/4 max-w-4xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {seguimiento ? "Editar Seguimiento" : "Nuevo Seguimiento"}
          </h3>
          <form onSubmit={submit} className="flex flex-col gap-3">
            {modalFields?.map((f) => {
              if (f.type === "textarea") {
                return (
                  <textarea
                    key={f.name}
                    value={data[f.name]}
                    onChange={(e) => setData(f.name, e.target.value)}
                    className="w-full min-h-[80px] rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                    placeholder={f.label}
                    required={f.required}
                  />
                );
              } else if (f.type === "date") {
                return (
                  <input
                    key={f.name}
                    type="date"
                    value={data[f.name]}
                    onChange={(e) => setData(f.name, e.target.value)}
                    className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                    required={f.required}
                  />
                );
              } else {
                return (
                  <input
                    key={f.name}
                    type="text"
                    value={data[f.name]}
                    onChange={(e) => setData(f.name, e.target.value)}
                    className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-2"
                    placeholder={f.label}
                    required={f.required}
                  />
                );
              }
            })}
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
      </div>
    </div>
  );
};
