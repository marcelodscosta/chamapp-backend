import { IStorageProvider } from './IStorageProvider'

export class InMemoryStorageProvider implements IStorageProvider {
  public files: Map<string, Buffer> = new Map()

  async saveFile(
    file: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<string> {
    this.files.set(fileName, file)
    return `http://localhost:3333/uploads/${fileName}`
  }

  async deleteFile(fileName: string): Promise<void> {
    this.files.delete(fileName)
  }
}
