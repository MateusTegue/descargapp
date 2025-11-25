import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return "N/A"
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

export const getVersionStatus = (expiresAt: Date | null | undefined): {
  status: "available" | "expiring" | "expired"
  message: string
  daysLeft?: number
} => {
  if (!expiresAt) {
    return { status: "available", message: "Disponible" }
  }

  const now = new Date()
  const diffTime = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { status: "expired", message: "Expirada" }
  }

  if (diffDays <= 7) {
    return { status: "expiring", message: `Expira en ${diffDays} días`, daysLeft: diffDays }
  }

  return { status: "available", message: "Disponible" }
}

