import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDiawiFileSize, getDiawiDownloadUrl } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Endpoint para actualizar el tamaño del APK de una versión existente
 * Extrae el tamaño desde Diawi y lo actualiza en la base de datos
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Obtener la versión actual
    const version = await prisma.version.findUnique({
      where: { id },
    })

    if (!version) {
      return NextResponse.json(
        { error: "Versión no encontrada" },
        { status: 404 }
      )
    }

    console.log("📏 [Update Size] Extrayendo tamaño para versión:", id)

    // Extraer el código de Diawi
    const downloadUrl = getDiawiDownloadUrl(version.diawiUrl)
    const url = new URL(downloadUrl)
    const code = url.pathname.replace(/^\//, "")

    // Obtener el tamaño desde Diawi
    const fileSize = await getDiawiFileSize(code)

    if (!fileSize) {
      return NextResponse.json(
        { error: "No se pudo extraer el tamaño del APK desde Diawi" },
        { status: 400 }
      )
    }

    // Actualizar la versión con el tamaño
    const updatedVersion = await prisma.version.update({
      where: { id },
      data: { fileSize },
    })

    console.log("✅ [Update Size] Tamaño actualizado:", fileSize, "bytes")

    // Convertir las fechas de Date a string
    const versionWithStringDates = {
      ...updatedVersion,
      releaseDate: updatedVersion.releaseDate.toISOString(),
      createdAt: updatedVersion.createdAt.toISOString(),
      updatedAt: updatedVersion.updatedAt.toISOString(),
      expiresAt: updatedVersion.expiresAt ? updatedVersion.expiresAt.toISOString() : null,
    }

    return NextResponse.json({
      message: "Tamaño actualizado exitosamente",
      version: versionWithStringDates,
    })
  } catch (error) {
    console.error("❌ [Update Size] Error:", error)
    return NextResponse.json(
      { error: "Error al actualizar el tamaño" },
      { status: 500 }
    )
  }
}

