// components/ToastContainer.tsx
import React, { useState } from "react";
import Toast from "./toast";
interface ToastContainerProps {
  messages: Array<{ id: string; message: string; variant?: string; duration?: number }>;
}
const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const [toastList, setToastList] = useState(messages);
  const removeToast = (id: string) => {
    setToastList((prevList) => prevList.filter((toast) => toast.id !== id));
  };
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {toastList.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
export default ToastContainer;