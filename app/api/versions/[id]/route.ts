import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

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

    return NextResponse.json(version)
  } catch (error) {
    console.error("Error fetching version:", error)
    return NextResponse.json(
      { error: "Error al obtener la versión" },
      { status: 500 }
    )
  }
}

