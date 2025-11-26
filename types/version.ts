export interface Version {
  id: string
  appName: string
  version: string
  build: number
  diawiUrl: string
  releaseDate: string
  fileSize: number | null
  changelog: string | null
  releaseType: string
  packageName: string | null
  minAndroid: string | null
  targetAndroid: string | null
  architectures: string | null
  supportedScreens: string | null
  supportedDensities: string | null
  debuggable: boolean | null
  permissions: string | null
  signer: string | null
  uploadedDate: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

