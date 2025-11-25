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
 * Extrae el tamaño del APK desde la página de Diawi
 * @param code Código de Diawi (ej: "36Y6j7")
 * @returns Tamaño en bytes o null si no se puede obtener
 */
export const getDiawiFileSize = async (code: string): Promise<number | null> => {
  try {
    console.log("📏 [Utils] Iniciando extracción de tamaño para código:", code)
    const installPageUrl = `https://webapp.diawi.com/install/${code}`
    console.log("📏 [Utils] URL de la página:", installPageUrl)
    
    const response = await fetch(installPageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      console.warn("⚠️ [Utils] No se pudo obtener la página de Diawi. Status:", response.status)
      return null
    }

    const html = await response.text()
    console.log("📏 [Utils] HTML obtenido, longitud:", html.length)
    
    // Buscar el patrón: <div class="item-title">Size</div><div class="item-after">57.26 MB</div>
    // También buscar variaciones del patrón
    let sizeMatch = html.match(/<div class="item-title">Size<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    
    // Si no encuentra, intentar con otro patrón más flexible
    if (!sizeMatch) {
      sizeMatch = html.match(/Size[^<]*<\/div>\s*<div[^>]*class="item-after"[^>]*>([^<]+)<\/div>/i)
    }
    
    // Si aún no encuentra, buscar cualquier patrón que contenga "MB" o "KB" cerca de "Size"
    if (!sizeMatch) {
      sizeMatch = html.match(/Size[^<]*<\/div>[^<]*<div[^>]*>([\d.]+\s*(?:MB|KB|GB))<\/div>/i)
    }
    
    if (sizeMatch && sizeMatch[1]) {
      const sizeText = sizeMatch[1].trim()
      console.log("📏 [Utils] Texto de tamaño encontrado:", sizeText)
      
      // Convertir de diferentes formatos a bytes
      let sizeInBytes: number | null = null
      
      // Intentar con MB
      const sizeMatchMB = sizeText.match(/([\d.]+)\s*MB/i)
      if (sizeMatchMB) {
        const sizeInMB = parseFloat(sizeMatchMB[1])
        sizeInBytes = Math.round(sizeInMB * 1024 * 1024)
        console.log("📏 [Utils] Tamaño extraído (MB):", sizeText, "=", sizeInBytes, "bytes")
        return sizeInBytes
      }
      
      // Intentar con KB
      const sizeMatchKB = sizeText.match(/([\d.]+)\s*KB/i)
      if (sizeMatchKB) {
        const sizeInKB = parseFloat(sizeMatchKB[1])
        sizeInBytes = Math.round(sizeInKB * 1024)
        console.log("📏 [Utils] Tamaño extraído (KB):", sizeText, "=", sizeInBytes, "bytes")
        return sizeInBytes
      }
      
      // Intentar con GB
      const sizeMatchGB = sizeText.match(/([\d.]+)\s*GB/i)
      if (sizeMatchGB) {
        const sizeInGB = parseFloat(sizeMatchGB[1])
        sizeInBytes = Math.round(sizeInGB * 1024 * 1024 * 1024)
        console.log("📏 [Utils] Tamaño extraído (GB):", sizeText, "=", sizeInBytes, "bytes")
        return sizeInBytes
      }
      
      console.warn("⚠️ [Utils] No se pudo parsear el formato del tamaño:", sizeText)
    } else {
      console.warn("⚠️ [Utils] No se encontró el patrón de tamaño en el HTML")
      // Log una porción del HTML para debug
      const sizeSection = html.match(/Size[^<]{0,200}/i)
      if (sizeSection) {
        console.log("📏 [Utils] Sección relevante del HTML:", sizeSection[0])
      }
    }
    
    return null
  } catch (error) {
    console.error("❌ [Utils] Error al extraer tamaño desde Diawi:", error)
    if (error instanceof Error) {
      console.error("❌ [Utils] Mensaje de error:", error.message)
      console.error("❌ [Utils] Stack:", error.stack)
    }
    return null
  }
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

