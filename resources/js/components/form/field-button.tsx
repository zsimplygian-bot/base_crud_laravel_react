import { Link } from "@inertiajs/react";

export const FieldButton = ({ field }: any) => (
  <Link
    href={field.url || "#"}
    className={`inline-block px-4 py-2 rounded text-white text-center ${
      field.color === "blue"
        ? "bg-blue-600 hover:bg-blue-700"
        : "bg-gray-600 hover:bg-gray-700"
    }`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {field.label}
  </Link>
);
