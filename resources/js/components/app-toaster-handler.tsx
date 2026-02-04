import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { toast, Toaster } from "@/components/ui/sonner"
export default function AppToasterHandler() {
  const { props } = usePage()
  useEffect(() => {
    toast.dismiss() // Limpia toasts anteriores
    if (props.success) {
      toast.success(String(props.success))
    }
    if (props.errors && Object.keys(props.errors).length) {
      Object.values(props.errors).forEach((msg) => {
        toast.error(String(msg))
      })
    }
  }, [props.success, props.errors])
  return <Toaster position="top-center" closeButton theme="dark" />
}