import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from 'server/database/schemas/places.schema';
import { PlaceDto } from 'server/models/place.dto';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placesModel: Model<Place>) { }

  async findAll(): Promise<Place[]> {
    return this.placesModel.find().exec();
  }

  async create(place: PlaceDto): Promise<Place> {
    const createdPlace = new this.placesModel(place);
    return createdPlace.save();

  }

  async update(id: string, updatePlaceDto: PlaceDto): Promise<Place> {
    return this.placesModel.findByIdAndUpdate(id, updatePlaceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    await this.placesModel.findByIdAndDelete(id).exec();
    return true
  }
}
