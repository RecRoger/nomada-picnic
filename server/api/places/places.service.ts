import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from 'server/database/schemas/places.schema';
import { PLACES_TYPES } from 'server/enums/places.enum';
import { PlaceDto, PlaceLocation } from 'server/models/place.dto';
import { FilesService } from 'server/api/files/files.service';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name)

  constructor(
    @InjectModel(Place.name) private placesModel: Model<Place>,
    private filesService: FilesService,
  ) { }

  async findAll(type?: string): Promise<Place[]> {
    this.logger.log('[findAll]')
    const places = await (!type ? this.placesModel.find().exec() : this.placesModel.find({ type }).exec());
    return places.sort((a, b) => {
      // Comparar zonas
      if (a.zone !== b.zone) {
        return a.zone - b.zone;
      }
      // Comparar nombres (prioridad a "Basic")
      const aHasBasic = a.name.includes('Basic') ? 0 : 1;
      const bHasBasic = b.name.includes('Basic') ? 0 : 1;
      return aHasBasic - bHasBasic || a.name.localeCompare(b.name);
    })
  }

  async create(place: PlaceDto, files: Express.Multer.File[]): Promise<Place> {
    this.logger.log('[create] - ' + place.name)

    try {
      if (typeof place.location === 'string') {
        place.location = this.castLocation(place.location)
      }
      if (files && files.length > 0) {
        place.images = this.filesService.saveFiles(files, place.name.replaceAll(' ', '-'), 'places')
      }
      const createdPlace = new this.placesModel(place);
      const savedPlace = await createdPlace.save();
      await this.evaluateZoneCost(place.zone)

      return savedPlace
    } catch (err) {
      this.logger.error(`Error creating Place: ${err.message}`, err.stack);
      throw new Error('Error al crear el lugar');
    }
  }

  async update(id: string, place: PlaceDto, files?: Express.Multer.File[]): Promise<Place> {
    this.logger.log(`[update] - ${id}`,)
    try {
      if (typeof place.location === 'string') {
        place.location = this.castLocation(place.location)
      }
      if (files && files.length > 0) {
        place.images = this.filesService.saveFiles(files, place.name.replaceAll(' ', '-'), 'places')
      }
      const update = await this.placesModel.findByIdAndUpdate(id, place, { new: true }).exec();
      await this.evaluateZoneCost(update.zone)
      return update
    } catch (err) {
      this.logger.error(`Error update Place: ${err.message}`, err.stack);
      throw new Error('Error al guardar el lugar');
    }
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.placesModel.findByIdAndDelete(id).exec();
    return true
  }

  private castLocation(location: any): PlaceLocation {
    const parseLocation: any = JSON.parse(location as any) || {}
    return {
      lat: Number(parseLocation.lat),
      lng: Number(parseLocation.lng),
    }
  }

  private async evaluateZoneCost(zone: number): Promise<void> {
    this.logger.log(`[evaluateZoneCost] - Zone ${zone}`,)
    try {
      const publicPlaces = await this.placesModel.find({ type: PLACES_TYPES.PUBLIC, zone: zone }).exec();
      let basicPlace = await this.placesModel.findOne({ type: PLACES_TYPES.BASIC, zone: zone }).exec();
      if (!basicPlace) {
        this.logger.log(`Create new basic Zone`,)
        basicPlace = new this.placesModel({
          name: "Basic Zone " + zone || 0,
          type: PLACES_TYPES.BASIC,
          zone: zone || 0,
          transportationCost: 0,
        })
      }
      if (publicPlaces.length > 0 && basicPlace) {
        const averageTransportationCost =
          publicPlaces.reduce((sum, place) => sum + place.transportationCost, 0) /
          publicPlaces.length;
        // el costo por zona es el promedio mas el 20%
        basicPlace.transportationCost = averageTransportationCost * 1.2;
        await basicPlace.save();
        this.logger.log(`Basic Zone ${zone} Updated`,)
      }
    } catch (err) {
      this.logger.error(`Error update BaseCost: ${err.message}`, err.stack);
    }
  }
}
