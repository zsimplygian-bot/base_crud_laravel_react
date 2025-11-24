import { Label } from "@/components/ui/label";

export const FieldWrapper = ({ label, required, htmlFor, children }: any) => {
  if (!label) return <>{children}</>;
  if (children?.props?.type === "hidden") return children;

  const isSelect = children?.type?.displayName === "FieldCombobox";

  return (
    <div className="group relative w-full">
      <Label
        htmlFor={!isSelect ? htmlFor : undefined}
        className="bg-background text-foreground absolute top-0 left-2 -translate-y-1/2 px-1 text-xs z-10 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-destructive text-xs">*</span>}
      </Label>
      {children}
    </div>
  );
};
