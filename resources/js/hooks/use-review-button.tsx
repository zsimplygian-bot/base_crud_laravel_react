import { useEffect, useState } from "react";
export const useShowEvenButton = (nrorevValue: any, action: string) => {
  const [reviewButton, setreviewButton] = useState(false);
  useEffect(() => {
    if (action === "update") {
      const nrorevNumber = parseInt(nrorevValue, 10);
      setreviewButton(!isNaN(nrorevNumber) && nrorevNumber % 2 === 0);
    } else {
      setreviewButton(false);
    }
  }, [nrorevValue, action]);
  return { reviewButton };
};