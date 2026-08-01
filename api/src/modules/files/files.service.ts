import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as path from 'node:path';
import sharp from 'sharp';
import decodeHeic = require('heic-decode'); // Importación robusta compatible con CJS/ESM

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  private storage = new Storage({
    projectId: 'nomada-picnic-490523'
  });
  private bucketName = process.env.GCP_STORAGE_BUCKET;

  private async processAndConvertImage(
    file: Express.Multer.File,
  ): Promise<{ buffer: Buffer; extension: string; mimetype: string }> {
    const extension = path.extname(file.originalname).toLowerCase();
    const isHeic =
      extension === '.heic' ||
      file.mimetype === 'image/heic' ||
      file.mimetype === 'image/heif';

    if (isHeic) {
      this.logger.log(
        `[processAndConvertImage]: Convirtiendo ${file.originalname} de HEIC a JPEG mediante decodificador raw...`,
      );

      try {
        // 1. Decodificamos la estructura HEIC a datos de píxeles RGBA descompresionados (WASM/JS)
        const { width, height, data } = await decodeHeic({ buffer: file.buffer });

        // 2. Pasamos la matriz de píxeles raw directamente a Sharp
        const convertedBuffer = await sharp(Buffer.from(data), {
          raw: {
            width,
            height,
            channels: 4, // RGBA
          },
        })
          .jpeg({ quality: 80 })
          .toBuffer();

        return {
          buffer: convertedBuffer,
          extension: '.jpg',
          mimetype: 'image/jpeg',
        };
      } catch (error) {
        this.logger.error(`Error al procesar archivo HEIC: ${error.message}`);
        throw new InternalServerErrorException(
          `No se pudo decodificar el archivo HEIC: ${file.originalname}`,
        );
      }
    }

    return {
      buffer: file.buffer,
      extension: extension,
      mimetype: file.mimetype,
    };
  }

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
        // 1. Procesamos la imagen (convertimos si es HEIC)
        const processedImage = await this.processAndConvertImage(file);

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);

        // 2. Armamos la ruta asegurando que la extensión sea la procesada (.jpg si era HEIC)
        const fileName = `${folder}/${prefix}-${timestamp}-${randomString}${processedImage.extension}`;
        const blob = bucket.file(fileName);

        // 3. Guardamos el buffer procesado en Google Cloud Storage
        await blob.save(processedImage.buffer, {
          contentType: processedImage.mimetype,
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
