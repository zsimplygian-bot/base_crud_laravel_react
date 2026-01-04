import { Loader2, PencilIcon, TrashIcon, FileText, ImageIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { SmartButton } from "@/components/smart-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormFieldsRenderer } from "@/components/form/form-fields";
import { useSeguimiento } from "@/hooks/use-seguimiento";
interface Props { view: string; formId: number; action?: "create" | "update" | "delete" }
export default function SeguimientoSection({ view, formId, action = "update" }: Props) {
  const {
    modal, openModal, closeModal, fields, data, setData, submit,
    groupedByDate, loadingRecords, inputRefs, processing, errors,
    getTitleAndColor, getFolderForType, CONFIG, ACTION, capitalize, formatDatePeru
  } = useSeguimiento(formId, action);
  const canEdit = action === "update";
  const cfg = modal.tipo ? ACTION[modal.act] : null;
  const label = modal.tipo ? CONFIG[modal.tipo as keyof typeof CONFIG] : "";
  return (
    <div className="flex flex-col gap-2">
      {canEdit && (
        <ButtonGroup className="gap-1 flex flex-wrap">
          {Object.keys(CONFIG).map(t => (
            <SmartButton
              key={t}
              size="sm"
              variant="outline"
              className="text-xs font-medium min-w-0 px-2"
              label={capitalize(CONFIG[t as keyof typeof CONFIG])}
              onClick={() => openModal(t, null, "create")}
            />
          ))}
        </ButtonGroup>
      )}
      {Object.entries(groupedByDate).map(([fecha, items]) => (
        <div key={fecha}>
          <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">{fecha === "Sin fecha" ? fecha : formatDatePeru(fecha)}</h3>
          {items.map((r, idx) => {
            const { title, color, usedKey } = getTitleAndColor(r);
            const archivoField = r.f.find(f => f.key === "archivo");
            const archivoNombre = archivoField?.value;
            const tieneArchivo = archivoNombre && typeof archivoNombre === "string" && archivoNombre.trim() !== "";
            const carpeta = getFolderForType(r.k);
            let archivoUrl: string | null = null;
            let esImagen = false;
            let esPdf = false;
            if (tieneArchivo) {
              const nombre = archivoNombre.trim();
              const extension = nombre.toLowerCase().split('.').pop() || "";
              const extensionesImagen = ["jpg", "jpeg", "png", "gif", "webp"];
              if (extensionesImagen.includes(extension)) {
                archivoUrl = `/images/${carpeta}/${nombre}`;
                esImagen = true;
              } else if (extension === "pdf") {
                archivoUrl = `/pdf/${carpeta}/${nombre}`;
                esPdf = true;
              }
            }
            return (
              <div key={`${r.k}-${idx}`} className="border rounded-lg p-3 bg-muted/40 mb-3 shadow-sm">
                <div className="flex justify-between items-center"> {/* items-start → items-center */}
                  <div className="flex-1">
                    <p className={`font-bold text-xl ${color}`}>{title}</p>
                    {r.f
                      .filter(x => !["id", "created_at", "updated_at", "fecha", "archivo"].some(p => x.key.startsWith(p) || x.key === p) && x.key !== usedKey && x.value != null && String(x.value).trim() !== "")
                      .map((f, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{f.label}:</span> {f.value}
                        </p>
                      ))}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 ml-4"> {/* flex-col → flex y gap horizontal */}
                      <SmartButton icon={PencilIcon} onClick={() => openModal(r.k, r.f, "update")} />
                      {tieneArchivo && archivoUrl && (
                        <SmartButton asChild>
                          <a href={archivoUrl} target="_blank">{esPdf ? <FileText/> : <ImageIcon/>}</a>
                        </SmartButton>
                      )}
                      <SmartButton variant="destructive" icon={TrashIcon} onClick={() => openModal(r.k, r.f, "delete")} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {loadingRecords && <div className="w-full flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div>}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        {cfg && (
          <DialogContent className={`max-w-lg p-6 ${cfg.border || ""}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">{cfg.title} {label}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">Formulario para {cfg.title.toLowerCase()} {label.toLowerCase()}.</DialogDescription>
            <form onSubmit={submit} className="space-y-3">
              {(fields[modal.tipo ?? ""] ?? [])
                .filter(([k]) => k !== "id_historia_clinica")
                .map(([k, l, t, o]) => (
                  <FormFieldsRenderer
                    key={k}
                    formFields={{ [k]: { form: { key: k, label: l, type: t, options: o } } }}
                    data={data}
                    setData={(k, v) => setData(p => ({ ...p, [k]: v }))}
                    errors={errors}
                    readonly={cfg.readonly}
                    hiddenFields={[]}
                    isMobile
                    inputRefs={inputRefs}
                    view={view}
                  />
                ))}
              <div className="flex justify-end">
                <Button type="submit" disabled={processing} className={`${cfg.cls} flex items-center gap-2`}>
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : cfg.icon}{cfg.btn}
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}