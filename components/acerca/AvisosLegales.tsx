import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText } from "lucide-react"

export const AvisosLegales = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Avisos Legales / Privacidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Uso Interno y Restringido</h4>
            <p className="text-muted-foreground">
              Este portal es de uso interno y está destinado exclusivamente para testers, clientes y usuarios 
              autorizados de <strong className="text-foreground">A C Soluciones</strong>. El acceso no autorizado 
              está estrictamente prohibido.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Propiedad Intelectual</h4>
            <p className="text-muted-foreground">
              Las versiones distribuidas a través de este portal son propiedad de 
              <strong className="text-foreground"> A C Soluciones</strong>. El uso de estas versiones está sujeto 
              a los términos y condiciones establecidos por la empresa. Cualquier uso no autorizado, distribución 
              o modificación de estas versiones está prohibido.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Nota:</strong> Al utilizar este portal y descargar versiones de la 
            aplicación, aceptas cumplir con todos los términos y condiciones establecidos por A C Soluciones. 
            Si tienes alguna pregunta sobre el uso permitido, por favor contacta al equipo de desarrollo.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

