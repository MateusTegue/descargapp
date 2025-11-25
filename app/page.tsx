import { Header } from "@/components/header"
import { VersionList } from "@/components/version-list"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Historial de Versiones</h1>
          <p className="text-muted-foreground">
            Todas las versiones disponibles de la aplicación móvil
          </p>
        </div>
        <VersionList />
      </main>
    </div>
  )
}

