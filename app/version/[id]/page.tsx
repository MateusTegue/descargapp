import { Header } from "@/components/header"
import { VersionDetails } from "@/components/version-details"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

async function getVersion(id: string) {
  try {
    const version = await prisma.version.findUnique({
      where: {
        id,
      },
    })
    return version
  } catch (error) {
    console.error("Error fetching version:", error)
    return null
  }
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

