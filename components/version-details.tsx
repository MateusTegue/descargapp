"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import { Download, Copy, ArrowLeft, Check, Loader2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getVersionStatus, formatFileSize, getDiawiDownloadUrl, getProxyDownloadUrl } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import type { Version } from "@/types/version"

interface VersionDetailsProps {
  version: Version
}

export const VersionDetails = ({ version }: VersionDetailsProps) => {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const status = getVersionStatus(version.expiresAt ? new Date(version.expiresAt) : null)
  const releaseDate = new Date(version.releaseDate)

  const handleDownload = async () => {
    // Si está expirado, no hacer nada
    if (status.status === "expired") return

    try {
      setDownloading(true)

      // Extraer el código de Diawi de la URL
      const downloadUrl = getDiawiDownloadUrl(version.diawiUrl)
      const url = new URL(downloadUrl)
      const code = url.pathname.replace(/^\//, "")
      
      // Usar nuestro endpoint proxy para descargar desde nuestro dominio
      const proxyUrl = `/api/download/${code}`
      
      // Descargar usando fetch y crear blob
      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        console.error("[Version Details] Error en respuesta:", response.status, response.statusText)
        throw new Error("Error al descargar el APK")
      }
      
      const blob = await response.blob()
      
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `${version.appName}-v${version.version}-build${version.build}.apk`
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      
      setDownloading(false)
    } catch (error) {
      console.error("[Version Details] Error al descargar:", error)
      setDownloading(false)
      // Fallback: intentar descarga directa
      const downloadUrl = getDiawiDownloadUrl(version.diawiUrl)
      window.location.href = downloadUrl
    }
  }

  const handleCopyLink = async () => {
    try {
      // Copiar la URL de descarga directa
      const downloadUrl = getDiawiDownloadUrl(version.diawiUrl)
      await navigator.clipboard.writeText(downloadUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying link:", error)
    }
  }

  const getStatusVariant = () => {
    if (status.status === "expired") return "expired"
    if (status.status === "expiring") return "warning"
    return "success"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al historial
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{version.appName}</CardTitle>
              <CardDescription>
                Versión {version.version} • Build #{version.build}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant()}>{status.message}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="font-semibold mb-4">Información básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fecha de publicación</p>
                <p className="font-medium">
                  {format(releaseDate, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es })}
                </p>
              </div>
              {version.uploadedDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de subida</p>
                  <p className="font-medium">
                    {format(new Date(version.uploadedDate), "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es })}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tipo de release</p>
                <Badge variant="outline">{version.releaseType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tamaño del archivo</p>
                <p className="font-medium">{formatFileSize(version.fileSize)}</p>
              </div>
            </div>
          </div>

          {/* Detalles de la aplicación */}
          <div>
            <h3 className="font-semibold mb-4">Detalles de la aplicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {version.packageName && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Package</p>
                  <p className="font-medium text-xs break-all">{version.packageName}</p>
                </div>
              )}
              {version.minAndroid && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Versión mínima de Android</p>
                  <p className="font-medium">{version.minAndroid}</p>
                </div>
              )}
              {version.targetAndroid && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Versión objetivo de Android</p>
                  <p className="font-medium">{version.targetAndroid}</p>
                </div>
              )}
              {version.architectures && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Arquitecturas soportadas</p>
                  <p className="font-medium">{version.architectures}</p>
                </div>
              )}
              {version.supportedScreens && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pantallas soportadas</p>
                  <p className="font-medium">{version.supportedScreens}</p>
                </div>
              )}
              {version.supportedDensities && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Densidades soportadas</p>
                  <p className="font-medium">{version.supportedDensities}</p>
                </div>
              )}
              {version.debuggable !== null && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Debuggable</p>
                  <Badge variant={version.debuggable ? "warning" : "success"}>
                    {version.debuggable ? "Sí" : "No"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Permisos */}
          {version.permissions && (
            <div>
              <h3 className="font-semibold mb-2">Permisos</h3>
              <div className="p-4 bg-muted rounded-md">
                <div className="flex flex-wrap gap-2">
                  {version.permissions.split(", ").map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Información de firma */}
          {version.signer && (
            <div>
              <h3 className="font-semibold mb-4">Información de firma</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Firmante</p>
                  <p className="font-medium text-sm">{version.signer}</p>
                </div>
              </div>
            </div>
          )}

          {/* Changelog */}
          {version.changelog && (
            <div>
              <h3 className="font-semibold mb-2">Cambios en esta versión</h3>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{version.changelog}</p>
              </div>
            </div>
          )}

          {/* QR Code y acciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Código QR para instalación</h3>
              <div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <QRCodeSVG 
                  value={typeof window !== "undefined" 
                    ? `${window.location.origin}${getProxyDownloadUrl(version.diawiUrl)}`
                    : getProxyDownloadUrl(version.diawiUrl)
                  } 
                  size={200} 
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Escanea este código con tu dispositivo Android para descargar automáticamente
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Acciones</h3>
              <div className="space-y-2">
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
                      Descargar APK
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enlace copiado
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar enlace
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground break-all">
                  {getDiawiDownloadUrl(version.diawiUrl)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

