type Props = {
  name: string;
  value?: string | number;
  placeholder?: string;
  type?: string;
  onChange?: (name: string, value: any) => void;
};

export default function InputField({ name, value, placeholder, type = "text", onChange }: Props) {
  return (
    <input
      name={name}
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(name, e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200"
    />
  );
}
