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

export const getDiawiFileSize = async (code: string): Promise<number | null> => {
  try {
    const installPageUrl = `https://webapp.diawi.com/install/${code}`
    
    const response = await fetch(installPageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      console.warn("[Utils] No se pudo obtener la página de Diawi. Status:", response.status)
      return null
    }

    const html = await response.text()
    
    let sizeMatch = html.match(/<div class="item-title">Size<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    
    if (!sizeMatch) {
      sizeMatch = html.match(/Size[^<]*<\/div>\s*<div[^>]*class="item-after"[^>]*>([^<]+)<\/div>/i)
    }
    
    if (!sizeMatch) {
      sizeMatch = html.match(/Size[^<]*<\/div>[^<]*<div[^>]*>([\d.]+\s*(?:MB|KB|GB))<\/div>/i)
    }
    
    if (sizeMatch && sizeMatch[1]) {
      const sizeText = sizeMatch[1].trim()
      
      const sizeMatchMB = sizeText.match(/([\d.]+)\s*MB/i)
      if (sizeMatchMB) {
        const sizeInMB = parseFloat(sizeMatchMB[1])
        return Math.round(sizeInMB * 1024 * 1024)
      }
      
      const sizeMatchKB = sizeText.match(/([\d.]+)\s*KB/i)
      if (sizeMatchKB) {
        const sizeInKB = parseFloat(sizeMatchKB[1])
        return Math.round(sizeInKB * 1024)
      }
      
      const sizeMatchGB = sizeText.match(/([\d.]+)\s*GB/i)
      if (sizeMatchGB) {
        const sizeInGB = parseFloat(sizeMatchGB[1])
        return Math.round(sizeInGB * 1024 * 1024 * 1024)
      }
      
      console.warn("[Utils] No se pudo parsear el formato del tamaño:", sizeText)
    } else {
      try {
        const apkUrlMatch = html.match(/href="(https:\/\/[^"]+\.files\.diawi\.com\/app-file\/[^"]+\.apk)"/)
        if (apkUrlMatch && apkUrlMatch[1]) {
          const apkUrl = apkUrlMatch[1]
          const headResponse = await fetch(apkUrl, {
            method: "HEAD",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          })
          
          if (headResponse.ok) {
            const contentLength = headResponse.headers.get("content-length")
            if (contentLength) {
              const sizeInBytes = parseInt(contentLength, 10)
              if (!isNaN(sizeInBytes) && sizeInBytes > 0) {
                return sizeInBytes
              }
            }
          }
        }
      } catch (headError) {
        console.warn("[Utils] No se pudo obtener el tamaño mediante HEAD request:", headError)
      }
      
      console.warn("[Utils] No se encontró el patrón de tamaño en el HTML")
    }
    
    return null
  } catch (error) {
    console.error("[Utils] Error al extraer tamaño desde Diawi:", error)
    if (error instanceof Error) {
      console.error("[Utils] Mensaje de error:", error.message)
      console.error("[Utils] Stack:", error.stack)
    }
    return null
  }
}

export const getDiawiAppDetails = async (code: string): Promise<{
  packageName?: string
  minAndroid?: string
  targetAndroid?: string
  supportedScreens?: string
  supportedDensities?: string
  debuggable?: boolean
  permissions?: string
  signer?: string
  uploadedDate?: string
} | null> => {
  try {
    const installPageUrl = `https://webapp.diawi.com/install/${code}`
    
    const response = await fetch(installPageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      return null
    }

    const html = await response.text()
    const details: {
      packageName?: string
      minAndroid?: string
      targetAndroid?: string
      supportedScreens?: string
      supportedDensities?: string
      debuggable?: boolean
      permissions?: string
      signer?: string
      uploadedDate?: string
    } = {}

    const packageMatch = html.match(/<div class="item-title">Package<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (packageMatch && packageMatch[1]) {
      details.packageName = packageMatch[1].trim()
    }

    const minAndroidMatch = html.match(/<div class="item-title">Minimum OS version<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (minAndroidMatch && minAndroidMatch[1]) {
      details.minAndroid = minAndroidMatch[1].trim()
    }

    const targetAndroidMatch = html.match(/<div class="item-title">Target OS version<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (targetAndroidMatch && targetAndroidMatch[1]) {
      details.targetAndroid = targetAndroidMatch[1].trim()
    }

    const screensMatch = html.match(/<div class="item-title">Supported screens<\/div>\s*<div class="item-after">[^<]*<span[^>]*>(\d+)<\/span>/)
    if (screensMatch && screensMatch[1]) {
      details.supportedScreens = screensMatch[1].trim()
    }

    const densitiesMatch = html.match(/<div class="item-title">Supported densities<\/div>\s*<div class="item-after">[^<]*<span[^>]*>(\d+)<\/span>/)
    if (densitiesMatch && densitiesMatch[1]) {
      details.supportedDensities = densitiesMatch[1].trim()
    }

    const debuggableMatch = html.match(/<div class="item-title">Debuggable<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (debuggableMatch && debuggableMatch[1]) {
      details.debuggable = debuggableMatch[1].trim().toLowerCase() === "yes"
    }

    const permissionsMatch = html.match(/<div class="item-title">Permissions<\/div>\s*<div class="item-after">[^<]*<span[^>]*>(\d+)<\/span>/)
    if (permissionsMatch && permissionsMatch[1]) {
      const permissionsListMatch = html.match(/<div class="item-title">Permissions<\/div>[\s\S]*?<div class="accordion-item-content">[\s\S]*?<div class="block block-strong">([\s\S]*?)<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/)
      if (permissionsListMatch && permissionsListMatch[1]) {
        const permissionsHtml = permissionsListMatch[1]
        const permissionItems = permissionsHtml.match(/<div class="item-title">([^<]+)<\/div>/g)
        if (permissionItems) {
          const permissionsList = permissionItems.map(item => item.replace(/<[^>]+>/g, "").trim()).filter(Boolean)
          details.permissions = permissionsList.join(", ")
        }
      }
    }

    const signerMatch = html.match(/<div class="item-title">Signer<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (signerMatch && signerMatch[1]) {
      details.signer = signerMatch[1].trim()
    }

    const uploadedMatch = html.match(/<div class="item-title">Uploaded<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    if (uploadedMatch && uploadedMatch[1]) {
      details.uploadedDate = uploadedMatch[1].trim()
    }

    return Object.keys(details).length > 0 ? details : null
  } catch (error) {
    console.error("[Utils] Error al extraer detalles del APK desde Diawi:", error)
    return null
  }
}

export const getDiawiCode = (diawiUrl: string): string | null => {
  try {
    const url = new URL(diawiUrl)
    let code = ""
    
    if (url.pathname.includes("/install/")) {
      code = url.pathname.split("/install/")[1]?.split("/")[0] || ""
    } else {
      code = url.pathname.replace(/^\//, "").split("/")[0] || ""
    }
    
    return code || null
  } catch (error) {
    console.error("Error al extraer código de Diawi:", error)
    return null
  }
}

export const getDiawiDownloadUrl = (diawiUrl: string): string => {
  try {
    const url = new URL(diawiUrl)
    let code = ""
    
    if (url.hostname === "i.diawi.com") {
      return diawiUrl
    }
    
    if (url.pathname.includes("/install/")) {
      code = url.pathname.split("/install/")[1]?.split("/")[0] || ""
    } else {
      code = url.pathname.replace(/^\//, "").split("/")[0] || ""
    }
    
    if (!code) {
      console.warn("No se pudo extraer el código de Diawi de la URL:", diawiUrl)
      return diawiUrl
    }
    
    return `https://i.diawi.com/${code}`
  } catch (error) {
    console.error("Error al convertir URL de Diawi:", error)
    return diawiUrl
  }
}

export const getProxyDownloadUrl = (diawiUrl: string, baseUrl?: string): string => {
  const code = getDiawiCode(diawiUrl)
  
  if (!code) {
    return getDiawiDownloadUrl(diawiUrl)
  }
  
  if (typeof window !== "undefined") {
    return `/api/download/${code}`
  }
  
  if (baseUrl) {
    return `${baseUrl}/api/download/${code}`
  }
  
  return `/api/download/${code}`
}
