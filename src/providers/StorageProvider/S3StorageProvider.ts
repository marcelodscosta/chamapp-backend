import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { IStorageProvider } from './IStorageProvider'
import { env } from '../../env'

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client | null = null

  constructor() {
    if (
      env.B2_ACCESS_KEY_ID &&
      env.B2_SECRET_ACCESS_KEY &&
      env.B2_ENDPOINT &&
      env.B2_REGION
    ) {
      this.client = new S3Client({
        region: env.B2_REGION,
        endpoint: env.B2_ENDPOINT,
        credentials: {
          accessKeyId: env.B2_ACCESS_KEY_ID,
          secretAccessKey: env.B2_SECRET_ACCESS_KEY,
        },
      })
    }
  }

  async saveFile(
    file: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<string> {
    if (!this.client || !env.B2_BUCKET) {
      console.warn(
        '⚠️ S3StorageProvider: Credenciais B2 não configuradas. Usando mock (fake URL).',
      )
      return `http://localhost:3333/uploads/${fileName}`
    }

    const command = new PutObjectCommand({
      Bucket: env.B2_BUCKET,
      Key: fileName,
      Body: file,
      ContentType: mimetype,
    })

    await this.client.send(command)

    const baseUrl =
      env.B2_PUBLIC_BASE_URL ??
      `https://f000.backblazeb2.com/file/${env.B2_BUCKET}`
    return `${baseUrl}/${fileName}`
  }

  async deleteFile(fileName: string): Promise<void> {
    if (!this.client || !env.B2_BUCKET) {
      return
    }

    const command = new DeleteObjectCommand({
      Bucket: env.B2_BUCKET,
      Key: fileName,
    })

    await this.client.send(command)
  }
}
