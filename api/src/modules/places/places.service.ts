import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlacesTypes } from '@shared/enums';
import { Model } from 'mongoose';
import { PlaceDto } from 'src/common/models/place.dto';
import { Place, PlacesDocument } from 'src/common/database/schemas/places.schema';
import { FilesService } from 'src/modules/files/files.service';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(
    @InjectModel(Place.name) private placesModel: Model<PlacesDocument>,
    private filesService: FilesService,
  ) { }

  async findPlace(type?: string): Promise<PlaceDto[]> {
    this.logger.log('[findPlace]', 'type:' + (type || 'all'));
    const placesQuery = await (!type
      ? this.placesModel.find().exec()
      : this.placesModel.find({ type }, { transportationCost: 0 }).exec());

    const places = placesQuery as unknown as PlaceDto[];
    this.logger.log(`[places found : ${places.length}]`);

    return places.sort((a, b) => {
      // Comparar zonas
      if (a.zone !== b.zone) {
        return a.zone - b.zone;
      }
      // Comparar nombres (prioridad a "Basic")
      const aHasBasic = a.name.includes('Basic') ? 0 : 1;
      const bHasBasic = b.name.includes('Basic') ? 0 : 1;
      return aHasBasic - bHasBasic || a.name.localeCompare(b.name);
    });
  }

  async create(place: PlaceDto, files: Express.Multer.File[]): Promise<PlaceDto> {
    this.logger.log('[create]', place.name);

    try {
      if (files && files.length > 0) {
        place.images = await this.filesService.saveFiles(
          files,
          place.name.replaceAll(' ', '-'),
          'places',
        );
      }
      const createdPlace = new this.placesModel(place);
      const savedPlace = (await createdPlace.save()) as unknown as PlaceDto;
      this.logger.log('[place created]')
      await this.evaluateZoneCost(place.zone);

      return savedPlace;
    } catch (err) {
      this.logger.error(` - Error creating Place: ${err.message}`, err.stack);
      throw new Error('Error al crear el lugar');
    }
  }

  async update(
    id: string,
    place: PlaceDto,
    files?: Express.Multer.File[],
  ): Promise<PlaceDto> {
    this.logger.log(`[update]`, `id: ${id}`);
    try {
      if (files && files.length > 0) {
        place.images = await this.filesService.saveFiles(
          files,
          place.name.replaceAll(' ', '-'),
          'places',
        );
      }
      const update = await this.placesModel
        .findByIdAndUpdate(id, place, { new: true })
        .exec();
      this.logger.log('[place updated]')
      await this.evaluateZoneCost(update?.zone);
      return place;
    } catch (err) {
      this.logger.error(`Error update Place: ${err.message}`, err.stack);
      throw new Error('Error al guardar el lugar');
    }
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log('[removed]', `id: ${id}`);
    await this.placesModel.findByIdAndDelete(id).exec();
    this.logger.log('[place removed]');
    return true;
  }

  private async evaluateZoneCost(zone: number = 0): Promise<void> {
    this.logger.log('[evaluateZoneCost]', `Zone: ${zone}`);
    try {
      const publicPlaces = await this.placesModel
        .find({ type: PlacesTypes.PUBLIC, zone: zone })
        .exec();
      let basicPlace = await this.placesModel
        .findOne({ type: PlacesTypes.BASIC, zone: zone })
        .exec();
      if (!basicPlace) {
        this.logger.log(`- Create new basic Zone`);
        basicPlace = new this.placesModel({
          name: 'Basic Zone ' + zone || 0,
          type: PlacesTypes.BASIC,
          zone: zone || 0,
          transportationCost: 0,
        });
      }
      if (publicPlaces.length > 0 && basicPlace) {
        const averageTransportationCost =
          publicPlaces.reduce(
            (sum, place) => sum + place.transportationCost,
            0,
          ) / publicPlaces.length;
        // el costo por zona es el promedio mas el 20%
        basicPlace.transportationCost = averageTransportationCost * 1.2;
        await basicPlace.save();
        this.logger.log(`[Basic Zone ${zone} updated]`);
      }
    } catch (err) {
      this.logger.error(` - Error update BaseCost: ${err.message}`, err.stack);
    }
  }
}
