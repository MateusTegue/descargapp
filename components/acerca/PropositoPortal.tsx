import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, History, Download, Shield } from "lucide-react"

export const PropositoPortal = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Propósito del Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Este portal ha sido diseñado para facilitar la distribución de versiones de la aplicación móvil de 
          <strong className="text-foreground"> A C Soluciones</strong>. Permite a testers, clientes y usuarios 
          internos acceder de manera sencilla y segura a todas las versiones, tanto actuales como históricas, 
          de la aplicación.
        </p>
        
        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Versiones disponibles:</strong> Las APK están disponibles en dos 
            versiones: <strong className="text-foreground">Dev</strong> (desarrollo) y <strong className="text-foreground">Prod</strong> (producción). 
            Puedes filtrar y descargar la versión que necesites desde el historial de versiones.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="flex gap-3">
            <History className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Historial Completo</h4>
              <p className="text-sm text-muted-foreground">
                Visualiza el historial completo de versiones y consulta los cambios realizados en cada actualización.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Descarga Directa</h4>
              <p className="text-sm text-muted-foreground">
                Descarga directamente los archivos APK desde nuestro portal de forma segura y rápida.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Estado de Versiones</h4>
              <p className="text-sm text-muted-foreground">
                Verifica el estado de cada versión (disponible, próxima a expirar o expirada) en tiempo real.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Acceso Centralizado</h4>
              <p className="text-sm text-muted-foreground">
                Accede a todas las versiones desde un único punto, sin necesidad de múltiples fuentes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

