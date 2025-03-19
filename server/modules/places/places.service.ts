import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from 'server/database/schemas/places.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placesModel: Model<Place>) { }

  async findAll(): Promise<Place[]> {
    return this.placesModel.find().exec();
  }
}
