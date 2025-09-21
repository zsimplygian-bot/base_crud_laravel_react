import { useEffect } from "react";

const previoKeys = [
  "previo1",
  "previo2",
  "previo3",
  "previo4",
  "previo5",
  "previo6",
];

type Props = {
  formFields: any;
  data: any;
  setData: (field: string, value: any) => void;
};

export function useSelectMaxValueForPrevios({ formFields, data, setData }: Props) {
  useEffect(() => {
    for (const key of previoKeys) {
      const field = formFields[key];
      const currentValue = data[key];

      // Solo asignar si no hay valor actual y hay opciones válidas
      if (!currentValue && field?.options?.length) {
        const maxOption = field.options.reduce((max: any, option: any) =>
          Number(option.id) > Number(max.id) ? option : max
        );
        if (maxOption) {
          setData(key, maxOption.id.toString());
        }
      }
    }
  }, [formFields, data, setData]);
}
