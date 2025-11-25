import { Header } from "@/components/header"
import { VersionDetails } from "@/components/version-details"
import { notFound } from "next/navigation"
import type { Version } from "@/types/version"

async function getVersion(id: string): Promise<Version | null> {
  try {
    // Durante el build, no podemos hacer fetch a la API
    // Retornamos null y se manejará en runtime
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return null
    }

    // Usar fetch en lugar de Prisma directo para evitar problemas en build time
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    
    const response = await fetch(`${baseUrl}/api/versions/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const version = await response.json()
    return version
  } catch (error) {
    console.error("Error fetching version:", error)
    return null
  }
}

// Hacer la página completamente dinámica para evitar pre-renderizado durante el build
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

// Evitar que Next.js intente generar estáticamente esta ruta durante el build
export async function generateStaticParams() {
  return []
}

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

