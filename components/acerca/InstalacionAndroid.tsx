import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Download, QrCode, Lightbulb, AlertTriangle } from "lucide-react"

export const InstalacionAndroid = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Cómo Instalar Versiones en Android
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información sobre dev y prod */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Nota:</strong> Este portal ofrece versiones en dos entornos: 
            <strong className="text-foreground"> Dev</strong> (desarrollo) y <strong className="text-foreground">Prod</strong> (producción). 
            Asegúrate de seleccionar el filtro correspondiente en el historial de versiones para descargar la versión que necesitas.
          </p>
        </div>

        {/* Método 1 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
            <Download className="h-5 w-5 text-primary" />
            Método 1: Descarga Directa desde el Portal
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
            <li>Navega al historial de versiones y selecciona el filtro <strong className="text-foreground">Dev</strong> o <strong className="text-foreground">Prod</strong> según necesites</li>
            <li>Accede a la página de detalles de la versión que deseas instalar</li>
            <li>Haz clic en el botón <strong className="text-foreground">"Descargar APK"</strong></li>
            <li>El archivo APK se descargará directamente desde el portal a tu dispositivo</li>
            <li>Una vez completada la descarga, abre el archivo desde la barra de notificaciones o desde la carpeta de descargas</li>
            <li>Si es la primera vez que instalas una app desde esta fuente, tu dispositivo te pedirá permiso para instalar aplicaciones desconocidas</li>
            <li>Sigue las instrucciones en pantalla para completar la instalación</li>
          </ol>
        </div>

        {/* Método 2 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
            <QrCode className="h-5 w-5 text-primary" />
            Método 2: Código QR
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
            <li>Navega al historial de versiones y selecciona el filtro <strong className="text-foreground">Dev</strong> o <strong className="text-foreground">Prod</strong> según necesites</li>
            <li>Accede a la página de detalles de la versión que deseas instalar</li>
            <li>Localiza el código QR en la sección correspondiente</li>
            <li>Escanea el código QR con la cámara de tu dispositivo Android</li>
            <li>Se abrirá automáticamente el enlace de descarga en tu navegador</li>
            <li>El APK se descargará directamente a tu dispositivo</li>
            <li>Una vez completada la descarga, abre el archivo y sigue las instrucciones para instalar</li>
          </ol>
        </div>

        {/* Ventajas */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                Ventajas de la descarga directa
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Descarga rápida y directa desde nuestro portal</li>
                <li>No necesitas salir del portal ni visitar sitios externos</li>
                <li>Proceso de instalación simplificado</li>
                <li>Mayor seguridad al descargar desde nuestro dominio</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nota de seguridad */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                Nota importante sobre seguridad
              </p>
              <p className="text-sm text-muted-foreground">
                Para instalar aplicaciones desde este portal, necesitarás habilitar la opción 
                <strong className="text-foreground"> "Instalar aplicaciones desconocidas"</strong> o 
                <strong className="text-foreground"> "Fuentes desconocidas"</strong> en la configuración de 
                seguridad de tu dispositivo Android. Esta opción se encuentra generalmente en 
                <strong className="text-foreground"> Configuración → Seguridad → Fuentes desconocidas</strong> o 
                <strong className="text-foreground"> Configuración → Aplicaciones → Instalar aplicaciones desconocidas</strong>, 
                dependiendo de la versión de Android que uses.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

