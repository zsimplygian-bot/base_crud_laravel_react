import { FormEventHandler } from "react";
import { router } from "@inertiajs/react";
interface UseFormSubmitOptions {
  config: {
    method: "POST" | "PATCH" | "DELETE";
  };
  view: string;
  formDataId: number | string | undefined;
  data: Record<string, any>;
  post: (url: string) => void;
  put: (url: string) => void;
  inertiaDelete: (url: string) => void;
  reset: () => void;
  setData: (cb: any) => void;
}
export const useFormSubmit = ({
  config,
  view,
  formDataId,
  data,
  post,
  put,
  inertiaDelete,
  reset,
  setData,
}: UseFormSubmitOptions): FormEventHandler => {
  return (e) => {
    e.preventDefault();
    const url =
      config.method === "POST"
        ? route(`${view}.store`)
        : route(`${view}.update`, { [view]: formDataId });
    const hasFile = Object.values(data ?? {}).some((v) => v instanceof File);
    if (hasFile) {
      const formData = new FormData();
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (!token) return;
      formData.append("_token", token);
      if (config.method !== "POST") formData.append("_method", config.method);
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) formData.append(key, value);
        else formData.append(key, String(value ?? ""));
      });
      router.post(url, formData, {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => reset(),
        onError: (err) =>
          setData((prev: any) => ({
            ...prev,
            errors: err,
          })),
      });
      return;
    }
    if (config.method === "POST") post(url);
    if (config.method === "PATCH" && formDataId) put(url);
    if (config.method === "DELETE" && formDataId)
      inertiaDelete(route(`${view}.destroy`, { [view]: formDataId }));
  };
};