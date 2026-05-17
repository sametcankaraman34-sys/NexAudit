export type ToastVariant = "success" | "info" | "warning" | "critical";

export interface ToastAction {
  label: string;
  href: string;
}

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

export interface Toast extends ToastInput {
  id: string;
  variant: ToastVariant;
  createdAt: number;
  exiting?: boolean;
}
