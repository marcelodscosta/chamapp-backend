export interface IStorageProvider {
  saveFile(file: Buffer, fileName: string, mimetype: string): Promise<string>
  deleteFile(fileName: string): Promise<void>
}
