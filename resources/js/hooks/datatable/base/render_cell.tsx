import React from "react";
import { getNestedValue, renderMap, ImageCell } from "@/components/datatable/base/render_cell";
export const useRenderCellContent = () => {
  const renderCellContent = (
    accessor: string,
    row: any,
    view?: string
  ): React.ReactNode => {
    const value = getNestedValue(row, accessor);
    const isEmpty = value == null || value === "";
    if (renderMap[accessor]) return renderMap[accessor](value, row, view);
    if (accessor.toLowerCase().includes("imagen") && view && !isEmpty)
      return ImageCell(value, view);

    return isEmpty ? "—" : value;
  };
  return renderCellContent;
};