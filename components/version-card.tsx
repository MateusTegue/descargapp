// "use client"

// import Link from "next/link"
// import { format } from "date-fns"
// import { es } from "date-fns/locale/es"
// import { Download, ExternalLink } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { getVersionStatus, formatFileSize } from "@/lib/utils"
// import type { Version } from "@/types/version"

// interface VersionCardProps {
//   version: Version
// }

// export const VersionCard = ({ version }: VersionCardProps) => {
//   const status = getVersionStatus(version.expiresAt ? new Date(version.expiresAt) : null)
//   const releaseDate = new Date(version.releaseDate)

//   const getStatusVariant = () => {
//     if (status.status === "expired") return "expired"
//     if (status.status === "expiring") return "warning"
//     return "success"
//   }

//   const handleDownload = (e: React.MouseEvent) => {
//     e.preventDefault()
//     window.open(version.diawiUrl, "_blank")
//   }

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex-1 space-y-2">
//             <div className="flex items-center gap-3">
//               <h3 className="text-lg font-semibold">{version.appName}</h3>
//               <Badge variant={getStatusVariant()}>{status.message}</Badge>
//               {version.releaseType && (
//                 <Badge variant="outline">{version.releaseType}</Badge>
//               )}
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <p className="text-muted-foreground">Versión</p>
//                 <p className="font-medium">{version.version}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Build</p>
//                 <p className="font-medium">#{version.build}</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Fecha</p>
//                 <p className="font-medium">
//                   {format(releaseDate, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es })}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground">Tamaño</p>
//                 <p className="font-medium">{formatFileSize(version.fileSize)}</p>
//               </div>
//             </div>
//             {version.changelog && (
//               <div>
//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {version.changelog}
//                 </p>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-col gap-2 md:min-w-[200px]">
//             <Button
//               onClick={handleDownload}
//               className="w-full"
//               disabled={status.status === "expired"}
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Descargar
//             </Button>
//             <Link href={`/version/${version.id}`}>
//               <Button variant="outline" className="w-full">
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Ver detalles
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVersionStatus, formatFileSize, getDiawiDownloadUrl } from "@/lib/utils"
import type { Version } from "@/types/version"

interface VersionCardProps {
  version: Version
}

export const VersionCard = ({ version }: VersionCardProps) => {
  const [downloading, setDownloading] = useState(false)
  const status = getVersionStatus(version.expiresAt ? new Date(version.expiresAt) : null)
  const releaseDate = new Date(version.releaseDate)

  const getStatusVariant = () => {
    if (status.status === "expired") return "expired"
    if (status.status === "expiring") return "warning"
    return "success"
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Si está expirado, no hacer nada
    if (status.status === "expired") return

    try {
      setDownloading(true)

      // Convertir a URL de descarga directa (i.diawi.com/CODE)
      const downloadUrl = getDiawiDownloadUrl(version.diawiUrl)
      
      // Usar window.location.href para forzar la descarga directa
      // Esto evita que el navegador redirija a la página web
      window.location.href = downloadUrl
      
      // Dar tiempo para que inicie la descarga antes de resetear el estado
      setTimeout(() => {
        setDownloading(false)
      }, 1000)
    } catch (error) {
      console.error('Error al descargar:', error)
      setDownloading(false)
      // Fallback: abrir directamente la URL de descarga
      window.location.href = getDiawiDownloadUrl(version.diawiUrl)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{version.appName}</h3>
              <Badge variant={getStatusVariant()}>{status.message}</Badge>
              {version.releaseType && (
                <Badge variant="outline">{version.releaseType}</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Versión</p>
                <p className="font-medium">{version.version}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Build</p>
                <p className="font-medium">#{version.build}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-medium">
                  {format(releaseDate, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Tamaño</p>
                <p className="font-medium">{formatFileSize(version.fileSize)}</p>
              </div>
            </div>
            {version.changelog && (
              <div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {version.changelog}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 md:min-w-[200px]">
            <Button
              onClick={handleDownload}
              className="w-full"
              disabled={status.status === "expired" || downloading}
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </>
              )}
            </Button>
            <Link href={`/version/${version.id}`}>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver detalles
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}