import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PicnicEventsController } from './picnic-events.controller';
import { PicnicEventsService } from './picnic-events.service';
import { PicnicEvent, PicnicEventSchema } from 'src/common/database/schemas/picnic-events.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PicnicEvent.name, schema: PicnicEventSchema },
    ])
  ],
  controllers: [PicnicEventsController],
  providers: [PicnicEventsService],
})
export class PicnicEventsModule { }