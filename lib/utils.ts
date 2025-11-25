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

/**
 * Convierte una URL de Diawi a la URL de descarga directa del APK
 * @param diawiUrl URL de Diawi (puede ser webapp.diawi.com/install/CODE o diawi.com/CODE)
 * @returns URL de descarga directa (i.diawi.com/CODE)
 */
export const getDiawiDownloadUrl = (diawiUrl: string): string => {
  try {
    // Extraer el código de la URL de Diawi
    // Ejemplos:
    // - https://webapp.diawi.com/install/36Y6j7 -> 36Y6j7
    // - https://diawi.com/36Y6j7 -> 36Y6j7
    // - https://i.diawi.com/36Y6j7 -> 36Y6j7 (ya es directa)
    
    const url = new URL(diawiUrl)
    let code = ""
    
    // Si ya es una URL de descarga directa, retornarla tal cual
    if (url.hostname === "i.diawi.com") {
      return diawiUrl
    }
    
    // Extraer el código de diferentes formatos de URL
    if (url.pathname.includes("/install/")) {
      // Formato: /install/CODE
      code = url.pathname.split("/install/")[1]?.split("/")[0] || ""
    } else {
      // Formato: /CODE
      code = url.pathname.replace(/^\//, "").split("/")[0] || ""
    }
    
    // Si no se pudo extraer el código, retornar la URL original
    if (!code) {
      console.warn("No se pudo extraer el código de Diawi de la URL:", diawiUrl)
      return diawiUrl
    }
    
    // Construir la URL de descarga directa
    return `https://i.diawi.com/${code}`
  } catch (error) {
    console.error("Error al convertir URL de Diawi:", error)
    // Si hay un error, retornar la URL original
    return diawiUrl
  }
}

