import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'node:fs/promises'; // Usamos la versión de promesas
import { existsSync, mkdirSync } from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  // Definimos la raíz de subidas relativa a la carpeta de la API
  private readonly rootUploadPath = path.join(process.cwd(), 'uploads');

  /**
   * Guarda múltiples archivos en el disco
   * @param files Archivos provenientes de Multer
   * @param prefix Prefijo para el nombre (ej: 'place')
   * @param folder Subcarpeta (ej: 'places')
   */
  async saveFiles(
    files: Express.Multer.File[],
    prefix: string = 'image',
    folder: string = '',
  ): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const targetDir = path.join(this.rootUploadPath, folder);

    try {
      // 1. Asegurar que la carpeta existe (Sync está bien aquí al ser inicialización)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      // 2. Procesar archivos de forma asíncrona
      const savePromises = files.map(async (file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.originalname);

        // Ejemplo: place-1707050000-a2b3c4.jpg
        const fileName = `${prefix}-${timestamp}-${randomString}${extension}`;
        const filePath = path.join(targetDir, fileName);

        await fs.writeFile(filePath, file.buffer);

        const publicUrl = `/uploads/${folder}/${fileName}`;
        this.logger.log(`[FilesService] Guardado: ${publicUrl}`);

        return publicUrl;
      });

      return await Promise.all(savePromises);
    } catch (error) {
      this.logger.error(`Error al guardar archivos: ${error.message}`);
      throw new InternalServerErrorException(
        'No se pudieron guardar las imágenes',
      );
    }
  }
}
