import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'node:path';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  private storage = new Storage({
    projectId: 'nomada-picnic-490523'
  });
  private bucketName = process.env.GCP_STORAGE_BUCKET;

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

    this.logger.log(`[saveFiles]: de ${prefix}`);
    const bucket = this.storage.bucket(this.bucketName);

    try {
      const savePromises = files.map(async (file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.originalname);

        // El nombre del archivo sigue la misma lógica que ya tenías
        const fileName = `${folder}/${prefix}-${timestamp}-${randomString}${extension}`;
        const blob = bucket.file(fileName);

        await blob.save(file.buffer, {
          contentType: file.mimetype,
          resumable: false,
        });

        return fileName;
      });

      return await Promise.all(savePromises);
    } catch (error) {
      this.logger.error(`Error al subir a GCS: ${error.message}`);
      throw new InternalServerErrorException('No se pudieron guardar las imágenes en la nube');
    }
  }
}
