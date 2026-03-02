import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { toast, Toaster } from "@/components/ui/sonner"

export default function AppToasterHandler() {
  const { props } = usePage<any>()

  useEffect(() => {
    toast.dismiss() // Limpia toasts anteriores

    if (props.success) {
      toast.success(String(props.success))
    }

    if (props.error) {
      toast.error(String(props.error))
    }
  }, [props.success, props.error])

  return <Toaster position="top-center" closeButton theme="dark" />
}