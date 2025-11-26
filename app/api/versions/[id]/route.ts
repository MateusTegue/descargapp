import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Forzar que esta ruta sea completamente dinámica
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const version = await prisma.version.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!version) {
      return NextResponse.json(
        { error: "Versión no encontrada" },
        { status: 404 }
      )
    }

    // Convertir las fechas de Date a string para el tipo Version
    const versionWithStringDates = {
      ...version,
      releaseDate: version.releaseDate.toISOString(),
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      expiresAt: version.expiresAt ? version.expiresAt.toISOString() : null,
      uploadedDate: version.uploadedDate ? version.uploadedDate.toISOString() : null,
    }

    return NextResponse.json(versionWithStringDates)
  } catch (error) {
    console.error("Error fetching version:", error)
    return NextResponse.json(
      { error: "Error al obtener la versión" },
      { status: 500 }
    )
  }
}

