import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, GitBranch, Zap, CheckCircle2 } from "lucide-react"

export const MantenimientoActualizaciones = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Mantenimiento y Actualizaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Este portal es mantenido por el equipo de desarrollo de <strong className="text-foreground">A C Soluciones</strong>. 
          Las versiones se actualizan automáticamente mediante <strong className="text-foreground">GitHub Actions</strong> cada 
          vez que se genera un nuevo build de la aplicación.
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="flex gap-3">
            <GitBranch className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Integración Continua (CI/CD)</h4>
              <p className="text-sm text-muted-foreground">
                Cuando se compila una nueva versión de la aplicación, el sistema de integración continua se encarga 
                automáticamente de todo el proceso de distribución.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Proceso Automatizado</h4>
              <p className="text-sm text-muted-foreground">
                El sistema sube automáticamente el APK a Diawi, extrae la información relevante (versión, build, 
                tamaño, changelog) y registra la nueva versión en este portal. Tanto las versiones <strong className="text-foreground">dev</strong> como 
                <strong className="text-foreground"> prod</strong> se actualizan automáticamente cuando se generan nuevos builds.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Disponibilidad Garantizada</h4>
              <p className="text-sm text-muted-foreground">
                Todo este proceso ocurre de forma automática, garantizando que siempre tengas acceso a las últimas 
                versiones disponibles sin intervención manual.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

