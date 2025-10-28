"use client";

import { useToast as useToastPrimitive } from "@/components/ui/toast-provider";

export function useToast() {
  return useToastPrimitive();
}
