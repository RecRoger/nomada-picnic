import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)

  constructor() { }

  public saveFiles(files: Express.Multer.File[], prefix: string = 'Image', folder: string = ''): string[] {
    this.logger.log(`[saveFiles] save ${files.length} files on ${folder}/{${prefix}}`)
    let urls = []
    if (files && files.length > 0) {
      const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', folder); // Ruta de la carpeta uploads/places
      // Verificar si la carpeta existe y crearla si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      urls = files.map((file, index) => {
        const newFileName = `${prefix}[${index}]${path.extname(file.originalname)}`; // Generar nombre de archivo único
        const imageUrl = `/uploads/${folder}/${newFileName}`; // Generar URL única
        fs.writeFileSync(path.join(uploadDir, newFileName), file.buffer); // Guardar archivo en el sistema de archivos
        this.logger.log(`[saveFiles] file ${imageUrl} saved`)
        return imageUrl;
      });
    }

    return urls
  }


}
