import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileText, Smartphone, Camera, Bug } from "lucide-react"

export const ReportarError = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Reportar un Error o Problema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Si encuentras algún problema con el portal o con alguna versión de la aplicación, por favor contacta 
          al equipo de desarrollo a través de los canales oficiales de comunicación de 
          <strong className="text-foreground"> A C Soluciones</strong>.
        </p>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Información a incluir en el reporte
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Al reportar un problema, por favor incluye la siguiente información para facilitar la resolución:
          </p>
          
          <ul className="space-y-3">
            <li className="flex gap-3">
              <Bug className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-foreground">Versión, build y tipo de versión</strong>
                <p className="text-sm text-muted-foreground">
                  Especifica la versión exacta, el número de build y si es <strong className="text-foreground">Dev</strong> o 
                  <strong className="text-foreground"> Prod</strong> donde ocurre el problema
                </p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-foreground">Descripción detallada del problema</strong>
                <p className="text-sm text-muted-foreground">
                  Proporciona una descripción clara y completa del error o comportamiento inesperado
                </p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-foreground">Pasos para reproducir el error</strong>
                <p className="text-sm text-muted-foreground">
                  Si aplica, describe los pasos exactos que llevan a reproducir el problema
                </p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-foreground">Modelo y versión de Android</strong>
                <p className="text-sm text-muted-foreground">
                  Especifica el modelo de dispositivo y la versión de Android que estás utilizando
                </p>
              </div>
            </li>
            
            <li className="flex gap-3">
              <Camera className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-foreground">Capturas de pantalla</strong>
                <p className="text-sm text-muted-foreground">
                  Si son relevantes, adjunta capturas de pantalla que muestren el problema
                </p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

