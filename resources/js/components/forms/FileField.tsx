export default function FileField({ name, onChange }: any) {
  return (
    <input
      type="file"
      name={name}
      onChange={(e) => onChange?.(name, e.target.files?.[0])}
      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700"
    />
  );
}
