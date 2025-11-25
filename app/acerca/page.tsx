import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

          <Card>
            <CardHeader>
              <CardTitle>Propósito del Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Este portal ha sido diseñado para facilitar la distribución de versiones
                de la aplicación móvil de A C Soluciones. Permite a testers, clientes y
                usuarios internos acceder de manera sencilla a todas las versiones,
                tanto actuales como históricas, de la aplicación.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Este portal es mantenido por el equipo de desarrollo de A C Soluciones.
                Las versiones se actualizan automáticamente mediante GitHub Actions cada
                vez que se genera un nuevo build de la aplicación.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reportar un Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Si encuentras algún problema con el portal o con alguna versión de la
                aplicación, por favor contacta al equipo de desarrollo a través de los
                canales oficiales de comunicación de A C Soluciones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cómo Instalar Versiones en Android</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Método 1: Descarga Directa</h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Haz clic en el botón "Descargar" de la versión que deseas instalar</li>
                  <li>Se abrirá el enlace de Diawi en tu navegador</li>
                  <li>Sigue las instrucciones en pantalla para descargar e instalar el APK</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Método 2: Código QR</h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Accede a la página de detalles de la versión</li>
                  <li>Escanea el código QR con tu dispositivo Android</li>
                  <li>Sigue las instrucciones para instalar el APK</li>
                </ol>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota importante:</strong> Es posible que necesites habilitar
                  la instalación desde fuentes desconocidas en la configuración de
                  seguridad de tu dispositivo Android.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avisos Legales / Privacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Este portal es de uso interno y está destinado exclusivamente para
                testers, clientes y usuarios autorizados de A C Soluciones.
              </p>
              <p className="text-muted-foreground">
                Las versiones distribuidas a través de este portal son propiedad de
                A C Soluciones. El uso de estas versiones está sujeto a los términos
                y condiciones establecidos por la empresa.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

