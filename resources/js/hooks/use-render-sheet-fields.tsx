import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormFieldsRenderer } from "@/components/form-fields";
import { useForm } from "@inertiajs/react";

type RenderSheetFieldsProps = {
  sheetFields: any;
  data: any;
  setData: (name: string, value: any) => void;
  errors?: Record<string, string>;
  readonly?: boolean;
  configReadonly?: boolean;
  isMobile?: boolean;
  hiddenFields?: Record<string, boolean>;
};

export const RenderSheetFields: React.FC<RenderSheetFieldsProps> = ({
  sheetFields,
  data: parentData,
  setData: setParentData,
  readonly = false,
  configReadonly = false,
  isMobile = false,
  hiddenFields = {},
}) => {
  if (!sheetFields || Object.keys(sheetFields).length === 0) return null;

  const initialBlankData = Object.keys(sheetFields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as Record<string, any>);

  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
  } = useForm(initialBlankData);

  const handleInputChange = (name: string, value: any) => {
    setData(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/tasaliquid/form/create", {
      preserveScroll: true,
      onSuccess: () => {
        // Actualizar el formulario padre si se requiere
        Object.entries(data).forEach(([key, value]) => {
          setParentData(key, value);
        });

        reset(); // limpiar el formulario local
        alert("Tasa registrada correctamente.");
      },
      onError: () => {
        alert("Ocurrió un error. Revisa los campos obligatorios.");
      },
    });
  };
  return (
    <div className="w-full pt-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4">
            Nueva tasa
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] overflow-y-auto px-6 py-6"
        >
          <SheetHeader className="mb-2">
            <SheetTitle>Ingrese nuevos valores</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <FormFieldsRenderer
                formFields={sheetFields}
                data={data}
                setData={handleInputChange}
                errors={errors}
                readonly={readonly}
                configReadonly={configReadonly}
                isMobile={isMobile}
                hiddenFields={hiddenFields}
                requiredFields={Object.keys(sheetFields).filter(
                  (key) => !hiddenFields[key]
                )}
              />
            </div>
            <div className="flex justify-end">
              <SheetClose asChild>
                <Button type="submit" className="mt-2" disabled={processing}>
                  {processing ? "Ingresando..." : "Ingresar"}
                </Button>
              </SheetClose>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};