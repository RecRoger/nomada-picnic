import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlacesSchema } from 'src/common/database/schemas/places.schema';
import { FilesService } from 'src/modules/files/files.service';
import { FilesModule } from 'src/modules/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlacesSchema }]),
    FilesModule,
  ],
  controllers: [PlacesController],
  providers: [PlacesService, FilesService],
})
export class PlacesModule { }
