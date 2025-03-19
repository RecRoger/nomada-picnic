import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlacesSchema } from 'server/database/schemas/places.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Place.name, schema: PlacesSchema }])],
  controllers: [PlacesController],
  providers: [PlacesService]
})
export class PlacesModule { }
