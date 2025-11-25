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
  minAndroid: string | null
  architectures: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

