import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from 'server/database/schemas/places.schema';
import { PLACES_TYPES } from 'server/enums/places.enum';
import { PlaceDto } from 'server/models/place.dto';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name)

  constructor(@InjectModel(Place.name) private placesModel: Model<Place>) { }

  async findAll(): Promise<Place[]> {
    this.logger.log('[findAll]')
    return this.placesModel.find().exec();
  }

  async create(place: PlaceDto): Promise<Place> {
    this.logger.log('[create] - ' + place.name)
    const createdPlace = new this.placesModel(place);
    try {
      const savedPlace = createdPlace.save();
      // Actualizar el costo de transporte del lugar de tipo 'Basic'
      const publicPlaces = await this.placesModel.find({ type: PLACES_TYPES.PUBLIC, zone: place.zone }).exec();
      let basicPlace = await this.placesModel.findOne({ type: PLACES_TYPES.BASIC, zone: place.zone }).exec();
      console.log(basicPlace)
      if (!basicPlace) {
        basicPlace = new this.placesModel({
          name: "Basic for Zone " + place.zone || 0,
          type: PLACES_TYPES.BASIC,
          zone: place.zone || 0,
          transportationCost: place.transportationCost,
        })
      }
      if (publicPlaces.length > 0 && basicPlace) {
        const averageTransportationCost =
          publicPlaces.reduce((sum, place) => sum + place.transportationCost, 0) /
          publicPlaces.length;
        basicPlace.transportationCost = averageTransportationCost * 1.2;
        await basicPlace.save();
      }
      return savedPlace
    } catch (err) {
      this.logger.error(`Error creating Place: ${err.message}`, err.stack, PlacesService.name);
      throw new Error('Error al crear el lugar');
    }
  }

  async update(id: string, updatePlaceDto: PlaceDto): Promise<Place> {
    this.logger.log(`[update] - ${id}`,)
    return this.placesModel.findByIdAndUpdate(id, updatePlaceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`[remove] - ${id}`,)
    await this.placesModel.findByIdAndDelete(id).exec();
    return true
  }
}
