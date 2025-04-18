import { toast } from "sonner";

export function useToast() {
  return {
    successToast: (msg) => toast.success(msg),
    errorToast: (msg) => toast.error(msg),
    infoToast: (msg) => toast(msg),
  };
}