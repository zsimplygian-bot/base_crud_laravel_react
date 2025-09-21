// resources/js/components/ui/progress.tsx
import React from "react";

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded bg-gray-200 ${className}`}>
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
