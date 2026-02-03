import { Module } from '@nestjs/common';
import { PicnicsController } from './picnics.controller';
import { PicnicsService } from './picnics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Picnic, PicnicsSchema } from 'server/database/schemas/picnics.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Picnic.name, schema: PicnicsSchema }])],
  controllers: [PicnicsController],
  providers: [PicnicsService]
})
export class PicnicsModule { }
