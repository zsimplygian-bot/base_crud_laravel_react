export default function TextAreaField({ name, value, placeholder, onChange }: any) {
  return (
    <textarea
      name={name}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(name, e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200"
      rows={3}
    />
  );
}
