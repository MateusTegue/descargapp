import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDiawiFileSize, getDiawiDownloadUrl, getDiawiAppDetails } from "@/lib/utils"

// Forzar que esta ruta sea completamente dinámica
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const versions = await prisma.version.findMany({
      orderBy: {
        releaseDate: "desc",
      },
    })

    // Convertir las fechas de Date a string para el tipo Version
    const versionsWithStringDates = versions.map((version: any) => ({
      ...version,
      releaseDate: version.releaseDate.toISOString(),
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      expiresAt: version.expiresAt ? version.expiresAt.toISOString() : null,
      uploadedDate: version.uploadedDate ? version.uploadedDate.toISOString() : null,
    }))

    return NextResponse.json(versionsWithStringDates)
  } catch (error) {
    console.error("Error fetching versions:", error)
    return NextResponse.json(
      { error: "Error al obtener las versiones" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      appName = "A C Soluciones",
      version,
      build,
      diawiUrl,
      diawi_link, // Compatibilidad con GitHub Actions que use diawi_link
      fileSize,
      changelog,
      releaseType = "Release",
      minAndroid,
      architectures,
      expiresAt,
    } = body

    // Acepta tanto diawiUrl como diawi_link para compatibilidad
    const finalDiawiUrl = diawiUrl || diawi_link

    if (!version || !build || !finalDiawiUrl) {
      console.error("[API] Faltan campos requeridos:", {
        tieneVersion: !!version,
        tieneBuild: !!build,
        tieneDiawiUrl: !!finalDiawiUrl,
      })
      return NextResponse.json(
        { error: "Faltan campos requeridos: version, build, diawiUrl (o diawi_link)" },
        { status: 400 }
      )
    }

    // Extraer el código de Diawi
    const downloadUrl = getDiawiDownloadUrl(finalDiawiUrl)
    const url = new URL(downloadUrl)
    const code = url.pathname.replace(/^\//, "")

    // Si no se proporcionó fileSize, intentar extraerlo desde Diawi
    let finalFileSize = fileSize ? parseInt(fileSize) : null
    
    if (!finalFileSize) {
      try {
        // Obtener el tamaño desde Diawi
        const extractedSize = await getDiawiFileSize(code)
        if (extractedSize) {
          finalFileSize = extractedSize
        } else {
          console.warn("[API] No se pudo extraer el tamaño desde Diawi")
        }
      } catch (error) {
        console.error("[API] Error al extraer tamaño desde Diawi:", error)
      }
    }

    // Extraer detalles adicionales del APK desde Diawi
    let appDetails: {
      packageName?: string
      minAndroid?: string
      targetAndroid?: string
      supportedScreens?: string
      supportedDensities?: string
      debuggable?: boolean
      permissions?: string
      signer?: string
      uploadedDate?: string
    } | null = null

    try {
      appDetails = await getDiawiAppDetails(code)
    } catch (error) {
      console.error("[API] Error al extraer detalles del APK desde Diawi:", error)
    }

    // Parsear uploadedDate si existe
    let parsedUploadedDate: Date | null = null
    if (appDetails?.uploadedDate) {
      try {
        parsedUploadedDate = new Date(appDetails.uploadedDate)
        if (isNaN(parsedUploadedDate.getTime())) {
          parsedUploadedDate = null
        }
      } catch {
        parsedUploadedDate = null
      }
    }

    // Guardar en PostgreSQL usando Prisma (NO Supabase)
    const newVersion = await prisma.version.create({
      data: {
        appName,
        version,
        build: parseInt(build),
        diawiUrl: finalDiawiUrl,
        fileSize: finalFileSize,
        changelog: changelog || null,
        releaseType,
        packageName: appDetails?.packageName || null,
        minAndroid: minAndroid || appDetails?.minAndroid || null,
        targetAndroid: appDetails?.targetAndroid || null,
        architectures: architectures || null,
        supportedScreens: appDetails?.supportedScreens || null,
        supportedDensities: appDetails?.supportedDensities || null,
        debuggable: appDetails?.debuggable ?? null,
        permissions: appDetails?.permissions || null,
        signer: appDetails?.signer || null,
        uploadedDate: parsedUploadedDate,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    // Convertir las fechas de Date a string para el tipo Version
    const versionWithStringDates = {
      ...newVersion,
      releaseDate: newVersion.releaseDate.toISOString(),
      createdAt: newVersion.createdAt.toISOString(),
      updatedAt: newVersion.updatedAt.toISOString(),
      expiresAt: newVersion.expiresAt ? newVersion.expiresAt.toISOString() : null,
      uploadedDate: newVersion.uploadedDate ? newVersion.uploadedDate.toISOString() : null,
    }

    return NextResponse.json(
      {
        message: "Versión registrada",
        version: versionWithStringDates,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] Error creating version:", error)
    console.error("[API] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: "Error al crear la versión" },
      { status: 500 }
    )
  }
}

