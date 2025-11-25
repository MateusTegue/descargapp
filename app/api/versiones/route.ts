// Endpoint alternativo en español para compatibilidad
// Redirige al endpoint principal /api/versions
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    const versionsWithStringDates = versions.map((version: {
      releaseDate: Date
      createdAt: Date
      updatedAt: Date
      expiresAt: Date | null
      [key: string]: unknown
    }) => ({
      ...version,
      releaseDate: version.releaseDate.toISOString(),
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      expiresAt: version.expiresAt ? version.expiresAt.toISOString() : null,
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
    console.log("🔔 [API] POST /api/versiones - Iniciando...")
    console.log("📥 [API] Headers recibidos:", JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))
    
    const body = await request.json()
    console.log("📦 [API] Body recibido:", JSON.stringify(body, null, 2))

    const {
      appName = "A C Soluciones",
      version,
      build,
      diawiUrl,
      diawi_link, // Campo en español para compatibilidad
      fileSize,
      changelog,
      releaseType = "Release",
      minAndroid,
      architectures,
      expiresAt,
    } = body

    console.log("🔍 [API] Datos extraídos:", {
      version,
      build,
      diawiUrl,
      diawi_link,
      appName,
      releaseType,
    })

    // Acepta tanto diawiUrl como diawi_link
    const finalDiawiUrl = diawiUrl || diawi_link
    console.log("🔗 [API] URL final de Diawi:", finalDiawiUrl)

    if (!version || !build || !finalDiawiUrl) {
      console.error("❌ [API] Faltan campos requeridos:", {
        tieneVersion: !!version,
        tieneBuild: !!build,
        tieneDiawiUrl: !!finalDiawiUrl,
      })
      return NextResponse.json(
        { error: "Faltan campos requeridos: version, build, diawiUrl (o diawi_link)" },
        { status: 400 }
      )
    }

    console.log("💾 [API] Guardando en base de datos...")
    // Guardar en PostgreSQL usando Prisma (NO Supabase)
    const newVersion = await prisma.version.create({
      data: {
        appName,
        version,
        build: parseInt(build),
        diawiUrl: finalDiawiUrl,
        fileSize: fileSize ? parseInt(fileSize) : null,
        changelog: changelog || null,
        releaseType,
        minAndroid: minAndroid || null,
        architectures: architectures || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    console.log("✅ [API] Versión creada exitosamente:", {
      id: newVersion.id,
      version: newVersion.version,
      build: newVersion.build,
    })

    // Convertir las fechas de Date a string para el tipo Version
    const versionWithStringDates = {
      ...newVersion,
      releaseDate: newVersion.releaseDate.toISOString(),
      createdAt: newVersion.createdAt.toISOString(),
      updatedAt: newVersion.updatedAt.toISOString(),
      expiresAt: newVersion.expiresAt ? newVersion.expiresAt.toISOString() : null,
    }

    return NextResponse.json(
      {
        message: "Versión registrada",
        version: versionWithStringDates,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ [API] Error creating version:", error)
    console.error("❌ [API] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: "Error al crear la versión" },
      { status: 500 }
    )
  }
}

