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
              <p className="text-muted-foreground mb-3">
                Este portal ha sido diseñado para facilitar la distribución de versiones
                de la aplicación móvil de A C Soluciones. Permite a testers, clientes y
                usuarios internos acceder de manera sencilla a todas las versiones,
                tanto actuales como históricas, de la aplicación.
              </p>
              <p className="text-muted-foreground">
                A través de esta plataforma, puedes visualizar el historial completo de versiones,
                consultar los cambios realizados en cada actualización, verificar el estado de cada
                versión (disponible, próxima a expirar o expirada) y descargar directamente los
                archivos APK desde nuestro portal de forma segura y rápida.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mantenimiento y Actualizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Este portal es mantenido por el equipo de desarrollo de A C Soluciones.
                Las versiones se actualizan automáticamente mediante GitHub Actions cada
                vez que se genera un nuevo build de la aplicación.
              </p>
              <p className="text-muted-foreground">
                Cuando se compila una nueva versión de la aplicación, el sistema de integración
                continua (CI/CD) se encarga automáticamente de subir el APK a Diawi, extraer
                la información relevante (versión, build, tamaño, changelog) y registrar la
                nueva versión en este portal. Todo este proceso ocurre de forma automática,
                garantizando que siempre tengas acceso a las últimas versiones disponibles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reportar un Error o Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Si encuentras algún problema con el portal o con alguna versión de la
                aplicación, por favor contacta al equipo de desarrollo a través de los
                canales oficiales de comunicación de A C Soluciones.
              </p>
              <p className="text-muted-foreground">
                Al reportar un problema, por favor incluye la siguiente información para
                facilitar la resolución:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2 ml-2">
                <li>Versión y build de la aplicación afectada</li>
                <li>Descripción detallada del problema</li>
                <li>Pasos para reproducir el error (si aplica)</li>
                <li>Modelo y versión de Android de tu dispositivo</li>
                <li>Capturas de pantalla (si son relevantes)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cómo Instalar Versiones en Android</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Método 1: Descarga Directa desde el Portal</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Navega al historial de versiones o accede a la página de detalles de la versión que deseas instalar</li>
                  <li>Haz clic en el botón "Descargar APK"</li>
                  <li>El archivo APK se descargará directamente desde el portal a tu dispositivo</li>
                  <li>Una vez completada la descarga, abre el archivo desde la barra de notificaciones o desde la carpeta de descargas</li>
                  <li>Si es la primera vez que instalas una app desde esta fuente, tu dispositivo te pedirá permiso para instalar aplicaciones desconocidas</li>
                  <li>Sigue las instrucciones en pantalla para completar la instalación</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Método 2: Código QR</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Accede a la página de detalles de la versión que deseas instalar</li>
                  <li>Localiza el código QR en la sección correspondiente</li>
                  <li>Escanea el código QR con la cámara de tu dispositivo Android</li>
                  <li>Se abrirá automáticamente el enlace de descarga en tu navegador</li>
                  <li>El APK se descargará directamente a tu dispositivo</li>
                  <li>Una vez completada la descarga, abre el archivo y sigue las instrucciones para instalar</li>
                </ol>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium mb-2 text-blue-900 dark:text-blue-100">
                  💡 Ventajas de la descarga directa
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Descarga rápida y directa desde nuestro portal</li>
                  <li>No necesitas salir del portal ni visitar sitios externos</li>
                  <li>Proceso de instalación simplificado</li>
                  <li>Mayor seguridad al descargar desde nuestro dominio</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium mb-2 text-yellow-900 dark:text-yellow-100">
                  ⚠️ Nota importante sobre seguridad
                </p>
                <p className="text-sm text-muted-foreground">
                  Para instalar aplicaciones desde este portal, necesitarás habilitar la opción 
                  <strong> "Instalar aplicaciones desconocidas"</strong> o <strong>"Fuentes desconocidas"</strong> 
                  en la configuración de seguridad de tu dispositivo Android. Esta opción se encuentra 
                  generalmente en <strong>Configuración → Seguridad → Fuentes desconocidas</strong> o 
                  <strong> Configuración → Aplicaciones → Instalar aplicaciones desconocidas</strong>, 
                  dependiendo de la versión de Android que uses.
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

