import { Header } from "@/components/header"
import { PropositoPortal } from "@/components/acerca/PropositoPortal"
import { MantenimientoActualizaciones } from "@/components/acerca/MantenimientoActualizaciones"
import { ReportarError } from "@/components/acerca/ReportarError"
import { InstalacionAndroid } from "@/components/acerca/InstalacionAndroid"
import { AvisosLegales } from "@/components/acerca/AvisosLegales"

export default function AcercaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Acerca del Sistema</h1>
            <p className="text-muted-foreground">
              Información sobre el Portal de Descargas
            </p>
          </div>

          <PropositoPortal />
          <MantenimientoActualizaciones />
          <ReportarError />
          <InstalacionAndroid />
          <AvisosLegales />
        </div>
      </main>
    </div>
  )
}

