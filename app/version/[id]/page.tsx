import { Header } from "@/components/header"
import { VersionDetails } from "@/components/version-details"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { Version } from "@/types/version"

async function getVersion(id: string): Promise<Version | null> {
  try {
    // Usar Prisma directamente en lugar de fetch para mayor confiabilidad
    console.log("🔍 [Version Page] Fetching version from database, ID:", id)
    
    const version = await prisma.version.findUnique({
      where: {
        id,
      },
    })

    if (!version) {
      console.error("❌ [Version Page] Version not found:", id)
      return null
    }

    // Convertir las fechas de Date a string para el tipo Version
    const versionWithStringDates: Version = {
      ...version,
      releaseDate: version.releaseDate.toISOString(),
      createdAt: version.createdAt.toISOString(),
      updatedAt: version.updatedAt.toISOString(),
      expiresAt: version.expiresAt ? version.expiresAt.toISOString() : null,
    }

    console.log("✅ [Version Page] Version fetched successfully:", version.id)
    return versionWithStringDates
  } catch (error) {
    console.error("❌ [Version Page] Error fetching version:", error)
    return null
  }
}

// Hacer la página completamente dinámica para evitar pre-renderizado durante el build
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default async function VersionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const version = await getVersion(params.id)

  if (!version) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <VersionDetails version={version} />
      </main>
    </div>
  )
}

