import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from 'server/database/schemas/places.schema';
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
      return createdPlace.save();
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
